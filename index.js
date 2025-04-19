// import { createScene } from './scene.js';

const canvasSection = document.getElementById('canvas');
document.body.appendChild(main);

let sceneControls;

requestAnimationFrame(() => {
  const section = document.querySelector('main > section');
  console.log(section);
  const width = section.clientWidth;
  const height = section.clientHeight;
  import('./scene.js')
    .then(({ createScene }) => {
      const { canvas, updateSize } = createScene({ width, height });
      canvasSection.appendChild(canvas);
      sceneControls = { updateSize };
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
