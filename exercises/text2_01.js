import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { initRenderer, initCamera, initDefaultBasicLight, setDefaultMaterial, onWindowResize, createGroundPlaneXZ } from "../libs/util/util.js";

// Initial variables
let scene, renderer, camera, material, directionalLight, orbit, cube;

scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 0, 15)); // Init camera on z-axis
orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
material = setDefaultMaterial(); // create a basic material
directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Create a directional light
directionalLight.position.set(0, 0, 10); // Position on z-axis
scene.add(directionalLight); // Add light to scene

// Load textures
const textureLoader = new THREE.TextureLoader();
const crossTexture = textureLoader.load('../assets/textures/NormalMapping/cross.png');
const crossNormalTexture = textureLoader.load('../assets/textures/NormalMapping/crossNormal.png');
const crossSideTexture = textureLoader.load('../assets/textures/NormalMapping/crossSide.png');
const crossTopTexture = textureLoader.load('../assets/textures/NormalMapping/crossTop.png');

// Create materials for different sides
const materials = [
    new THREE.MeshPhongMaterial({ map: crossSideTexture, normalMap: crossNormalTexture }), // right
    new THREE.MeshPhongMaterial({ map: crossSideTexture, normalMap: crossNormalTexture }), // left
    new THREE.MeshPhongMaterial({ map: crossTopTexture, normalMap: crossNormalTexture }), // top
    new THREE.MeshPhongMaterial({ map: crossSideTexture, normalMap: crossNormalTexture }), // bottom
    new THREE.MeshPhongMaterial({ map: crossTexture, normalMap: crossNormalTexture }), // front
    new THREE.MeshPhongMaterial({ map: crossSideTexture, normalMap: crossNormalTexture }) // back
];

// Create the box with different materials
let cubeGeometry = new THREE.BoxGeometry(3, 3, 0.3);
cube = new THREE.Mesh(cubeGeometry, materials);
cube.position.set(0.0, 0.0, 0.0); // Adjusted to match the new height
scene.add(cube);

// Initialize KeyboardState
let keyboard = new KeyboardState();

function updateKeyboard() {
    keyboard.update();
    if (keyboard.pressed("A")) {
        cube.rotateY(THREE.MathUtils.degToRad(-5));
    }
    if (keyboard.pressed("D")) {
        cube.rotateY(THREE.MathUtils.degToRad(5));
    }
    if (keyboard.pressed("W")) {
        cube.rotateX(THREE.MathUtils.degToRad(-5));
    }
    if (keyboard.pressed("S")) {
        cube.rotateX(THREE.MathUtils.degToRad(5));
    }
}

render();
function render() {
    requestAnimationFrame(render);
    updateKeyboard();
    renderer.render(scene, camera); // Render scene
}
