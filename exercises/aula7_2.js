
import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
  initRenderer,
  InfoBox,
  SecondaryBox,
  initDefaultSpotlight,
  createGroundPlane,
  createLightSphere,
  onWindowResize
} from "../libs/util/util.js";
import { CylinderGeometry, SphereGeometry } from '../build/three.module.js';

let scene, renderer, camera, stats, light, lightSphere, lightPosition, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer("rgb(30, 30, 42)");    // View function in util/utils
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(2.18, 1.62, 3.31);
camera.up.set(0, 1, 0);
orbit = new OrbitControls(camera, renderer.domElement);
stats = new Stats();          // To show FPS information

let ambientL = new THREE.AmbientLight("rgb(80,80,80)");
scene.add(ambientL);
let dirL = new THREE.DirectionalLight("rgb(255,255,255)", 0.8);
dirL.position.set(3, 1.2, 0);
dirL.castShadow = true;
dirL.shadow.mapSize.width = 256;
dirL.shadow.mapSize.height = 256;
dirL.shadow.camera.near = 0.1;
dirL.shadow.camera.far = 6
dirL.shadow.camera.left = -2.5
dirL.shadow.camera.right = 2.5;
dirL.shadow.camera.bottom = -2.5;
dirL.shadow.camera.top = 2.5;
scene.add(dirL);

let helper = new THREE.DirectionalLightHelper(dirL);
scene.add(helper);



// To use the keyboard
var keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlane(10.0, 10, 50, 50); // width and height
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(1.5);
axesHelper.visible = false;
scene.add(axesHelper);

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

//---------------------------------------------------------
// Build Materials

let phongObject, lambertBall, lambertCyl

// Teapot basic geometry
var geometry = new TeapotGeometry(0.25);
var geometry2 = new CylinderGeometry(0.05, 0.4, 1.2, 13);
var geometry3 = new SphereGeometry(0.2, 15, 30);

phongObject = createPhongTeapot(geometry);
lambertBall = createLambertBall(geometry3);
lambertCyl = createLambertCyl(geometry2);




render();



function buildTeapot(geometry, material) {
  let obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.receiveShadow = true;
  obj.position.set(-1.0, 0.25, 0.0);

  scene.add(obj);
  return obj;
}
function buildCyl(geometry, material) {
  let obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.receiveShadow = true;
  obj.position.set(1.0, 0.6, 0.0);

  scene.add(obj);
  return obj;
}
function buildBall(geometry, material) {
  let obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.receiveShadow = true;
  obj.position.set(-1.75, 0.2, 0.0);

  scene.add(obj);
  return obj;
}

//More information here: https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
function createPhongTeapot(geometry) {
  let material = new THREE.MeshPhongMaterial({
    color: "rgb(255,20,20)",     // Main color of the object
    shininess: "100",            // Shininess of the object
    specular: "rgb(255,255,255)", // Color of the specular component

  });
  return buildTeapot(geometry, material);
}

//More information here: https://threejs.org/docs/#api/en/materials/MeshLambertMaterial
function createLambertBall(geometry) {
  let material = new THREE.MeshLambertMaterial({
    color: "lightgreen"     // Main color of the object
  });
  return buildBall(geometry, material);
}
function createLambertCyl(geometry) {
  let material = new THREE.MeshLambertMaterial({
    color: "lightblue"     // Main color of the object

  });
  return buildCyl(geometry, material);
}



function keyboardUpdate() {
  keyboard.update();
  if (keyboard.pressed("D")) {
    lightPosition.x += 0.05;
    updateLightPosition();
  }
  if (keyboard.pressed("A")) {
    lightPosition.x -= 0.05;
    updateLightPosition();
  }
  if (keyboard.pressed("W")) {
    lightPosition.y += 0.05;
    updateLightPosition();
  }
  if (keyboard.pressed("S")) {
    lightPosition.y -= 0.05;
    updateLightPosition();
  }
  if (keyboard.pressed("E")) {
    lightPosition.z -= 0.05;
    updateLightPosition();
  }
  if (keyboard.pressed("Q")) {
    lightPosition.z += 0.05;
    updateLightPosition();
  }
}

// Update light position of the current light
function updateLightPosition() {
  light.position.copy(lightPosition);
  lightSphere.position.copy(lightPosition);
}

function showInformation() {
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("Lighting - Types of Materials");
  controls.addParagraph();
  controls.add("Use the WASD-QE keys to move the light");
  controls.show();
}


function render() {
  stats.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
