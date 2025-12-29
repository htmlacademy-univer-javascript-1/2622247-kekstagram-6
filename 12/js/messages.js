import { isEscapeKey } from './utils.js';

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const showMessage = (template, buttonClass) => {
  const messageElement = template.cloneNode(true);
  const button = messageElement.querySelector(buttonClass);

  document.body.append(messageElement);

  const onMessageEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopPropagation();
      button.click();
    }
  };

  const onOutsideClick = (evt) => {
    if (evt.target === messageElement) {
      button.click();
    }
  };

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onOutsideClick);
};

const showSuccessMessage = () => {
  showMessage(successTemplate, '.success__button');
};

const showErrorMessage = () => {
  showMessage(errorTemplate, '.error__button');
};

export { showSuccessMessage, showErrorMessage };
