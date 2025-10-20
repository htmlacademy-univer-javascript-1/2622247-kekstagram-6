const PHOTO_COUNT = 25;

const DESCRIPTIONS = [
  'Хочу на море!',
  'Хороший день у меня сегодня',
  'Котики хорошие лишнего не скажут',
  'Пора домой...',
  'Самый вкусный день',
  'Без мам пап и кредитов',
  'Базовый минимум!'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Чарующий Эльф',
  'Кричащий Динозавр',
  'Чилловый Парень',
  'Альтушка Подружка',
  'Мурчащий котик'
];

const Likes = {
  MIN: 15,
  MAX: 200
};

const CommentsCount = {
  MIN: 0,
  MAX: 30
};

const AvatarNumber = {
  MIN: 1,
  MAX: 6
};

const getRandomInteger = (min, max) => Math.floor(Math.random()*(max-min+1)) + min;

const getRandomElement = (array) =>  array[Math.floor(Math.random() * array.length)];

const generateCommentId = () => {
  let lastId = 0;
  return () => {
    lastId += 1;
    return lastId;
  };
};

const getCommentId = generateCommentId();

const addComment = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomInteger(AvatarNumber.MIN, AvatarNumber.MAX)}.svg`,
  message: getRandomElement(MESSAGES),
  name: getRandomElement(NAMES)
});

const generateComments = () => {
  const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);
  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments[i] = addComment(i);
  }

  return comments;
};

const photos = [];

const addPhoto = (index) => ({
  id: index,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
  likes: getRandomInteger(Likes.MIN, Likes.MAX),
  comments: generateComments()
});

for (let i = 0; i < PHOTO_COUNT; i++) {
  photos[i] = addPhoto(i);
}

export { photos };
