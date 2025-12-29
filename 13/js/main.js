
import { getData } from './api.js';
import { initFilters } from './filters.js';
import { initEffects } from './form-effects.js';
import { initForm } from './validation.js';
import { showErrorMessage } from './messages.js';

// Инициализация при загрузке страницы
const initApp = () => {
  // Инициализация эффектов редактирования изображения
  initEffects();

  // Инициализация формы загрузки
  initForm();

  // Загрузка данных с сервера
  getData()
    .then((data) => {
      // Инициализация фильтров с полученными данными
      initFilters(data);
    })
    .catch((error) => {
      showErrorMessage(`Ошибка загрузки фотографий: ${error.message}`);
    });
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
