import * as THREE from 'three';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { cannon } from './cannon.js';

const loader = new GLTFLoader();

function loadTankModel(size, onLoad) {
  loader.load('./tank.glb', function (gltf) {
    const tank = gltf.scene;

    // Ensure the model is scaled correctly
    tank.scale.set(size, size, size);

    // Set the initial position and rotation
    tank.position.set(0, size / 2, 0); // Adjust the position as needed
    tank.rotation.y = Math.PI; // Rotate the tank 180 degrees

    onLoad(tank);
  });
}

function createBoundingBox(group) {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(group);
  return boundingBox;
}

const tankSize = 5;
const redMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
const blueMaterial = new THREE.MeshPhongMaterial({color: 0x0000FF});
const qMaterial = new THREE.MeshPhongMaterial({color: 0x008000});

// Create two separate groups for the tanks
const tank1 = new THREE.Group();
const tank2 = new THREE.Group();
const tank3 = new THREE.Group();
const tank4 = new THREE.Group();

// Load tank models and assign materials
loadTankModel(tankSize, function (loadedTank) {
  tank1.add(loadedTank);
  tank1.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
});

loadTankModel(tankSize, function (loadedTank) {
  tank2.add(loadedTank); // Add tank2 to its group
  tank2.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = redMaterial;
    }
  });
});

loadTankModel(tankSize, function (loadedTank) {
  tank3.add(loadedTank); // Add tank3 to its group
  tank3.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = blueMaterial;
    }
  });
});

loadTankModel(tankSize, function (loadedTank) {
  tank4.add(loadedTank); // Add tank3 to its group
  tank4.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = qMaterial;
    }
  });
});

// Create bounding boxes for both tank groups
const tank1BB = createBoundingBox(tank1);
const tank2BB = createBoundingBox(tank2);
const tank3BB = createBoundingBox(tank3);
const tank4BB = createBoundingBox(tank4);

tank1.castShadow = true;
tank2.castShadow = true;
tank3.castShadow = true;
tank4.castShadow = true;

export { tank1, tank2, tank3, tank4, tank1BB, tank2BB, tank3BB, tank4BB};
