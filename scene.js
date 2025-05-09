import * as THREE from 'three';
import spline from './utility/spline.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import getRandomColor from './utility/getRandomColor.js';

export function createScene({ width, height } = {}) {
  // renderer
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

  // CAMERA LIGHT

  const cameraLight = new THREE.PointLight(0xffeedd, 0.7, 0);
  camera.add(cameraLight);
  cameraLight.position.set(0, 0, 0);
  scene.add(camera);

  // TUBE SETUP
  let tubeLines = null;
  let tubeGeo = null;
  let tubeParams = {
    type: 'mesh',
    color: getRandomColor(),
    scale: 3,
  };
  createTube(tubeParams);

  // CREATE TUBE FUNCTION

  function createTube({ type, color, scale }) {
    if (tubeLines) {
      scene.remove(tubeLines);
      if (tubeLines.geometry) tubeLines.geometry.dispose();
      if (tubeLines.material) {
        if (Array.isArray(tubeLines.material)) {
          tubeLines.material.forEach(tubeMatEl => tubeMatEl.dispose());
        } else tubeLines.material.dispose();
      }
    }
    tubeGeo = new THREE.TubeGeometry(spline, scale * 80, 0.65, scale * 10, true);
    const texLoader = new THREE.TextureLoader();
    let tubeMat;
    switch (type) {
      case 'wood':
      case 'metal':
        const metalTex = texLoader.load(`./assets/${type}-texture.jpg`);
        metalTex.wrapS = THREE.RepeatWrapping;
        metalTex.wrapT = THREE.RepeatWrapping;
        metalTex.repeat.set(100, 10);

        tubeMat = new THREE.MeshStandardMaterial({
          map: metalTex,
          roughness: 1,
          metalness: 1,
          side: THREE.DoubleSide,
          flatShading: false,
          vertexColors: false,
        });
        tubeLines = new THREE.Mesh(tubeGeo, tubeMat);
        break;
      case 'solid':
        tubeMat = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.4,
          roughness: 0.1,
          side: THREE.DoubleSide,
        });
        tubeLines = new THREE.Mesh(tubeGeo, tubeMat);
        break;
      case 'default':
      default:
        const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
        tubeMat = new THREE.LineBasicMaterial({ color: color });
        tubeLines = new THREE.LineSegments(edges, tubeMat);
        break;
    }
    scene.add(tubeLines);
  }

  // add boxes

  let boxLines = [];
  let elemsParams = {
    type: null,
    color: 'random',
    count: 150,
  };
  createElems(elemsParams);

  // CREATE BOXES FUNCTION

  function createElems({ type, color, count }) {
    if (boxLines.length > 0) {
      boxLines.forEach(box => {
        scene.remove(box);
        box.geometry.dispose();
        box.material.dispose();
      });
      boxLines = [];
    }
    const numBoxes = count;
    const size = 0.075;
    const boxGeo = new THREE.BoxGeometry(size, size, size);

    for (let i = 0; i < numBoxes; i++) {
      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeo.parameters.path.getPointAt(p);
      pos.x += Math.random() - 0.4;
      pos.y += Math.random() - 0.4;
      const rote = new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      let element;
      let elemMat;
      const elemColor = color === 'random' ? getRandomColor() : color;
      const texLoader = new THREE.TextureLoader();
      switch (type) {
        case 'metal':
        case 'wood':
          const texture = texLoader.load(`./assets/${type}-texture.jpg`);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(0.1, 0.1);
          elemMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1,
            metalness: 1,
            side: THREE.DoubleSide,
          });
          element = new THREE.Mesh(boxGeo, elemMat);
          break;
        case 'solid':
          elemMat = new THREE.MeshStandardMaterial({
            color: elemColor,
            metalness: 0.4,
            roughness: 0.1,
            side: THREE.DoubleSide,
          });
          element = new THREE.Mesh(boxGeo, elemMat);
          break;
        case 'mesh':
        default:
          const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
          elemMat = new THREE.LineBasicMaterial({ color: elemColor });
          element = new THREE.LineSegments(edges, elemMat);
          break;
      }

      boxLines.push(element);
      boxLines[i].position.copy(pos);
      boxLines[i].rotation.set(rote.x, rote.y, rote.z);
    }
    boxLines.forEach(box => scene.add(box));
  }

  // CREATE CAMERA

  let cameraSpeed = 1000;
  let isReversed = false;
  let timeOffset = 0;
  let lastReverseTime = performance.now();
  let cameraProgress = 0;
  let lastSpeed = cameraSpeed;

  function createCamera(t) {
    const elapsed = (t - lastReverseTime) * (isReversed ? -1 : 1) * 0.1;
    const totalTime = 8 * cameraSpeed;

    cameraProgress = (timeOffset + elapsed) / totalTime;
    const normalizedProgress = ((cameraProgress % 1) + 1) % 1;

    const pos = tubeGeo.parameters.path.getPointAt(normalizedProgress);
    const lookAtProgress = (normalizedProgress + (isReversed ? -0.01 : 0.01) + 1) % 1;
    const lookAt = tubeGeo.parameters.path.getPointAt(lookAtProgress);

    camera.position.copy(pos);
    camera.lookAt(lookAt);
  }

  function handleSpeedChange(newSpeed) {
    timeOffset = cameraProgress * (8 * cameraSpeed);
    lastSpeed = cameraSpeed;
    cameraSpeed = newSpeed;
  }

  function toggleCameraDirection(t) {
    timeOffset = cameraProgress * (8 * cameraSpeed);
    lastReverseTime = t;
    isReversed = !isReversed;
  }

  function animate(t = 0) {
    requestAnimationFrame(animate);
    createCamera(t);
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
    updateTube: ({ type, color, scale }) => {
      if (!type) type = tubeParams.type;
      if (!color) color = tubeParams.color;
      tubeParams = {
        type: type,
        color: color,
        scale: scale,
      };
      createTube(tubeParams);
    },
    updateElems: ({ type, color, count }) => {
      if (!color) color = elemsParams.color;
      elemsParams = {
        type: type,
        color: color,
        count: count,
      };
      createElems(elemsParams);
    },
    updateCamera: ({ currentSpeed, currentReversed }) => {
      if (currentSpeed !== undefined) {
        handleSpeedChange(currentSpeed);
      }
      if (currentReversed !== undefined && currentReversed !== isReversed) {
        requestAnimationFrame(t => {
          toggleCameraDirection(t);
        });
      }
    },

    toggleCameraDirection: () => {
      requestAnimationFrame(t => {
        toggleCameraDirection(t);
      });
    },
  };
}
