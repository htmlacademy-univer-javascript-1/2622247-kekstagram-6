import './util.js';
import './data.js';

import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';
import './validation.js';

const renderedPhotos = generatePhotos();
renderThumbnails(renderedPhotos);
