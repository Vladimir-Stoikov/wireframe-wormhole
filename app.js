// import { createScene } from './scene.js';

const main = document.createElement('main');
document.body.appendChild(main);

import('./scene.js').then(({ createScene }) => {
  const canvas = createScene();

  main.appendChild(canvas);
});
