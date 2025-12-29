import { displayFullImage } from './big-picture.js';

const picturesGrid = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const clearGallery = () => {
  const pictureElements = picturesGrid.querySelectorAll('.picture');
  pictureElements.forEach((picture) => picture.remove());
};

const createPictureThumbnail = (pictureData) => {
  const { url, description, likes, comments } = pictureData;
  const thumbnail = pictureTemplate.cloneNode(true);

  const image = thumbnail.querySelector('.picture__img');
  image.src = url;
  image.alt = description;

  thumbnail.querySelector('.picture__likes').textContent = likes;
  thumbnail.querySelector('.picture__comments').textContent = comments.length;

  const handleThumbnailClick = (evt) => {
    evt.preventDefault();
    displayFullImage(pictureData);
  };

  thumbnail.addEventListener('click', handleThumbnailClick);

  return thumbnail;
};

const renderPhotos = (photos) => {
  clearGallery();

  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    fragment.appendChild(createPictureThumbnail(photo));
  });

  picturesGrid.appendChild(fragment);
};

export { renderPhotos };

