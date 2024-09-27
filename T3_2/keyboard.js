import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import { tank1, tank2, tank1BB, tank2BB, tank3, tank3BB, tank4BB, tank4} from './tank.js';
import { wallBoxes, walls, doors, doorBoxes, movingWalls, movingWallBoxes, doors1, door1Boxes, levelcheck} from './level1.js';
import { resetLevel, selectedLevel } from './main.js';
import { shoot } from './shooting.js';
import { checkComplete, handleCollision } from './collisions.js';
import { scene } from './main.js';
import { hitPlayerSound,tankShotSound } from './shooting.js';
import { musicSound } from './shooting.js';

export var keyboard = new KeyboardState();
export let isOrbitControlsActive = false;
export let godMode = false;
export let initialCameraPosition = new THREE.Vector3(0, 200, 30);
export let soundActive = true;


function keyboardUpdate() {
  keyboard.update();
  var angle = THREE.MathUtils.degToRad(5);

  var oldPosition1 = tank1.position.clone();
  var oldPosition2 = tank2.position.clone();
  var oldPosition3 = tank3.position.clone();
  var oldPosition3 = tank4.position.clone();

  // Tank 1 movement
  if(selectedLevel === 1){
    if (keyboard.pressed("W")) tank1.translateZ(-0.7);
    if (keyboard.pressed("S")) tank1.translateZ(0.7);
    }
    else if (selectedLevel === 2){
      if (keyboard.pressed("W")) tank1.translateZ(-1.05);
      if (keyboard.pressed("S")) tank1.translateZ(1.05);  
    }
    else if (selectedLevel === 3){
      if (keyboard.pressed("W")) tank1.translateZ(-1.4);
      if (keyboard.pressed("S")) tank1.translateZ(1.4); 
        }
  if (keyboard.pressed("A")) tank1.rotateY(angle);
  if (keyboard.pressed("D")) tank1.rotateY(-angle);
  if (keyboard.down("space")) shoot(tank1, scene, wallBoxes);

  // Tank 2 movement
  if(selectedLevel === 1){
    if (keyboard.pressed("up")) tank1.translateZ(-0.7);
    if (keyboard.pressed("down")) tank1.translateZ(0.7);
    }
    else if (selectedLevel === 2){
      if (keyboard.pressed("up")) tank1.translateZ(-1.05);
      if (keyboard.pressed("down")) tank1.translateZ(1.05);
    }
    else if (selectedLevel === 3){
      if (keyboard.pressed("up")) tank1.translateZ(-1.4);
      if (keyboard.pressed("down")) tank1.translateZ(1.4); 
        }
  
  if (keyboard.pressed("left")) tank1.rotateY(angle);
  if (keyboard.pressed("right")) tank1.rotateY(-angle);

  // Orbit control
  if (keyboard.down("O")) isOrbitControlsActive = !isOrbitControlsActive;
  if (keyboard.down("G")) godMode = !godMode;
  if(keyboard.down("P")) {soundActive = !soundActive;
    if(soundActive===true){
      musicSound.play();
    }
    else{
      musicSound.stop();

    }
  }
  
    
  

  if (keyboard.down("1")) {
    resetLevel(1); // Reset and switch to level 1
  }
  if (keyboard.down("2")) {
    resetLevel(2); // Reset and switch to level 2
  }
  if (keyboard.down("3")) {
    resetLevel(3); // Reset and switch to level 2
  }

  tank1BB.setFromObject(tank1);
  tank2BB.setFromObject(tank2);
  if(selectedLevel === 2 || selectedLevel === 3){
  tank3BB.setFromObject(tank3);
  }
  else if (selectedLevel === 3){
    tank4BB.setFromObject(tank4);
  }

  let tankDirection = new THREE.Vector3();
  tank1.getWorldDirection(tankDirection);

  // Check for collisions with walls
  for (let i = 0; i < wallBoxes.length; i++) {

      handleCollision(tank1, walls, wallBoxes, 0.2);
      handleCollision(tank2, walls, wallBoxes, 0.2);
      handleCollision(tank3, walls, wallBoxes, 0.2);
      handleCollision(tank4, walls, wallBoxes, 0.2);
      handleCollision(tank1, doors, doorBoxes, 0.2);
      handleCollision(tank2, doors, doorBoxes, 0.2);
      handleCollision(tank3, doors, doorBoxes, 0.2);
      handleCollision(tank4, doors, doorBoxes, 0.2);
      handleCollision(tank1, doors1, door1Boxes, 0.2);
      handleCollision(tank2, doors1, door1Boxes, 0.2);
      handleCollision(tank3, doors1, door1Boxes, 0.2);
      handleCollision(tank4, doors1, door1Boxes, 0.2);
      handleCollision(tank1, movingWalls, movingWallBoxes, 0.2);
      handleCollision(tank2, movingWalls, movingWallBoxes, 0.2);
      handleCollision(tank3, movingWalls, movingWallBoxes, 0.2);
      handleCollision(tank4, movingWalls, movingWallBoxes, 0.2);

  // Check for tank-to-tank collision
  if (tank1BB.intersectsBox(tank2BB)) {
    tank1.position.copy(oldPosition1);
  }
  if (tank1BB.intersectsBox(tank3BB)) {
    tank1.position.copy(oldPosition1);
  }
  if (tank1BB.intersectsBox(tank4BB)) {
    tank1.position.copy(oldPosition1);
  }
  if (tank2BB.intersectsBox(tank1BB)) {
    tank2.position.copy(oldPosition2);
  }
  if (tank2BB.intersectsBox(tank3BB)) {
    tank2.position.copy(oldPosition2);
  }
  if (tank3BB.intersectsBox(tank1BB)) {
    tank3.position.copy(oldPosition3);
  }
  if (tank3BB.intersectsBox(tank2BB)) {
    tank3.position.copy(oldPosition3);
  }
  if (tank3BB.intersectsBox(tank4BB)) {
    tank3.position.copy(oldPosition3);
  }
  if (tank4BB.intersectsBox(tank1BB)) {
    tank3.position.copy(oldPosition3);
  }
  if (tank4BB.intersectsBox(tank2BB)) {
    tank3.position.copy(oldPosition3);
  }
  if (tank4BB.intersectsBox(tank3BB)) {
    tank3.position.copy(oldPosition3);
  }
}
}

export { keyboardUpdate };
