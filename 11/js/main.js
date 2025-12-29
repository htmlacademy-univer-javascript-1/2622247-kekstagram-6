// main.js
import './util.js';
import './data.js';
import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';
import { initEffects } from './simple-effects.js';
import { initScale } from './simple-scale.js';
import './image-upload.js';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {

  const photos = generatePhotos();
  renderThumbnails(photos);

  initEffects();

  initScale();

});
