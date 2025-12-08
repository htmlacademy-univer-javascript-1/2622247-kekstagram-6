import './util.js';
import './data.js';

import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';
import { initForm } from './validation.js';
initForm();
const renderedPhotos = generatePhotos();
renderThumbnails(renderedPhotos);

