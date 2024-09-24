/*
Based on the following example:
http://jyunming-chen.github.io/tutsplus/tutsplus28.html
*/

import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import {OrbitControls} from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
		initCamera,
		onWindowResize,
		lightFollowingCamera,
      initDefaultBasicLight,      
		initDefaultSpotlight,
      createGroundPlane} from "../libs/util/util.js";

let scene = new THREE.Scene();
let camera = initCamera(new THREE.Vector3(0, 12, 45)); // Init camera in this position
let renderer = initRenderer(); 
	renderer.setClearColor(new THREE.Color("rgb(200, 200, 240)"));
let light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

let orbitcontrols = new OrbitControls (camera, renderer.domElement);
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

let sphereLightMesh;
let pointLight;
let lightAnimation = true;

let textureFile = "../assets/textures/DisplacementMapping/rockWall.png"
let normalMapFile = "../assets/textures/DisplacementMapping/rockWall_Normal.png"
let heightMap = "../assets/textures/DisplacementMapping/rockWall_Height.png"




var boxNormal = createMesh(new THREE.SphereGeometry(3,64,64), textureFile, normalMapFile);
boxNormal.rotation.y = 0.5;
boxNormal.position.x = -14;
boxNormal.castShadow = true;
scene.add(boxNormal);

var textureLoader = new THREE.TextureLoader();
let floor  = textureLoader.load('../assets/textures/floorWood.jpg');
   floor.colorSpace = THREE.SRGBColorSpace;
var groundPlane = createGroundPlane(100.0, 100.0, 100, 100); // width and height
   groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
   groundPlane.material.map = floor;
   groundPlane.position.y = -7.6;
   groundPlane.rotation.x = -0.5 * Math.PI;
scene.add(groundPlane);

pointLight = new THREE.PointLight("white");//#ff5808");
pointLight.castShadow = true;
pointLight.intensity = 300;
scene.add(pointLight);

// add a small sphere simulating the pointlight
var sphereLight = new THREE.SphereGeometry(0.2);
var sphereLightMaterial = new THREE.MeshBasicMaterial({color: "white"});
sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
	sphereLightMesh.castShadow = true;
scene.add(sphereLightMesh);

// setup the control gui

render();


function createMesh(geom, imageFile, normal) {
	let nmap = (normal ? new THREE.TextureLoader().load(normal) : null);
	var tex = new THREE.TextureLoader().load(imageFile);
	    tex.colorSpace = THREE.SRGBColorSpace;   
	var mat = new THREE.MeshPhongMaterial({
		map: tex,
		normalMap: nmap,
      normalScale: new THREE.Vector2(2.5, 2.5),
	});

   console.log(mat)

	var mesh = new THREE.Mesh(geom, mat);
	return mesh;
}



function render() {
	if(lightAnimation)
 
	lightFollowingCamera(light, camera);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
