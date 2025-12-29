// validation.js
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { resetEffects } from './form-effects.js';

const form = document.querySelector('.img-upload__form');

const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const imagePreview = document.querySelector('.img-upload__preview img');

let onCancelClick = null;
let onDocumentKeydown = null;

// Валидация хэштегов
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

// Валидация комментария
const validateComment = (value) => value.length <= 140;

// Закрытие формы с полным сбросом
const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  // Полный сброс формы
  form.reset();

  // Сброс эффектов и масштаба
  resetEffects();

  // Сброс превью изображения на дефолтное
  if (imagePreview) {
    imagePreview.src = 'img/upload-default-image.jpg';
    imagePreview.style.transform = 'scale(1)';
    imagePreview.style.filter = '';
  }

  // Удаление обработчиков
  document.removeEventListener('keydown', onDocumentKeydown);
  uploadCancel.removeEventListener('click', onCancelClick);

  // Сброс состояния валидации
  if (window.pristine) {
    window.pristine.reset();
  }
};

// Инициализация обработчиков
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

// Инициализация Pristine
const initValidation = () => {
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
    (value) => {
      if (value.trim() === '') {
        return true;
      }

      const hashtags = value.toLowerCase().split(' ').filter((tag) => tag !== '');

      if (hashtags.length > 5) {
        return 'Не более 5 хэштегов';
      }

      for (const hashtag of hashtags) {
        if (!/^#[a-zа-яё0-9]{1,19}$/.test(hashtag)) {
          return 'Хэштег должен начинаться с # и содержать только буквы и цифры';
        }

        if (hashtags.filter((tag) => tag === hashtag).length > 1) {
          return 'Хэштеги не должны повторяться';
        }
      }

      return true;
    }
  );

  pristine.addValidator(
    commentInput,
    validateComment,
    'Комментарий не должен превышать 140 символов'
  );

  // Сохраняем pristine в глобальной области для доступа из других функций
  window.pristine = pristine;
};

// Блокировка/разблокировка кнопки отправки
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

// Обработка отправки формы
const handleFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = window.pristine.validate();

  if (!isValid) {
    return;
  }

  blockSubmitButton();

  try {
    const formData = new FormData(evt.target);

    await sendData(formData);

    showSuccessMessage();
    closeForm();
  } catch (err) {
    showErrorMessage(err.message);
  } finally {
    unblockSubmitButton();
  }
};

// Инициализация всего модуля
const initForm = () => {
  initHandlers();
  initValidation();

  // Обработка отправки формы
  form.addEventListener('submit', handleFormSubmit);

  // Обработка ESC в полях ввода
  [hashtagInput, commentInput].forEach((input) => {
    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });
  });
};

export { openForm, closeForm, initForm };
