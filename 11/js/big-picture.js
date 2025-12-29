const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

let currentComments = [];
let commentsShown = 0;
const COMMENTS_PER_PORTION = 5;

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onCloseButtonClick() {
  closeBigPicture();
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  closeButton.removeEventListener('click', onCloseButtonClick);
}

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarElement = document.createElement('img');
  avatarElement.classList.add('social__picture');
  avatarElement.src = comment.avatar;
  avatarElement.alt = comment.name;
  avatarElement.width = 35;
  avatarElement.height = 35;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = comment.message;

  commentElement.appendChild(avatarElement);
  commentElement.appendChild(textElement);

  return commentElement;
};

const clearComments = () => {
  socialComments.innerHTML = '';
  commentsShown = 0;
};

const renderComments = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);

  const fragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);
  commentsShown += commentsToShow.length;
  commentCountElement.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderComments();
};

const fillComments = (comments) => {
  currentComments = comments;
  clearComments();
  renderComments();
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  onCommentsLoaderClick();
};

const fillBigPicture = (photo) => {
  bigPictureImage.src = photo.url;
  bigPictureImage.alt = photo.description;
  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  fillComments(photo.comments);

  commentCountElement.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');
};

const openBigPicture = (photo) => {
  fillBigPicture(photo);
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', onCloseButtonClick);
};

export { openBigPicture };
