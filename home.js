'use strict';
const video = document.querySelector('#concert');
const play = document.querySelector('.play-cover');
const status = document.querySelector('#film-status');
const error = document.querySelector('#film-error');
play.hidden = false;
async function startConcert() {
  error.hidden = true;
  play.hidden = true;
  status.textContent = 'Loading the concert…';
  try { await video.play(); }
  catch (reason) {
    if (reason.name === 'AbortError') return;
    play.hidden = false;
    status.textContent = 'Tap play to watch the concert';
    if (video.error) error.hidden = false;
  }
}
play.addEventListener('click', startConcert);
video.addEventListener('playing', () => { play.hidden = true; error.hidden = true; status.textContent = 'Enjoy the show.'; });
video.addEventListener('pause', () => { if (!video.ended) status.textContent = 'Paused · Your front-row seat is waiting.'; });
video.addEventListener('ended', () => { play.hidden = false; status.textContent = 'Thanks for protecting the stand. Play it again?'; });
video.addEventListener('error', () => { error.hidden = false; play.hidden = false; status.textContent = 'The concert could not load.'; });
document.querySelector('#retry').addEventListener('click', () => { video.load(); startConcert(); });
