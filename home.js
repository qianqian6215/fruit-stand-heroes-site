'use strict';
document.body.classList.add('js');
const content = window.FRUIT_CONTENT;
const dialog = document.querySelector('#story-dialog');
const storyVideo = document.querySelector('#story-video');
const storyStatus = document.querySelector('#story-status');
const storyError = document.querySelector('#story-error');
const concert = document.querySelector('#concert');
let storyTrigger;
let playRequest = 0;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function icon(name) {
  const node = element('img', 'icon');
  node.src = `assets/icons/${name}.svg`; node.alt = ''; return node;
}
// Keep off-screen covers out of the initial network queue.
function revealMedia(node) {
  if (node.dataset.src) { node.src = node.dataset.src; delete node.dataset.src; }
  if (node.dataset.poster) { node.poster = node.dataset.poster; delete node.dataset.poster; }
}
const mediaObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    revealMedia(entry.target); mediaObserver.unobserve(entry.target);
  }
}, { rootMargin: '200px' }) : null;
function deferMedia(node) { if (mediaObserver) mediaObserver.observe(node); else revealMedia(node); }
document.querySelectorAll('video[data-poster]').forEach(deferMedia);
function poster(src, name, position) {
  const node = element('img');
  node.dataset.src = src; node.alt = name; node.loading = 'lazy'; node.decoding = 'async'; deferMedia(node);
  node.width = 720; node.height = 1280; node.style.objectPosition = position; return node;
}
async function playStory() {
  const request = ++playRequest;
  storyError.hidden = true; storyStatus.textContent = 'Loading your story…';
  try { await storyVideo.play(); }
  catch (error) {
    if (request !== playRequest || !dialog.open || error.name === 'AbortError') return;
    storyStatus.textContent = 'Press play to start your story.';
    if (storyVideo.error) storyError.hidden = false;
  }
}
function openStory(id, trigger) {
  const story = content.stories.find(item => item.id === id);
  if (!story) return;
  concert.pause(); storyTrigger = trigger;
  document.querySelector('#story-dialog-title').textContent = story.name;
  storyVideo.src = story.video; storyVideo.poster = story.poster;
  storyVideo.setAttribute('aria-label', `${story.name} animated story`);
  document.body.classList.add('dialog-open'); dialog.showModal(); playStory();
}
for (const story of content.stories) {
  const card = element('article', 'story-card'); card.id = `story-${story.id}`;
  const button = element('button', 'story-poster'); button.type = 'button';
  button.setAttribute('aria-label', `Watch ${story.name}'s story`);
  button.append(poster(story.poster, `${story.name} in the fruit market`, story.position));
  const play = element('span', 'story-play'); play.append(icon('play-white'));
  button.append(play, element('span', 'duration', story.duration));
  button.addEventListener('click', () => openStory(story.id, button));
  card.append(button, element('h3', '', story.name), element('p', 'tagline', story.tagline), element('p', 'type', 'ANIMATED SHORT'));
  document.querySelector('#story-grid').append(card);
}
function selectCharacter(character) {
  const detail = document.querySelector('#character-detail'); detail.replaceChildren();
  detail.style.backgroundColor = character.color;
  detail.append(poster(character.image, character.name, character.position));
  const copy = element('div', 'character-copy');
  copy.append(element('p', 'eyebrow', character.role), element('h3', '', character.name), element('p', 'character-intro', character.intro), element('p', '', character.description));
  if (content.stories.some(story => story.id === character.storyId)) {
    const watch = element('button', 'text-link', 'Watch my story'); watch.type = 'button'; watch.append(icon('play'));
    watch.addEventListener('click', () => openStory(character.storyId, watch)); copy.append(watch);
  }
  detail.append(copy);
  document.querySelectorAll('.character-tab').forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.character === character.id)));
}
for (const character of content.characters) {
  const button = element('button', 'character-tab', character.name); button.type = 'button'; button.dataset.character = character.id;
  button.setAttribute('aria-controls', 'character-detail'); button.addEventListener('click', () => selectCharacter(character));
  document.querySelector('#character-tabs').append(button);
}
if (content.characters.length) selectCharacter(content.characters[0]);
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  ++playRequest; storyVideo.pause(); storyVideo.removeAttribute('src'); storyVideo.load();
  document.body.classList.remove('dialog-open'); storyTrigger?.focus({ preventScroll: true });
});
storyVideo.addEventListener('playing', () => { storyError.hidden = true; storyStatus.textContent = 'Enjoy the story.'; });
storyVideo.addEventListener('pause', () => { if (dialog.open && !storyVideo.ended) storyStatus.textContent = 'Paused. Your story will be right here.'; });
storyVideo.addEventListener('ended', () => { storyStatus.textContent = 'A little fruit. A big heart. Watch it again?'; });
storyVideo.addEventListener('error', () => { if (dialog.open) { storyError.hidden = false; storyStatus.textContent = 'The story could not load.'; } });
document.querySelector('#story-retry').addEventListener('click', () => { storyVideo.load(); playStory(); });
// The released game opens /#watch. Preserve this anchor and original media path.
const play = document.querySelector('.play-cover');
const status = document.querySelector('#film-status');
const error = document.querySelector('#film-error');
play.hidden = false;
async function startConcert() {
  revealMedia(concert); storyVideo.pause(); error.hidden = true; play.hidden = true; status.textContent = 'Loading the concert…';
  try { await concert.play(); }
  catch (reason) {
    if (reason.name === 'AbortError') return;
    play.hidden = false; status.textContent = 'Tap play to watch the concert';
    if (concert.error) error.hidden = false;
  }
}
play.addEventListener('click', startConcert);
concert.addEventListener('playing', () => { play.hidden = true; error.hidden = true; status.textContent = 'Enjoy the show.'; });
concert.addEventListener('pause', () => { if (!concert.ended) status.textContent = 'Paused · Your front-row seat is waiting.'; });
concert.addEventListener('ended', () => { play.hidden = false; status.textContent = 'Thanks for protecting the stand. Play it again?'; });
concert.addEventListener('error', () => { error.hidden = false; play.hidden = false; status.textContent = 'The concert could not load.'; });
document.querySelector('#retry').addEventListener('click', () => { concert.load(); startConcert(); });
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav'); menu.hidden = false;
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });

// Only one film should make progress at a time, regardless of its entry point.
const siteVideos = [...document.querySelectorAll('video')];
for (const current of siteVideos) current.addEventListener('playing', () => {
  for (const other of siteVideos) if (other !== current) other.pause();
});
const gameplay = document.querySelector('#gameplay');
const gameplayError = document.querySelector('#gameplay-error');
gameplay.addEventListener('error', () => { gameplayError.hidden = false; });
gameplay.addEventListener('playing', () => { gameplayError.hidden = true; });

storyVideo.addEventListener('waiting', () => { if (dialog.open && !storyVideo.paused) storyStatus.textContent = 'Buffering… Your story will resume shortly.'; });
concert.addEventListener('waiting', () => { if (!concert.paused) status.textContent = 'Buffering… The concert will resume shortly.'; });

// Explicit play target: poster taps and the hero action both start the clip.
const gameplayPlay = document.querySelector('#gameplay-play');
gameplayPlay.hidden = false;
async function startGameplay() {
  revealMedia(gameplay); gameplayError.hidden = true;
  for (const other of siteVideos) if (other !== gameplay) other.pause();
  if (gameplay.error) gameplay.load();
  if (gameplay.ended) gameplay.currentTime = 0;
  try { await gameplay.play(); }
  catch (reason) {
    if (reason.name !== 'AbortError') { gameplayError.hidden = false; gameplayPlay.hidden = false; }
  }
}
gameplayPlay.addEventListener('click', startGameplay);
document.querySelector('.hero-actions a[href="#game"]').addEventListener('click', startGameplay);
gameplay.addEventListener('playing', () => { gameplayPlay.hidden = true; });
gameplay.addEventListener('pause', () => { gameplayPlay.hidden = false; });
gameplay.addEventListener('ended', () => { gameplayPlay.hidden = false; });
gameplay.addEventListener('error', () => { gameplayPlay.hidden = false; });

document.querySelector('#gameplay-retry').addEventListener('click', startGameplay);
