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
  color: null,
  scale: 3,
};

tubeDropList.addEventListener('change', e => {
  tubeParams.type = e.target.value;
  sceneControls.updateTube(tubeParams);
  console.log(tubeParams);
});

tubeColor.addEventListener('change', e => {
  const colors = {
    random: getRandomColor(),
    red: 0xff0000,
    green: 0x00ff00,
    white: 0x0000ff,
  };
  console.log(colors[e.target.value]);
  tubeParams.color = colors[e.target.value];
  sceneControls.updateTube(tubeParams);
  console.log(tubeParams);
});

tubeScale.addEventListener('change', e => {
  tubeParams.scale = e.target.value;
  sceneControls.updateTube(tubeParams);
  console.log(tubeParams);
});
