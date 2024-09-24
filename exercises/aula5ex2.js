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

var animationOn = false; // control if animation is on or of

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
obj1.position.set(-5, 0.2, 0);
scene.add(obj1);

let obj2 = new THREE.Mesh(geometry, material);
obj2.castShadow = true;
obj2.position.set(-5, 0.2, 0.6);
scene.add(obj2);

// Variables that will be used for linear interpolation


buildInterface();
render();

function animate() {


  // Set angle's animation speed
  if (animationOn) {
    if (obj1.position.x < 5) {
      obj1.translateX(0.08);
    }
    else if (obj1.position.x = 5) {
      obj1.position.set(-5, 0.2, 0);
    }
    if (obj2.position.x < 5) {
      obj2.translateX(0.04);
    }
    else if (obj2.position.x = 5) {
      obj2.position.set(-5, 0.2, 0);
    }

  }
}


function buildInterface() {
  var controls = new function () {
    this.onChangeAnimation = function () {
      animationOn = !animationOn;
    };
    this.translateSphe = function () {
      obj1.translateX(0.2);
      obj2.translateX(0.1);
      if (obj1.position.x >= 5) {
        obj1.position.set(-5, 0.2, 0);
      }
      if (obj2.position.x >= 5) {
        obj2.position.set(-5, 0.2, 0);
      }

    };

    this.reset = function () {
      obj1.position.set(-5, 0.2, 0);
      obj2.position.set(-5, 0.2, 0.6);
    };
  };
  let gui = new GUI();
  //gui.add(controls, 'onChangeAnimation', false).name("Animation On/Off");
  let folder = gui.addFolder("Options");

  folder.add(obj1.position, 'x', -5, 5).step(0.1).name('Esfera 1');
  folder.add(obj2.position, 'x', -5, 5).step(0.1).name('Esfera 2');
  folder.add(controls, 'onChangeAnimation').name("Animation On/Off");
  folder.add(controls, 'translateSphe', -5, 5).name('Translate');
  folder.add(controls, 'reset').name('Reset');

}

function render() {


  trackballControls.update();
  animate();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}