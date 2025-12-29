// filters.js
import { renderThumbnails, clearThumbnails } from './thumbnails.js';

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = document.querySelectorAll('.img-filters__button');

let photos = [];
let activeFilter = 'filter-default';

// Функция для устранения дребезга
const debounce = (callback, delay) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

// Фильтры
const getFilteredPhotos = () => {
  switch (activeFilter) {
    case 'filter-random':
      return [...photos]
        .sort(() => Math.random() - 0.5)
        .slice(0, RANDOM_PHOTOS_COUNT);

    case 'filter-discussed':
      return [...photos].sort((a, b) => b.comments.length - a.comments.length);

    default: // 'filter-default'
      return [...photos];
  }
};

// Применение фильтра
const applyFilter = () => {
  const filteredPhotos = getFilteredPhotos();
  clearThumbnails();
  renderThumbnails(filteredPhotos);
};

// Дебаунсированное применение фильтра
const debouncedApplyFilter = debounce(applyFilter, DEBOUNCE_DELAY);

// Обработчик клика по фильтру
const onFilterClick = (evt) => {
  const clickedButton = evt.target;

  if (!clickedButton.classList.contains('img-filters__button')) {
    return;
  }

  // Не делаем ничего, если кликнули на активный фильтр
  if (clickedButton.id === activeFilter) {
    return;
  }

  // Обновляем активный фильтр
  activeFilter = clickedButton.id;

  // Обновляем активную кнопку
  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });
  clickedButton.classList.add('img-filters__button--active');

  // Применяем фильтр
  debouncedApplyFilter();
};

// Инициализация фильтров
const initFilters = (loadedPhotos) => {
  photos = loadedPhotos;

  // Показываем блок фильтров
  filtersContainer.classList.remove('img-filters--inactive');

  // Добавляем обработчики
  filtersContainer.addEventListener('click', onFilterClick);

  // Первоначальная отрисовка
  applyFilter();
};

export { initFilters };
