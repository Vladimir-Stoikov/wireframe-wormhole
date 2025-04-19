import * as THREE from 'three';
import spline from './utility/spline.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';

export function createScene({ width, height } = {}) {
  // renderer
  console.log(width, height);
  const w = width || window.innerWidth;
  const h = height || window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);

  // camera
  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;

  // scene
  const scene = new THREE.Scene();

  // orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.005;
  const detail = 24;

  // glow effect
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
  bloomPass.threshold = 0.002;
  bloomPass.strength = 3.5;
  bloomPass.radius = 0;
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // fog effect
  scene.fog = new THREE.FogExp2(0x000000, 0.4);

  // edges for tube
  const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
  const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
  const lineMat = new THREE.LineBasicMaterial({ color: getRandomColor() });
  const tubeLines = new THREE.LineSegments(edges, lineMat);
  scene.add(tubeLines);

  // add boxes
  const numBoxes = 150;
  const size = 0.075;
  const boxGeo = new THREE.BoxGeometry(size, size, size);

  for (let i = 0; i < numBoxes; i++) {
    const p = (i / numBoxes + Math.random() * 0.1) % 1;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.y += Math.random() - 0.4;
    const rote = new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
    const lineMat = new THREE.LineBasicMaterial({ color: getRandomColor() });
    const boxLines = new THREE.LineSegments(edges, lineMat);
    boxLines.position.copy(pos);
    boxLines.rotation.set(rote.x, rote.y, rote.z);
    scene.add(boxLines);
  }

  // random color

  function getRandomColor() {
    const variants = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'f'];
    const color = [0, 'x'];
    for (let i = 0; i < 6; i++) {
      const key = Math.floor(Math.random() * 15);
      color.push(variants[key]);
    }
    return parseInt(color.join(''), 16);
  }

  function updateCamera(t) {
    const time = t * 0.1;
    const looptime = 8 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.01) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
  }

  function animate(t = 0) {
    requestAnimationFrame(animate);
    updateCamera(t);
    composer.render(scene, camera);
    controls.update();
  }

  animate();

  return {
    canvas: renderer.domElement,
    updateSize: (newWidth, newHeight) => {
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    },
  };
}
