import * as THREE from 'three';
import { shoot } from './shooting.js';
import { scene } from './main.js';
import { Vector3 } from '../build/three.module.js';







export function runFromPlayer(tankBot,spd) {
  let tBotDirection = new THREE.Vector3();
  tankBot.getWorldDirection(tBotDirection);
    // Move o tankBot na direção oposta ao tankPlayer
    tankBot.position.add(tBotDirection.multiplyScalar(spd));
  
}


export function botComp(tankBot, tankPlayer, walls) {
  const botBoundingBox = new THREE.Box3().setFromObject(tankBot);
  const playerBoundingBox = new THREE.Box3().setFromObject(tankPlayer);
  const boundingBoxCenter = new THREE.Vector3();
  botBoundingBox.getCenter(boundingBoxCenter);
        const raycasterWalls = new THREE.Raycaster();
        const toPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();
        const numRays = 20;
        const coneAngle = THREE.MathUtils.degToRad(120);
        const directions = [];
      // Gerar direções para os raios no cone
        for (let i = 0; i < numRays; i++) {
          const angleOffset = (Math.random() - 0.5) * coneAngle; // Gera um offset de ângulo aleatório dentro do cone
          const direction = new THREE.Vector3(0, 0, 1); // Direção inicial (frente)
          direction.applyQuaternion(tankBot.quaternion); // Aplica a rotação do tankBot na direção
          direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleOffset);
          directions.push(direction);
        }

        let wallDetected = false;
  

        // Checar colisões com paredes (cone com alcance menor)
        for (let direction of directions) {
          raycasterWalls.set(boundingBoxCenter, direction);
          raycasterWalls.far = 25; // Alcance para detectar paredes

          const wallIntersects = raycasterWalls.intersectObjects(walls, true);
          if (wallIntersects.length > 0) {
            wallDetected = true;
            break; // Pare a verificação assim que encontrar uma parede
          }
        }
        const distanceZ = Math.abs(tankBot.position.z - tankPlayer.position.z);
        const distanceX = Math.abs(tankBot.position.x - tankPlayer.position.x);

        // Comportamento do tankBot
        if (wallDetected) {

          // Se houver uma interseção, rotaciona o tankBot
          if (distanceX) {
            if ((tank.position.z > tankPlayer.position.z))
              tank.rotateY(THREE.MathUtils.degToRad(-4));
            else
            tank.rotateY(THREE.MathUtils.degToRad(4));
          } else {
            if (distanceZ)
              tank.rotateY(THREE.MathUtils.degToRad(4));
            else
            tank.rotateY(THREE.MathUtils.degToRad(-4));

          }
          if (distanceZ > distanceX) {
            // Move na direção do tankPlayer ajustando a rotação
            if (tank.position.z > tankPlayer.position.z) {
              tank.rotateY(THREE.MathUtils.degToRad(-4)); // Rotaciona para cima
            } else {
              tank.rotateY(THREE.MathUtils.degToRad(4)); // Rotaciona para baixo
            }
        }
        }
        if (!wallDetected) {
          // 1. Rotacionar o tankBot na direção de toPlayer
          const botDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(tank.quaternion); // Direção atual do tankBot
          const angleToPlayer = botDirection.angleTo(toPlayer); // Ângulo entre a direção do tankBot e toPlayer
          const cross = botDirection.cross(toPlayer); // Produto vetorial para determinar o sentido de rotação
  
          // Verificar se precisa rotacionar à esquerda ou à direita
          if (distanceX<0) {
            if(cross.y > 0){
              tank.rotateY(THREE.MathUtils.degToRad(-4)); // Rotaciona à direita
          } else {
            tank.rotateY(THREE.MathUtils.degToRad(4)); // Rotaciona à esquerda
          } }
          if (distanceX>=0) {
            if(cross.y > 0){
              tank.rotateY(THREE.MathUtils.degToRad(4)); // Rotaciona à direita
          } else {
            tank.rotateY(THREE.MathUtils.degToRad(-4)); // Rotaciona à esquerda
          } }
  
          // 2. Movimentar-se na direção de toPlayer
        // Move o tankBot na direção do tankPlayer
          
      } if(tank.position.distanceTo(tankPlayer.position)<35){
        runFromPlayer(tank,-1.4)
      }
}


let lastShotTime = 0; // Tempo do último disparo

export function botShoot(tankBot, tankPlayer, scene) {
  
    
  const currentTime = Date.now(); // Tempo atual em milissegundos
  const timeSinceLastShot = currentTime - lastShotTime; // Tempo desde o último disparo

    if(tankBot.position.distanceTo(tankPlayer.position)<100) {
      // Se o tankPlayer for detectado, o tankBot atira
      if (timeSinceLastShot >= 3000) {
         // Se já se passaram 3 segundos ou mais
        shoot(tankBot, scene); // Chama a função de disparo
        lastShotTime = currentTime; // Atualiza o tempo do último disparo
      }
    }

}