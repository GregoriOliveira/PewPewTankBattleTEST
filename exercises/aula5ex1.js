import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
  initRenderer,
  initDefaultSpotlight,
  initCamera,
  createGroundPlane,
  onWindowResize
} from "../libs/util/util.js";

let scene = new THREE.Scene();    // Create main scene
let renderer = initRenderer();    // View function in util/utils
let light = initDefaultSpotlight(scene, new THREE.Vector3(7.0, 7.0, 7.0), 300);
let camera = initCamera(new THREE.Vector3(3.6, 4.6, 8.2)); // Init camera in this position
let trackballControls = new TrackballControls(camera, renderer.domElement);

// Show axes 
let axesHelper = new THREE.AxesHelper(5);
axesHelper.translateY(0.1);
scene.add(axesHelper);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

let groundPlane = createGroundPlane(10, 10, 40, 40); // width, height, resolutionW, resolutionH
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Create sphere
let geometry = new THREE.SphereGeometry(0.2, 32, 16);
let material = new THREE.MeshPhongMaterial({ color: "red", shininess: "200" });
let obj1 = new THREE.Mesh(geometry, material);
obj1.castShadow = true;
obj1.position.set(0, 0.2, 0);
scene.add(obj1);

let obj2 = new THREE.Mesh(geometry, material);
obj2.castShadow = true;
obj2.position.set(0, 0.2, 0.6);
scene.add(obj2);

// Variables that will be used for linear interpolation
const lerpConfig = {
  destination: new THREE.Vector3(0.0, 0.2, 0.0),
  alpha: 0.01,
  move: true,
  reset: function () {
    if (true) {

      this.destination.set(0, 0.2, 0);
      lerpConfig2.destination.set(0, 0.2, 0.6);

    }
  }
}

const lerpConfig2 = {
  destination: new THREE.Vector3(0.0, 0.2, 0.6),
  alpha: 0.005,
  move: true,

}

buildInterface();
render();

function buildInterface() {
  let gui = new GUI();
  let folder = gui.addFolder("Lerp Options");
  folder.open();
  folder.add(lerpConfig.destination, 'x', -5, 5).onChange().name("Esfera 1");
  folder.add(lerpConfig2.destination, 'x', -5, 5).onChange().name("Esfera 2");
  folder.add(lerpConfig, "reset", false).onChange().name("Reset");

}

function render() {
  trackballControls.update();

  if (lerpConfig.move) obj1.position.lerp(lerpConfig.destination, lerpConfig.alpha);
  if (lerpConfig.move) obj2.position.lerp(lerpConfig2.destination, lerpConfig2.alpha);

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}