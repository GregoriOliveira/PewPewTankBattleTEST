import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  InfoBox,
  onWindowResize,
  createGroundPlaneXZ
} from "../libs/util/util.js";
import { Color } from '../build/three.module.js';

let scene, renderer, camera, material, material2, material3, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
material2 = setDefaultMaterial('lightgreen');
material3 = setDefaultMaterial('lightblue');
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// To be used to manage keyboard
let clock = new THREE.Clock();

// Show text information onscreen
showInformation();

// To use the keyboard
var keyboard = new KeyboardState();


// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(11, 0.3, 6);
let cilynderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);

let cube = new THREE.Mesh(cubeGeometry, material);

// position the cube
cube.position.set(0.0, 3.0, 0.0);
// add the cube to the scene


function cilindro() {
  const cilynder = new THREE.Mesh(cilynderGeometry, material);
  return cilynder;
}
function addPe() {
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      const cil = cilindro();
      cube.add(cil);
      cil.position.set((i * 2) * -5.1 + 5.1, -1.5, (j * 2) * 2.6 - 2.6);

    }
  }
}
addPe();
scene.add(cube);

// Use this to show information onscreen


render();
function keyboardUpdate() {

  keyboard.update();

  var speed = 30;
  var moveDistance = speed * clock.getDelta();

  // Keyboard.down - execute only once per key pressed
  if (keyboard.down("left")) cube.translateX(-1);
  if (keyboard.down("right")) cube.translateX(1);
  if (keyboard.down("up")) cube.translateZ(1);
  if (keyboard.down("down")) cube.translateZ(-1);

  // Keyboard.pressed - execute while is pressed
  if (keyboard.pressed("A")) cube.translateX(-moveDistance);
  if (keyboard.pressed("D")) cube.translateX(moveDistance);
  if (keyboard.pressed("W")) cube.translateZ(moveDistance);
  if (keyboard.pressed("S")) cube.translateZ(-moveDistance);

  if (keyboard.pressed("space")) cube.position.set(0.0, 2.0, 0.0);
}

function showInformation() {
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("Keyboard Example");
  controls.addParagraph();
  controls.add("Press WASD keys to move continuously");
  controls.add("Press arrow keys to move in discrete steps");
  controls.add("Press SPACE to put the cube in its original position");
  controls.show();
}

function render() {
  requestAnimationFrame(render); // Show events
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}
