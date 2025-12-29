import { renderPhotos } from './render-pictures.js';
import { fetchPhotos } from './api.js';
import './form.js';
import { showFilterPanel, initPhotoFilters } from './filters.js';

const showLoadingError = () => {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('data-error');
  errorContainer.style.padding = '10px';
  errorContainer.style.margin = '10px auto';
  errorContainer.style.maxWidth = '600px';
  errorContainer.style.background = '#ffdddd';
  errorContainer.style.border = '1px solid #ff8888';
  errorContainer.style.textAlign = 'center';
  errorContainer.textContent = 'Не удалось загрузить фотографии. Попробуйте обновить страницу.';
  document.body.insertAdjacentElement('afterbegin', errorContainer);
};

fetchPhotos()
  .then((photos) => {
    renderPhotos(photos);
    showFilterPanel();
    initPhotoFilters(photos);
  })
  .catch(showLoadingError);


