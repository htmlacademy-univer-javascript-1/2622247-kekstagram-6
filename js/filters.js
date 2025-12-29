import { debounce, getRandomInteger } from './util.js';
import { renderPhotos } from './render-pictures.js';

const RANDOM_PHOTOS_COUNT = 10;
const FILTER_DELAY = 500;

const filtersSection = document.querySelector('.img-filters');
const filterForm = filtersSection.querySelector('.img-filters__form');

const showFilterPanel = () => {
  filtersSection.classList.remove('img-filters--inactive');
};

const markActiveFilter = (activeButton) => {
  filterForm.querySelectorAll('.img-filters__button').forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  activeButton.classList.add('img-filters__button--active');
};

const getRandomSelection = (photos, count) => {
  const selected = [];
  const usedIds = new Set();

  while (selected.length < Math.min(count, photos.length)) {
    const index = getRandomInteger(0, photos.length - 1);
    const photo = photos[index];

    if (!usedIds.has(photo.id)) {
      usedIds.add(photo.id);
      selected.push(photo);
    }
  }

  return selected;
};

const sortByComments = (photos) =>
  photos.slice().sort((max, min) => max.comments.length - min.comments.length);

const initPhotoFilters = (originalPhotos) => {
  const defaultPhotos = originalPhotos.slice();

  const applyFilter = debounce((filteredPhotos) => {
    renderPhotos(filteredPhotos);
  }, FILTER_DELAY);

  const handleFilterClick = (evt) => {
    const clickedButton = evt.target.closest('.img-filters__button');
    if (!clickedButton) {
      return;
    }

    evt.preventDefault();

    markActiveFilter(clickedButton);

    switch (clickedButton.id) {
      case 'filter-default':
        applyFilter(defaultPhotos);
        break;
      case 'filter-random':
        applyFilter(getRandomSelection(defaultPhotos, RANDOM_PHOTOS_COUNT));
        break;
      case 'filter-discussed':
        applyFilter(sortByComments(defaultPhotos));
        break;
      default:
        applyFilter(defaultPhotos);
    }
  };

  filterForm.addEventListener('click', handleFilterClick);
};

export { showFilterPanel, initPhotoFilters };
