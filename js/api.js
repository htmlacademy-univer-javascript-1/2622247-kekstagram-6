const apiEndpoint = 'https://29.javascript.htmlacademy.pro/kekstagram';

const validateResponse = (serverResponse) => {
  if (!serverResponse.ok) {
    throw new Error(`HTTP ${serverResponse.status}`);
  }
  return serverResponse;
};

const fetchPhotos = () =>
  fetch(`${apiEndpoint}/data`)
    .then(validateResponse)
    .then((serverResponse) => serverResponse.json());

const uploadPhoto = (formData) =>
  fetch(apiEndpoint, {
    method: 'POST',
    body: formData,
  })
    .then(validateResponse)
    .then((serverResponse) => serverResponse.json());

export { fetchPhotos, uploadPhoto };
