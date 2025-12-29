const ScaleConfig = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
  DEFAULT: 100,
};

const FilterPresets = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    getFilter: () => 'none',
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    getFilter: (value) => `grayscale(${value})`,
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    getFilter: (value) => `sepia(${value})`,
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    getFilter: (value) => `invert(${value}%)`,
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    getFilter: (value) => `blur(${value}px)`,
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    getFilter: (value) => `brightness(${value})`,
  },
};

const initImageEditor = ({
  formElement,
  previewImage,
  scaleDownBtn,
  scaleUpBtn,
  scaleValueField,
  effectsPanel,
  effectLevelPanel,
  effectSlider,
  effectValueField,
}) => {
  const getCurrentScale = () => parseInt(scaleValueField.value, 10);

  const applyScaling = (value) => {
    scaleValueField.value = `${value}%`;
    previewImage.style.transform = `scale(${value / 100})`;
  };

  const onScaleDown = () => {
    const newValue = Math.max(ScaleConfig.MIN, getCurrentScale() - ScaleConfig.STEP);
    applyScaling(newValue);
  };

  const onScaleUp = () => {
    const newValue = Math.min(ScaleConfig.MAX, getCurrentScale() + ScaleConfig.STEP);
    applyScaling(newValue);
  };

  scaleDownBtn.addEventListener('click', onScaleDown);
  scaleUpBtn.addEventListener('click', onScaleUp);

  let activeFilter = FilterPresets.none;

  const hideEffectSlider = () => effectLevelPanel.classList.add('hidden');
  const showEffectSlider = () => effectLevelPanel.classList.remove('hidden');

  const applyFilterIntensity = (value) => {
    effectValueField.value = value;

    if (activeFilter === FilterPresets.none) {
      previewImage.style.filter = 'none';
      return;
    }

    previewImage.style.filter = activeFilter.getFilter(value);
  };

  noUiSlider.create(effectSlider, {
    range: {
      min: FilterPresets.chrome.min,
      max: FilterPresets.chrome.max,
    },
    start: FilterPresets.chrome.max,
    step: FilterPresets.chrome.step,
    connect: 'lower',
  });

  effectSlider.noUiSlider.on('update', (values) => {
    const value = Number(values[0]);
    applyFilterIntensity(value);
  });

  const selectFilter = (filterName) => {
    activeFilter = FilterPresets[filterName];

    if (activeFilter === FilterPresets.none) {
      previewImage.style.filter = 'none';
      effectValueField.value = '';
      hideEffectSlider();
      return;
    }

    showEffectSlider();

    effectSlider.noUiSlider.updateOptions({
      range: {
        min: activeFilter.min,
        max: activeFilter.max,
      },
      start: activeFilter.max,
      step: activeFilter.step,
    });

    previewImage.style.filter = activeFilter.getFilter(activeFilter.max);
    effectValueField.value = activeFilter.max;
  };

  effectsPanel.addEventListener('change', (event) => {
    if (!event.target.classList.contains('effects__radio')) {
      return;
    }
    selectFilter(event.target.value);
  });

  const resetFilters = () => {
    const defaultFilterRadio = formElement.querySelector('#effect-none');
    if (defaultFilterRadio) {
      defaultFilterRadio.checked = true;
    }

    activeFilter = FilterPresets.none;
    previewImage.style.filter = 'none';
    effectValueField.value = '';
    hideEffectSlider();
  };

  const resetScaling = () => {
    applyScaling(ScaleConfig.DEFAULT);
  };

  const resetAll = () => {
    resetScaling();
    resetFilters();
  };

  resetAll();

  return {
    resetAll,
    resetScaling,
    resetFilters,
    clearImageStyles: () => {
      previewImage.style.transform = '';
      previewImage.style.filter = '';
    },
  };
};

export { initImageEditor };

