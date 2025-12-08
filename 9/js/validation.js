import Pristine from '../vendor/pristine/pristine.min.js';

const form = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

let onCancelClick = null;
let onDocumentKeydown = null;

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.toLowerCase().split(' ').filter((tag) => tag !== '');
  const rules = {
    maxCount: 5,
    maxLength: 20,
    pattern: /^#[a-zа-яё0-9]{1,19}$/
  };

  if (hashtags.length > rules.maxCount) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (!rules.pattern.test(hashtag)) {
      return false;
    }

    if (hashtags.filter((tag) => tag === hashtag).length > 1) {
      return false;
    }
  }

  return true;
};

const validateComment = (value) => value.length <= 140;

const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  document.removeEventListener('keydown', onDocumentKeydown);
  uploadCancel.removeEventListener('click', onCancelClick);
};

const initHandlers = () => {
  onCancelClick = () => {
    closeForm();
  };

  onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
        return;
      }
      evt.preventDefault();
      closeForm();
    }
  };
};

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  uploadCancel.addEventListener('click', onCancelClick);
};

uploadInput.addEventListener('change', () => {
  openForm();
});

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  'Хештег должен начинаться с #, содержать только буквы и цифры, быть не длиннее 20 символов. Максимум 5 хештегов без повторений'
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Комментарий не должен превышать 140 символов'
);

[hashtagInput, commentInput].forEach((input) => {
  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
    }
  });
});

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
});

initHandlers();

export { openForm, closeForm };
