const getRandomInteger = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;

const getRandomElement = (array) =>  array[Math.floor(Math.random() * array.length)];

const generateCommentId = () => {
  let lastId = 0;
  return () => {
    lastId += 1;
    return lastId;
  };
};

export { getRandomInteger, getRandomElement, generateCommentId };
