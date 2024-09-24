import * as THREE from  'three';
import { createArena, createFloor, wallBoxes, walls } from './level1.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        onWindowResize,} from "../libs/util/util.js";
import { keyboardUpdate, isOrbitControlsActive, initialCameraPosition } from './keyboard.js';
import { update } from './shooting.js';
import { tank1, tank2, tank1BB, tank2BB  } from './tank.js';
import { runFromPlayer,botComp,botShoot
 } from './tank_bot.js';

export { scene };

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

createArena(200, scene);
createFloor(200, scene);

render();

function render()
{
  
  requestAnimationFrame(render);
  botShoot(tank2, tank1, scene);
  keyboardUpdate();
  runFromPlayer(tank2,0.5)
  update(tank1, tank2, scene);
  botComp(tank2,tank1,walls)

  if (!isOrbitControlsActive) {
    // Calculate the midpoint between the two tanks
    let midpoint = new THREE.Vector3().addVectors(tank1.position, tank2.position).multiplyScalar(0.5);

    // Calculate the distance between the two tanks
    let distance = tank1.position.distanceTo(tank2.position);

    // Set the camera position based on the midpoint and distance
    camera.position.x = midpoint.x;
    camera.position.y = 120; // keep the camera at the same height
    camera.position.z = midpoint.z + distance; // adjust the camera distance based on the tanks' distance

    // Make the camera look at the midpoint
    camera.lookAt(midpoint);
  } else {
    // Store the current camera position before activating OrbitControls
    initialCameraPosition.copy(camera.position);
  }

  renderer.render(scene, camera) // Render scene
}