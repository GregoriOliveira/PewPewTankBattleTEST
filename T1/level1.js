import * as THREE from "three";
import { tank1, tank2 } from './tank.js';

let greyMaterial = new THREE.MeshPhongMaterial({color: 0x808080});
let darkGreyMaterial = new THREE.MeshPhongMaterial({color: 0x505050});
const wallBoxes = [];
const walls = [];

// Define the matrix
let matrix = [
    'w w w w w w w w w w w w w w w w w',
    'w e e e e e e e w e e e e e e e w',
    'w e e e e e e e w e e e e e e e w',
    'w e e e e e e e w e e e e e e e w',
    'w e e e e e e e e e e e e e e e w',
    'w e e e e e e e e e e e e e e e w',
    'w e e e e e e e e e e e e e e e w',
    'w e e e e e e e e e e e e e e e w',
    'w e e e e e e e w e e e e e e e w',
    'w e t1 e e e e e w e e e e e t2 e w',
    'w e e e e e e e w e e e e e e e w',
    'w w w w w w w w w w w w w w w w w'
  ];

  // Create the arena and the tanks
  function createArena(size, scene) {
    const cubeSize = size / matrix.length;
    const halfSize = size / 2;
  
    for (let i = 0; i < matrix.length; i++) {
      let row = matrix[i].split(' ');
      for (let j = 0; j < row.length; j++) {
        if (row[j] === 'w') {
          let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          let cube = new THREE.Mesh(cubeGeometry, darkGreyMaterial);
          cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
          scene.add(cube);
          // Create a bounding box for the wall cube
          const wallBox = new THREE.Box3().setFromObject(cube);
          wallBoxes.push(wallBox);
          walls.push(cube);
        } else if (row[j] === 't1') {
          tank1.position.set(j * cubeSize - halfSize, 1.2, i * cubeSize - halfSize);
          scene.add(tank1);
        } else if (row[j] === 't2') {
          tank2.position.set(j * cubeSize - halfSize, 1.2, i * cubeSize - halfSize);
          scene.add(tank2);
        }
      }
    }
  }

  function createFloor(size, scene){
    const floorSize = size / matrix.length;
    let floorGeometry = new THREE.PlaneGeometry(floorSize * 17, floorSize * 12);
    let floor = new THREE.Mesh(floorGeometry, greyMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate the floor 90 degrees
    floor.position.set(floorSize * 2, 0, -floorSize + 8.3);
    scene.add(floor);
  }

  export { createArena, createFloor, wallBoxes, walls };