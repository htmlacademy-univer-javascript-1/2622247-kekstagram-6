import { isEscapeKey } from './util.js';

const successTemplate = document
  .querySelector('#success')
  .content
  .querySelector('.success');

const errorTemplate = document
  .querySelector('#error')
  .content
  .querySelector('.error');

let currentMessage = null;
let keydownHandler = null;
let clickHandler = null;

const removeMessage = () => {
  if (!currentMessage) {
    return;
  }

  currentMessage.remove();

  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler, true);
  }
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, true);
  }

  currentMessage = null;
  keydownHandler = null;
  clickHandler = null;
};

const showStatusMessage = (template) => {
  removeMessage();

  const messageElement = template.cloneNode(true);
  messageElement.style.zIndex = '10000';
  document.body.append(messageElement);
  currentMessage = messageElement;

  keydownHandler = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      event.stopPropagation();
      removeMessage();
    }
  };

  clickHandler = (event) => {
    const messageContent = currentMessage
      ? currentMessage.querySelector('.success__inner, .error__inner')
      : null;

    const closeButton = currentMessage
      ? currentMessage.querySelector('button')
      : null;

    const isCloseBtn = event.target === closeButton;
    const isOutside = messageContent ? !messageContent.contains(event.target) : true;

    if (isCloseBtn || isOutside) {
      event.preventDefault();
      event.stopPropagation();
      removeMessage();
    }
  };

  document.addEventListener('keydown', keydownHandler, true);
  document.addEventListener('click', clickHandler, true);
};

const showSuccessAlert = () => showStatusMessage(successTemplate);
const showErrorAlert = () => showStatusMessage(errorTemplate);

export { showSuccessAlert, showErrorAlert };


