import { isEscapeKey } from './util.js';

const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const setupValidator = (form) =>
  new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error',
  });

const parseHashtags = (value) =>
  value
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

const validateHashtagFormat = (value) => {
  if (!value.trim()) {
    return true;
  }
  const hashtags = parseHashtags(value);
  return hashtags.every((tag) => HASHTAG_REGEX.test(tag));
};

const validateHashtagCount = (value) => {
  if (!value.trim()) {
    return true;
  }
  return parseHashtags(value).length <= MAX_HASHTAGS;
};

const validateHashtagUniqueness = (value) => {
  if (!value.trim()) {
    return true;
  }
  const hashtags = parseHashtags(value).map((t) => t.toLowerCase());
  return new Set(hashtags).size === hashtags.length;
};

const validateCommentLength = (value) => value.length <= MAX_COMMENT_LENGTH;

const blockEscapePropagation = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const initFormValidation = ({ formElement, hashtagInput, commentInput }) => {
  const validator = setupValidator(formElement);

  validator.addValidator(hashtagInput, validateHashtagFormat, 'Неверный хэш-тег');
  validator.addValidator(hashtagInput, validateHashtagCount, 'Максимум 5 хэш-тегов');
  validator.addValidator(hashtagInput, validateHashtagUniqueness, 'Хэш-теги повторяются');

  validator.addValidator(commentInput, validateCommentLength, 'Максимальная длина комментария 140 символов');

  hashtagInput.addEventListener('keydown', blockEscapePropagation);
  commentInput.addEventListener('keydown', blockEscapePropagation);

  return validator;
};

export { initFormValidation };
