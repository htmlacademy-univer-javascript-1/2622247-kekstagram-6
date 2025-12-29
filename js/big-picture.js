import { isEscapeKey } from './util.js';

const modalWindow = document.querySelector('.big-picture');
const modalImage = modalWindow.querySelector('.big-picture__img img');
const likeCounter = modalWindow.querySelector('.likes-count');

const commentsContainer = modalWindow.querySelector('.social__comments');
const imageDescription = modalWindow.querySelector('.social__caption');

const visibleCounter = modalWindow.querySelector('.social__comment-shown-count');
const totalCounter = modalWindow.querySelector('.social__comment-total-count');

const loadMoreBtn = modalWindow.querySelector('.comments-loader');
const closeBtn = modalWindow.querySelector('.big-picture__cancel');
const documentBody = document.body;

const COMMENTS_CHUNK = 5;
const AVATAR_MEASURE = 35;

let commentsList = [];
let shownComments = 0;

let escapePressHandler = null;

const buildCommentItem = (commentInfo) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('social__picture');
  avatarImg.src = commentInfo.avatar;
  avatarImg.alt = commentInfo.name;
  avatarImg.width = AVATAR_MEASURE;
  avatarImg.height = AVATAR_MEASURE;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = commentInfo.message;

  commentElement.append(avatarImg, commentText);
  return commentElement;
};

const updateCommentsView = () => {
  commentsContainer.innerHTML = '';

  const commentsFragment = document.createDocumentFragment();
  commentsList.slice(0, shownComments).forEach((comment) => {
    commentsFragment.appendChild(buildCommentItem(comment));
  });

  commentsContainer.appendChild(commentsFragment);

  visibleCounter.textContent = String(shownComments);
  totalCounter.textContent = String(commentsList.length);

  loadMoreBtn.classList.toggle('hidden', shownComments >= commentsList.length);
};

const handleLoadMoreClick = () => {
  shownComments = Math.min(shownComments + COMMENTS_CHUNK, commentsList.length);
  updateCommentsView();
};

const hideImageModal = () => {
  modalWindow.classList.add('hidden');
  documentBody.classList.remove('modal-open');

  if (escapePressHandler) {
    document.removeEventListener('keydown', escapePressHandler);
    escapePressHandler = null;
  }

  loadMoreBtn.removeEventListener('click', handleLoadMoreClick);
};

const displayFullImage = (photoData) => {
  modalWindow.classList.remove('hidden');
  documentBody.classList.add('modal-open');

  modalImage.src = photoData.url;
  modalImage.alt = photoData.description;
  likeCounter.textContent = String(photoData.likes);

  imageDescription.textContent = photoData.description;

  commentsList = photoData.comments;
  shownComments = Math.min(COMMENTS_CHUNK, commentsList.length);

  updateCommentsView();

  escapePressHandler = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      hideImageModal();
    }
  };

  document.addEventListener('keydown', escapePressHandler);
  loadMoreBtn.addEventListener('click', handleLoadMoreClick);
};

const closeModal = (event) => {
  event.preventDefault();
  hideImageModal();
};

closeBtn.addEventListener('click', closeModal);

export { displayFullImage };
