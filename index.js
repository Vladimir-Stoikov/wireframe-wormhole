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
      const { canvas, updateSize, updateTube, updateElems } = createScene({ width, height });
      canvasSection.appendChild(canvas);
      sceneControls = { updateSize, updateTube, updateElems };
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
  console.log(elemsParams);
});

elemsColor.addEventListener('change', e => {
  const colors = {
    random: 'random',
    red: 0xff0000,
    blue: 0x00aaff,
    white: 0xffffff,
  };
  console.log(colors[e.target.value]);
  elemsParams.color = colors[e.target.value];
  sceneControls.updateElems(elemsParams);
  console.log(elemsParams);
});

elemsCount.addEventListener('change', e => {
  elemsParams.count = e.target.value;
  sceneControls.updateElems(elemsParams);
  console.log(elemsParams);
});
