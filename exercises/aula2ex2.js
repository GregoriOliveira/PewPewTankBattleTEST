import * as THREE from 'three';
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

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let spheeres = [];
for (var i = 0; i < 12; i++) {
  let spheereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
  let spheere = new THREE.Mesh(spheereGeometry, material);
  spheere.position.y = 0.5;
  spheeres.push(spheere);
}
function relogio(spheeres) {
  for (var i = 0; i < 12; i++) {
    scene.add(spheeres[i]);
    spheeres[i].rotateY(THREE.MathUtils.degToRad(30 * i));
    spheeres[i].translateX(4);
  }
}
relogio(spheeres);

// add the cube to the scene




// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}