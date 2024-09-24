import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { tank1, tank2, tank1BB, tank2BB } from './tank.js';
import { wallBoxes, walls } from './level1.js';
import { scene } from './main.js';
import { shoot } from './shooting.js';
import { handleCollision } from './collisions.js';

var keyboard = new KeyboardState();
export let isOrbitControlsActive = false;
export let initialCameraPosition = new THREE.Vector3(0, 200, 30);

function keyboardUpdate() {
  keyboard.update();
  var angle = THREE.MathUtils.degToRad(5);

  var oldPosition1 = tank1.position.clone();
  var oldPosition2 = tank2.position.clone();

  // Tank 1 movement
  if (keyboard.pressed("W")) tank1.translateZ(0.7);
  if (keyboard.pressed("S")) tank1.translateZ(-0.7);
  if (keyboard.pressed("A")) tank1.rotateY(angle);
  if (keyboard.pressed("D")) tank1.rotateY(-angle);
  if (keyboard.down("space")) shoot(tank1, scene, wallBoxes);
  if (keyboard.down("Q")) shoot(tank1, scene, wallBoxes);
  if (keyboard.pressed("up")) tank1.translateZ(0.7);
  if (keyboard.pressed("down")) tank1.translateZ(-0.7);
  if (keyboard.pressed("left")) tank1.rotateY(angle);
  if (keyboard.pressed("right")) tank1.rotateY(-angle);
  if (keyboard.down("/")) shoot(tank1, scene, wallBoxes);
  if (keyboard.down(",")) shoot(tank1, scene, wallBoxes);

  // Orbit control
  if (keyboard.down("O")) isOrbitControlsActive = !isOrbitControlsActive;

  tank1BB.setFromObject(tank1);
  tank2BB.setFromObject(tank2);

  let tankDirection = new THREE.Vector3();
  tank1.getWorldDirection(tankDirection);

  // Check for collisions with walls
  for (let i = 0; i < wallBoxes.length; i++) {

    if (tank1BB.intersectsBox(wallBoxes[i])) {
      handleCollision(tank1, walls, 0.2);
    }

    if (tank2BB.intersectsBox(wallBoxes[i])) {
      handleCollision(tank2, walls, 0.2);
    }
  }

  // Check for tank-to-tank collision
  if (tank1BB.intersectsBox(tank2BB)) {
    tank1.position.copy(oldPosition1);
  }
  if (tank2BB.intersectsBox(tank1BB)) {
    tank2.position.copy(oldPosition2);
  }
}

export { keyboardUpdate };
