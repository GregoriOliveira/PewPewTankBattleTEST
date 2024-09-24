import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { initRenderer, initCamera, onWindowResize } from "../libs/util/util.js";

let scene, renderer, camera, directionalLight, orbit; 
scene = new THREE.Scene();
renderer = initRenderer();
renderer.shadowMap.enabled = true;
camera = initCamera(new THREE.Vector3(0, 15, 30));

directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; 
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 40;
directionalLight.shadow.camera.left = -18;
directionalLight.shadow.camera.right = 18;
directionalLight.shadow.camera.top = 18;
directionalLight.shadow.camera.bottom = -18;
scene.add(directionalLight);

orbit = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function() { onWindowResize(camera, renderer) }, false);



let planeGeometry = new THREE.PlaneGeometry(60, 60);
let textureLoader = new THREE.TextureLoader();
let planeTexture = textureLoader.load('../assets/textures/floorWood.jpg');
let planeMaterial = new THREE.MeshPhongMaterial({ map: planeTexture });
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

let sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
let baseTexture = textureLoader.load('../assets/textures/displacement/rockWall.jpg');
let normalMap = textureLoader.load('../assets/textures/displacement/rockWall_Normal.jpg');
let displacementMap = textureLoader.load('../assets/textures/displacement/rockWall_Height.jpg');

baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
baseTexture.repeat.set(4, 3);

let sphereMaterial = new THREE.MeshStandardMaterial({
    map: baseTexture,
    normalMap: normalMap,
    displacementMap: displacementMap,
    displacementScale: 0.2,
});
sphereMaterial.normalScale.set(0.7, 0.7);

let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 2, 0);
sphere.castShadow = true;
scene.add(sphere);

setTextureOptions(sphere.material, 4, 3);

render();

//-- Functions ------------------------------------------------------
function setTextureOptions(material, repu, repv) {
    material.map.repeat.set(repu, repv);
    material.displacementMap.repeat.set(repu, repv);
    material.normalMap.repeat.set(repu, repv);
    
    material.map.wrapS = material.displacementMap.wrapS = material.normalMap.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = material.displacementMap.wrapT = material.normalMap.wrapT = THREE.RepeatWrapping;  
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
