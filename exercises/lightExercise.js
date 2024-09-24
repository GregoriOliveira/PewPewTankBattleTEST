import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";
import { CylinderGeometry, Plane } from '../build/three.module.js';

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.



// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
let material2 = setDefaultMaterial('lightgreen');
let material3 = setDefaultMaterial('red');

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = true;
scene.add( axesHelper );

let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 0.2);
dirLight.position.copy(dirPosition);
 //mainLight.castShadow = true;
scene.add(dirLight);  

// Load default scene
loadLightPostScene(scene)




let cylGeo = new THREE.CylinderGeometry(0.2,0.2,1,25);
let cyl1 = new THREE.Mesh(cylGeo,material2);
let cyl2 = new THREE.Mesh(cylGeo,material3);
let cubeGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
let cube1 = new THREE.Mesh(cubeGeo,material2);
let cube2 = new THREE.Mesh(cubeGeo,material3);

cyl1.position.set(1,0.5,1);
cyl2.position.set(0,0.5,-2);
cube1.position.set(-1,0.5,-1);
cube2.position.set(0,0.5,4);
cyl1.castShadow=true;
cyl2.castShadow=true;
cube1.castShadow=true;
cube2.castShadow=true;

scene.add(cyl1);
scene.add(cyl2);
scene.add(cube1);
scene.add(cube2);

let pos = new THREE.Vector3(3, 2, 4);
let spotLight = new THREE.SpotLight("rgb(255,255,255)",2);
spotLight.angle = THREE.MathUtils.degToRad(180);
spotLight.castShadow = true;
spotLight.target.position.set(pos);
scene.add(spotLight);
spotLight.distance = 3;
spotLight.penumbra = 0.2;
spotLight.decay = 1;
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 50;


let planeGeometry = new THREE.PlaneGeometry(10, 10);
let planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5});
let plane = new THREE.Mesh(planeGeometry, planeMaterial); 
  plane.receiveShadow = true; // Allow the plane to receive shadows

  plane.rotation.x = - Math.PI / 2;
  plane.position.y = 0;

scene.add(plane);


//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  // GUI interface
  let gui = new GUI();
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
