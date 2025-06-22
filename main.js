import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/PointerLockControls.js';

const menu = document.getElementById('menu');
const playBtn = document.getElementById('playBtn');
const canvas = document.getElementById('game');

let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const objects = [];

playBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const room = document.getElementById('room').value.trim();

  if (!name || room.length !== 4) {
    alert('Bitte Name und 4-stelligen Raumcode eingeben!');
    return;
  }
  startGame();
});

function startGame() {
  menu.style.display = 'none';
  canvas.style.display = 'block';

  init();
  animate();
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new PointerLockControls(camera, document.body);

  canvas.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    // locked = true;
  });

  controls.addEventListener('unlock', () => {
    // locked = false;
  });

  scene.add(controls.getObject());

  // Boden
  const floorGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = - Math.PI / 2;
  scene.add(floor);

  // Ein Würfel zum Anschauen
  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0, 1, -10);
  scene.add(box);
  objects.push(box);

  // Event Listener für Bewegung
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;
  }
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = clock.getDelta();

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  renderer.render(scene, camera);
}
