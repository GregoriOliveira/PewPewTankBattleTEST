import * as THREE from 'three';
import { wallBoxes } from './level1.js';
import { resetl } from './reset.js';

export function handleCollision(tank, walls, wallBoxes, delta) {
  const oldPosition = tank.position.clone();
  let newPosition = oldPosition.clone();
  let movementVector = new THREE.Vector3();

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    const wallBox = wallBoxes[i];
    const tankBox = new THREE.Box3().setFromObject(tank);

    if (tankBox.intersectsBox(wallBox)) {
      const tankPos = oldPosition.clone();
      const wallPos = wall.position.clone();

      const diffX = Math.abs(tankPos.x - wallPos.x);
      const diffZ = Math.abs(tankPos.z - wallPos.z);

      if (diffX > diffZ) {
        // Collision in the z-axis, slide in x-axis
        if (tankPos.x > wallPos.x) {
          tankPos.x += 2.5 * delta;
        } else {
          tankPos.x -= 2.5 * delta;
        }
      } else {
        // Collision in the x-axis, slide in z-axis
        if (tankPos.z > wallPos.z) {
          tankPos.z += 2.5 * delta;
        } else {
          tankPos.z -= 2.5 * delta;
        }
      }

      // Check if the new position is valid and set y position to 1.2
      tankPos.y = -2.8;
      tank.position.lerp(tankPos, 0.05);
      const newTankBox = new THREE.Box3().setFromObject(tank);
      let isValidPosition = true;

      if (newTankBox.intersectsBox(wallBoxes[i])) {
        isValidPosition = false;
        break;
      }

      // If the new position is valid, keep the tank there, otherwise, revert to the old position
      if (!isValidPosition) {
        tank.position.copy(oldPosition);
      } else {
        // Update the bounding box to the new position
        tankBox.setFromObject(tank);
      }
    }
  }
}

export function checkComplete(tank, boxes) {
  for (let i = 0; i < boxes.length; i++) {
    const wallBox = boxes[i];
    const tankBox = new THREE.Box3().setFromObject(tank);

    if (tankBox.intersectsBox(wallBox)) {
      return true;
    }
  }
}