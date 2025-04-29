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
      const { canvas, updateSize, updateTube, updateElems, updateCamera } = createScene({ width, height });
      canvasSection.appendChild(canvas);
      sceneControls = { updateSize, updateTube, updateElems, updateCamera };
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

// NAVBAR SETTINGS -----------------

// TUBE SETTINGS

const tubeType = document.getElementById('tube-type');
const tubeColor = document.getElementById('tube-color');
const tubeScale = document.getElementById('tube-scale');
let tubeParams = {
  type: null,
  color: null,
  scale: 3,
};

tubeType.addEventListener('change', e => {
  tubeParams.type = e.target.value;
  sceneControls.updateTube(tubeParams);
});

tubeColor.addEventListener('change', e => {
  const colors = {
    random: getRandomColor(),
    red: 0xff0000,
    green: 0x00ff00,
    white: 0xaaaaaaa,
  };
  tubeParams.color = colors[e.target.value];
  sceneControls.updateTube(tubeParams);
});

tubeScale.addEventListener('change', e => {
  tubeParams.scale = e.target.value;
  sceneControls.updateTube(tubeParams);
});

// BOX SETTINGS

const elemsDropList = document.getElementById('elems-drop-list');
const elemsColor = document.getElementById('elems-color');
const elemsCount = document.getElementById('elems-count');

let elemsParams = {
  type: null,
  color: null,
  count: 150,
};

elemsDropList.addEventListener('change', e => {
  elemsParams.type = e.target.value;
  sceneControls.updateElems(elemsParams);
});

elemsColor.addEventListener('change', e => {
  const colors = {
    random: 'random',
    red: 0xff0000,
    blue: 0x00aaff,
    white: 0xffffff,
  };
  elemsParams.color = colors[e.target.value];
  sceneControls.updateElems(elemsParams);
});

elemsCount.addEventListener('change', e => {
  elemsParams.count = e.target.value;
  sceneControls.updateElems(elemsParams);
});

// CAMERA SETTINGS

const speedUpBtn = document.getElementById('camera-speed-up');
const speedDownBtn = document.getElementById('camera-speed-down');
const cameraParams = {
  currentSpeed: 1000,
};

speedUpBtn.addEventListener('click', () => {
  if (cameraParams.currentSpeed > 100) {
    cameraParams.currentSpeed -= 100;
    sceneControls.updateCamera(cameraParams.currentSpeed);
  } else {
    console.log('max speed');
  }
});

speedDownBtn.addEventListener('click', () => {
  if (cameraParams.currentSpeed < 2000) {
    cameraParams.currentSpeed += 100;
    sceneControls.updateCamera(cameraParams.currentSpeed);
  } else {
    console.log('lowest speed');
  }
});
