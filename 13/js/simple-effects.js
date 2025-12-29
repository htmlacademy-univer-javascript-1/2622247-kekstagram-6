// simple-effects.js - должно быть в папке js/
const EFFECTS = {
  none: { min: 0, max: 100, step: 1, unit: '', cssFilter: null },
  chrome: { min: 0, max: 1, step: 0.1, unit: '', cssFilter: 'grayscale' },
  sepia: { min: 0, max: 1, step: 0.1, unit: '', cssFilter: 'sepia' },
  marvin: { min: 0, max: 100, step: 1, unit: '%', cssFilter: 'invert' },
  phobos: { min: 0, max: 3, step: 0.1, unit: 'px', cssFilter: 'blur' },
  heat: { min: 1, max: 3, step: 0.1, unit: '', cssFilter: 'brightness' }
};

let currentEffect = 'none';
let effectSlider = null;

// Функция инициализации эффектов
function initEffects() {


  const effectLevelContainer = document.querySelector('.img-upload__effect-level');
  const effectLevelSlider = document.querySelector('.effect-level__slider');
  const effectLevelValue = document.querySelector('.effect-level__value');
  const imagePreview = document.querySelector('.img-upload__preview img');
  const effectsList = document.querySelector('.effects__list');


  // Скрываем слайдер по умолчанию
  effectLevelContainer.classList.add('hidden');

  // Инициализируем слайдер
  noUiSlider.create(effectLevelSlider, {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    connect: 'lower'
  });

  effectSlider = effectLevelSlider.noUiSlider;

  // Обновление значения при движении слайдера
  effectSlider.on('update', (values) => {
    const value = parseFloat(values[0]);
    effectLevelValue.value = value;
    applyEffect(value);
  });

  // Обработчик изменения эффекта
  effectsList.addEventListener('change', (e) => {
    if (e.target.name === 'effect') {
      currentEffect = e.target.value;

      if (currentEffect === 'none') {
        effectLevelContainer.classList.add('hidden');
        imagePreview.style.filter = '';
      } else {
        effectLevelContainer.classList.remove('hidden');
        const effect = EFFECTS[currentEffect];
        effectSlider.updateOptions({
          range: { min: effect.min, max: effect.max },
          step: effect.step,
          start: effect.max
        });
        applyEffect(effect.max);
      }
    }
  });

  function applyEffect(value) {
    if (currentEffect === 'none') {
      imagePreview.style.filter = '';
      return;
    }

    const effect = EFFECTS[currentEffect];
    if (effect.cssFilter) {
      imagePreview.style.filter = `${effect.cssFilter}(${value}${effect.unit})`;
    }
  }

  function resetEffects() {
    const noneRadio = document.querySelector('#effect-none');
    if (noneRadio) {
      noneRadio.checked = true;
    }

    currentEffect = 'none';
    effectLevelContainer.classList.add('hidden');
    imagePreview.style.filter = '';
    effectLevelValue.value = '';

    if (effectSlider) {
      effectSlider.updateOptions({
        range: { min: 0, max: 100 },
        start: 100,
        step: 1
      });
    }
  }

  // Сбрасываем к начальному состоянию
  resetEffects();

  return resetEffects;
}

// Экспортируем функцию
export { initEffects };
