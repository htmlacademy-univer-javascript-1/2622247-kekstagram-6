import { isEscapeKey } from './util.js';

const COMMENTS_CHUNK = 5;
const AVATAR_MEASURE = 35;

const modalWindow = document.querySelector('.big-picture');
const modalImage = modalWindow.querySelector('.big-picture__img img');
const likeCounter = modalWindow.querySelector('.likes-count');

const commentsContainer = modalWindow.querySelector('.social__comments');
const imageDescription = modalWindow.querySelector('.social__caption');

const visibleCounter = modalWindow.querySelector('.social__comment-shown-count');
const totalCounter = modalWindow.querySelector('.social__comment-total-count');

const loadMoreButton = modalWindow.querySelector('.comments-loader');
const closeButton = modalWindow.querySelector('.big-picture__cancel');
const documentBody = document.body;

let commentsList = [];
let shownComments = 0;

let onDocumentKeydown = null;

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

  loadMoreButton.classList.toggle('hidden', shownComments >= commentsList.length);
};

const onLoadMoreButtonClick = () => {
  shownComments = Math.min(shownComments + COMMENTS_CHUNK, commentsList.length);
  updateCommentsView();
};

const hideImageModal = () => {
  modalWindow.classList.add('hidden');
  documentBody.classList.remove('modal-open');

  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }

  loadMoreButton.removeEventListener('click', onLoadMoreButtonClick);
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

  onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      hideImageModal();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);
  loadMoreButton.addEventListener('click', onLoadMoreButtonClick);
};

const onCloseButtonClick = (evt) => {
  evt.preventDefault();
  hideImageModal();
};

closeButton.addEventListener('click', onCloseButtonClick);

export { displayFullImage };


