const getRandomInteger = (max, min) => {
  const lower = Math.ceil(Math.min(max, min));
  const upper = Math.floor(Math.max(max, min));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, timeoutDelay);
  };
};

export {
  getRandomInteger,
  debounce,
  isEscapeKey,
};
