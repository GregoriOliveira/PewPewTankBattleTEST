import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import {OrbitControls} from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
		initCamera,
		onWindowResize,
		lightFollowingCamera,
		initDefaultSpotlight} from "../libs/util/util.js";

let scene = new THREE.Scene();
let camera = initCamera(new THREE.Vector3(0, 0, 20)); // Init camera in this position
let renderer = initRenderer(); 
	renderer.setClearColor(new THREE.Color("black"));
let light = initDefaultSpotlight(scene, camera.position, 4500);
let orbitcontrols = new OrbitControls (camera, renderer.domElement);
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Create main object
let geom = new THREE.BoxGeometry(5, 5, 0.5, true);
let colormap = 	new THREE.TextureLoader().load("../assets/textures/NormalMapping/cross.png");
    colormap.colorSpace = THREE.SRGBColorSpace;
let normalmap = new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossSide.png");
let dispmap = 	new THREE.TextureLoader().load("../assets/textures/displacement/Stylized_blocks_001_height.png");
let topColormap = 	new THREE.TextureLoader().load("../assets/textures/NormalMapping/crossTop.png");

let mat = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color:"white",
	map: colormap,
  topColor: topColormap,
	normalMap: normalmap,
	displacementMap: dispmap,
	displacementScale: 1,
});



mat.normalScale.set(0.7, 0.7);

let mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);

// setup the control gui

render();


function render() {
	lightFollowingCamera(light, camera);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}