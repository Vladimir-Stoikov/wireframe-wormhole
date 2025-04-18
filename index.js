import * as THREE from 'three';
import spline from './spline.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x000000, 0.4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.005;
const detail = 24;

// line by spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({
  color: 0x00ff00,
});
const line = new THREE.Line(geometry, material);
// scene.add(line);

// tube by spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  // side: THREE.DoubleSide,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeo, tubeMat);
// scene.add(tube);

// create edges
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

// add boxes
const numBoxes = 150;
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
for (let i = 0; i < numBoxes; i++) {
  // const boxMat = new THREE.MeshBasicMaterial({
  //   color: getRandomColor(),
  //   wireframe: true,
  // });
  // const box = new THREE.Mesh(boxGeo, boxMat);
  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.y += Math.random() - 0.4;
  // box.position.copy(pos);
  const rote = new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  // box.rotation.set(rote.x, rote.y, rote.z);
  // scene.add(box);
  const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
  const lineMat = new THREE.LineBasicMaterial({ color: getRandomColor() });
  const boxLines = new THREE.LineSegments(edges, lineMat);
  boxLines.position.copy(pos);
  boxLines.rotation.set(rote.x, rote.y, rote.z);
  scene.add(boxLines);
}

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
  renderer.render(scene, camera);
  controls.update();
}

animate();
