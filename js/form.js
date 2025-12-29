import { uploadPhoto } from './api.js';
import { showSuccessAlert, showErrorAlert } from './messages.js';
import { initImageEditor } from './effects-and-scale.js';
import { initFormValidation } from './form-validation.js';
import { isEscapeKey } from './util.js';

const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const uploadForm = document.querySelector('.img-upload__form');
const fileInput = uploadForm.querySelector('.img-upload__input');
const editPanel = uploadForm.querySelector('.img-upload__overlay');
const cancelBtn = uploadForm.querySelector('.img-upload__cancel');
const hashtagField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');
const submitBtn = uploadForm.querySelector('.img-upload__submit');

const scaleDownBtn = uploadForm.querySelector('.scale__control--smaller');
const scaleUpBtn = uploadForm.querySelector('.scale__control--bigger');
const scaleValueField = uploadForm.querySelector('.scale__control--value');

const previewImage = uploadForm.querySelector('.img-upload__preview img');
const effectPreviews = uploadForm.querySelectorAll('.effects__preview');

const effectsPanel = uploadForm.querySelector('.effects');
const effectLevelPanel = uploadForm.querySelector('.img-upload__effect-level');
const effectSlider = effectLevelPanel.querySelector('.effect-level__slider');
const effectValueField = effectLevelPanel.querySelector('.effect-level__value');

const pageBody = document.body;

const imageEditor = initImageEditor({
  formElement: uploadForm,
  previewImage,
  scaleDownBtn,
  scaleUpBtn,
  scaleValueField,
  effectsPanel,
  effectLevelPanel,
  effectSlider,
  effectValueField,
});

const formValidator = initFormValidation({
  formElement: uploadForm,
  hashtagInput: hashtagField,
  commentInput: commentField,
});

let imagePreviewUrl = null;
let escapeKeyHandler = null;

const checkFileType = (file) => {
  const fileName = file.name.toLowerCase();
  return ALLOWED_FILE_TYPES.some((ext) => fileName.endsWith(ext));
};

const setImagePreview = (file) => {
  if (imagePreviewUrl) {
    URL.revokeObjectURL(imagePreviewUrl);
  }

  imagePreviewUrl = URL.createObjectURL(file);
  previewImage.src = imagePreviewUrl;

  effectPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${imagePreviewUrl})`;
  });
};

const cleanupPreview = () => {
  if (imagePreviewUrl) {
    URL.revokeObjectURL(imagePreviewUrl);
    imagePreviewUrl = null;
  }
};

const resetForm = () => {
  uploadForm.reset();
  formValidator.reset();
  imageEditor.resetAll();
  imageEditor.clearImageStyles();
  cleanupPreview();
};

const closeEditor = ({ reset = false } = {}) => {
  editPanel.classList.add('hidden');
  pageBody.classList.remove('modal-open');

  if (escapeKeyHandler) {
    document.removeEventListener('keydown', escapeKeyHandler);
    escapeKeyHandler = null;
  }

  if (reset) {
    resetForm();
    fileInput.value = '';
  }
};

const openEditor = () => {
  editPanel.classList.remove('hidden');
  pageBody.classList.add('modal-open');

  escapeKeyHandler = (evt) => {
    if (!isEscapeKey(evt)) {
      return;
    }

    if (document.querySelector('.success') || document.querySelector('.error')) {
      return;
    }

    evt.preventDefault();
    closeEditor({ reset: true });
  };

  document.addEventListener('keydown', escapeKeyHandler);
};

const handleFileSelect = () => {
  const selectedFile = fileInput.files && fileInput.files[0];
  if (!selectedFile) {
    return;
  }

  if (!checkFileType(selectedFile)) {
    fileInput.value = '';
    return;
  }

  setImagePreview(selectedFile);
  imageEditor.resetAll();
  openEditor();
};

const handleCancelClick = (evt) => {
  evt.preventDefault();
  closeEditor({ reset: true });
};

const toggleSubmitButton = (isDisabled) => {
  submitBtn.disabled = isDisabled;
  submitBtn.textContent = isDisabled ? 'Отправляю...' : 'Опубликовать';
};

const handleFormSubmit = (evt) => {
  evt.preventDefault();

  if (!formValidator.validate()) {
    return;
  }

  toggleSubmitButton(true);

  uploadPhoto(new FormData(uploadForm))
    .then(() => {
      closeEditor({ reset: true });
      showSuccessAlert();
    })
    .catch(() => {
      showErrorAlert();
    })
    .finally(() => {
      toggleSubmitButton(false);
    });
};

fileInput.addEventListener('change', handleFileSelect);
cancelBtn.addEventListener('click', handleCancelClick);
uploadForm.addEventListener('submit', handleFormSubmit);
