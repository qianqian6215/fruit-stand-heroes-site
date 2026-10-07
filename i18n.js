'use strict';
(() => {
  const script = document.currentScript;
  const root = new URL('.', script.src);
  const version = new URL(script.src).search;
  const locales = [['en','English'],['zh-Hans','简体中文'],['zh-Hant','繁體中文'],['ja','日本語'],['ko','한국어'],['th','ไทย'],['id','Bahasa Indonesia'],['vi','Tiếng Việt'],['pt-BR','Português (Brasil)'],['es-419','Español (Latinoamérica)'],['fr','Français'],['de','Deutsch']];
  const codes = new Set(locales.map(([code]) => code));
  function match(value) {
    if (!value) return null;
    const code = value.toLowerCase();
    const exact = locales.find(([key]) => key.toLowerCase() === code);
    if (exact) return exact[0];
    if (code.startsWith('zh')) return /hant|tw|hk|mo/.test(code) ? 'zh-Hant' : 'zh-Hans';
    if (code.startsWith('pt')) return 'pt-BR';
    if (code.startsWith('es')) return 'es-419';
    return locales.find(([key]) => key === code.split('-')[0])?.[0] || null;
  }
  let saved; try { saved = localStorage.getItem('fruit-site-language'); } catch {}
  let active = 'en';
  const requested = match(new URL(location.href).searchParams.get('lang')) || match(saved) || (navigator.languages || [navigator.language]).map(match).find(Boolean) || 'en';
  const control = document.createElement('label'); control.className = 'language-control'; control.dataset.noTranslate = '';
  const label = document.createElement('span'); label.textContent = 'Language';
  const select = document.createElement('select'); select.id = 'site-language'; select.setAttribute('aria-label','Language');
  for (const [code,name] of locales) { const option = document.createElement('option'); option.value = code; option.lang = code; option.textContent = name; select.append(option); }
  control.append(label, select);
  const host = document.querySelector('#main-nav') || document.querySelector('main');
  if (host?.id === 'main-nav') host.append(control); else host?.prepend(control);
  const textSources = new WeakMap(); const attributeSources = new WeakMap();
  let english = {}; let dictionary = {}; let lookup = new Map(); let sequence = 0;
  const cache = new Map();
  const gameplayMedia = {
    en: { video: 'media/sunny-market-gameplay-ios-20260906.mp4', poster: 'assets/gameplay-ios-20260906.jpg' },
    id: { video: 'media/gameplay-id-20261007.mp4', poster: 'assets/gameplay-id-20261007.jpg' },
    th: { video: 'media/gameplay-th-20261007.mp4', poster: 'assets/gameplay-th-20261007.jpg' },
  };
  const storeCampaigns = {
    en: 'official_site_sep2026',
    id: 'official_site_id_oct2026',
    th: 'official_site_th_oct2026',
  };
  const campaignAliases = {
    'ph-offline': 'official_site_ph_offline_oct2026',
  };
  const campaignAlias = new URL(location.href).searchParams.get('campaign');
  const campaignOverride = campaignAliases[campaignAlias] || null;
  async function bundle(code) {
    if (!cache.has(code)) cache.set(code, fetch(new URL(`locales/${code}.json${version}`,root)).then(r => {if(!r.ok) throw Error('Language unavailable'); return r.json();}).catch(error => {cache.delete(code); throw error;}));
    return cache.get(code);
  }
  function translate(source) {
    const id = lookup.get(source);
    if (id !== undefined) return dictionary[id] || source;
    for (const key of ['184','185','186']) {
      const template = english[key];
      if (!template) continue;
      const [before,after] = template.split('{name}');
      if (source.startsWith(before) && source.endsWith(after)) {
        const name = source.slice(before.length, after ? -after.length : undefined);
        if (['Grape','Dew','Peach'].includes(name)) return (dictionary[key] || template).replace('{name}',translate(name));
      }
    }
    return source;
  }
  function original(current, record) { return record && current === record.output ? record.source : current; }
  function walk() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,noscript,[data-no-translate]')) continue;
      const source = original(node.nodeValue,textSources.get(node));
      const trimmed = source.trim();
      if (!trimmed) continue;
      const output = source.replace(trimmed,translate(trimmed));
      textSources.set(node,{source,output});
      if (node.nodeValue !== output) node.nodeValue = output;
    }
    for (const element of document.querySelectorAll('[alt],[aria-label],meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]')) {
      if(element.closest('[data-no-translate]')) continue;
      let records = attributeSources.get(element); if(!records){records={};attributeSources.set(element,records);}
      for (const attr of ['alt','aria-label','content']) {
        if(!element.hasAttribute(attr)) continue;
        const source = original(element.getAttribute(attr),records[attr]); const output = translate(source);
        records[attr]={source,output}; if (output !== element.getAttribute(attr)) element.setAttribute(attr,output);
      }
    }
    document.documentElement.lang = active;
    label.textContent = translate('Language'); select.setAttribute('aria-label',translate('Language')); select.value = active;
    observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['alt','aria-label']});
  }
  const observer = new MutationObserver(walk);
  function setGameplayMedia(code) {
    const video = document.querySelector('#gameplay');
    const source = video?.querySelector('source');
    if (!video || !source) return;
    const media = gameplayMedia[code] || gameplayMedia.en;
    if (source.getAttribute('src') === media.video) return;
    video.pause();
    source.setAttribute('src', media.video);
    video.setAttribute('poster', media.poster);
    video.querySelector('a')?.setAttribute('href', media.video);
    document.querySelector('#gameplay-error a')?.setAttribute('href', media.video);
    video.load();
  }
  function setStoreCampaign(code) {
    const campaign = campaignOverride || storeCampaigns[code] || storeCampaigns.en;
    for (const link of document.querySelectorAll('a[href*="apps.apple.com"],a[href*="play.google.com/store/apps"]')) {
      const url = new URL(link.href);
      if (url.hostname === 'apps.apple.com') url.searchParams.set('ct', campaign);
      if (url.hostname === 'play.google.com') {
        url.searchParams.set('utm_source', 'official_site');
        url.searchParams.set('utm_medium', 'website');
        url.searchParams.set('utm_campaign', campaign);
      }
      link.href = url.href;
    }
  }
  async function change(code, remember=false) {
    if (!codes.has(code)) return;
    const token = ++sequence;
    select.disabled = true;
    try {
      const [base,translated] = await Promise.all([bundle('en'),bundle(code)]);
      if (token !== sequence) return;
      english = base; lookup = new Map(Object.entries(base).map(([key,value])=>[value,key])); dictionary = translated; active = code;
      setGameplayMedia(code);
      setStoreCampaign(code);
      walk();
      if (remember) {
        try { localStorage.setItem('fruit-site-language',code); } catch {}
        const url = new URL(location.href); url.searchParams.set('lang',code); history.replaceState(null,'',url);
      }
      // Carry language to internal pages while preserving anchors and downloads.
      for (const a of document.querySelectorAll('a[href]')) {
        if (a.getAttribute('href').startsWith('#')) continue;
        const url = new URL(a.getAttribute('href'),location.href);
        if (url.origin === location.origin && url.pathname.startsWith(root.pathname) && !a.hasAttribute('download') && (url.pathname.endsWith('/') || url.pathname.endsWith('.html'))) {
          url.searchParams.set('lang',code);
          if (campaignOverride) url.searchParams.set('campaign',campaignAlias);
          a.href = url.href;
        }
      }
    } catch {
      // Keep a readable English page if the language file cannot be downloaded.
      if (token === sequence && code !== 'en') await change('en');
    } finally { if(token === sequence) select.disabled = false; }
  }
  select.addEventListener('change',()=>change(select.value,true));
  change(requested);
})();
