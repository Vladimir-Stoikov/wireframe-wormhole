// import { createScene } from './scene.js';

import getRandomColor from './utility/getRandomColor.js';

const canvasSection = document.getElementById('canvas');
document.body.appendChild(main);

let sceneControls;

requestAnimationFrame(() => {
  const section = document.querySelector('main > section');
  const width = section.clientWidth;
  const height = section.clientHeight;
  import('./scene.js')
    .then(({ createScene }) => {
      const { canvas, updateSize, updateTube } = createScene({ width, height });
      canvasSection.appendChild(canvas);
      sceneControls = { updateSize, updateTube };
    })
    .catch(console.error);
});

const resizeObserver = new ResizeObserver(entries => {
  const { width, height } = entries[0].contentRect;
  if (sceneControls) {
    sceneControls.updateSize(width, height);
  }
});

resizeObserver.observe(canvasSection);

// NAVBAR SETTINGS

// TUBE SETTINGS

const tubeDropList = document.getElementById('tube-drop-list');
const tubeColor = document.getElementById('tube-color');
const tubeScale = document.getElementById('tube-scale');
let tubeParams = {
  type: null,
  color: getRandomColor(),
  scale: 3,
};

tubeDropList.addEventListener('change', e => {
  tubeParams.type = e.target.value;
  sceneControls.updateTube(null, null, e.target.value);
  console.log(tubeParams);
});

tubeColor.addEventListener('change', e => {
  tubeParams.color = e.target.value;
  sceneControls.updateTube(null, null, e.target.value);
  console.log(tubeParams);
});

tubeScale.addEventListener('change', e => {
  tubeParams.scale = e.target.value;
  sceneControls.updateTube(null, null, e.target.value);
  console.log(tubeParams);
});
