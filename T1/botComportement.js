import * as THREE from 'three';
import { wallBoxes } from './level1.js';

export function runFromPlayer(tankBot, tankPlayer) {
  let distance = tankPlayer.position.distanceTo(tankBot.position);
  let direction = new THREE.Vector3();
  tankBot.getWorldDirection(direction);
  const safeDistance = 55;
  {
    if (distance < safeDistance) {

      direction.negate();
      tankBot.position.add(direction.multiplyScalar(0.27));
    }
    else {

      tankBot.getWorldDirection(direction);
      tankBot.position.add(direction.multiplyScalar(0.27));
    }
  }
}


export function botComp1(tankBot, tankPlayer, walls) {
  const raycaster = new THREE.Raycaster();

  const direction = new THREE.Vector3(0, 0, 1);  // Frente
  direction.applyQuaternion(tankBot.quaternion); // Aplica a rotação do tankBot na direção

  raycaster.set(tankBot.position, direction);
  raycaster.far = 35; //"Distancia" de rastreamento do raycaster
  // Verifica se o raycaster está colidindo com alguma parede
  const intersects = raycaster.intersectObjects(walls, true);
  const angle = new THREE.Vector3();
  tankBot.getWorldDirection(angle);

  {
    if (intersects.length > 0) {
      // Se houver uma interseção, rotaciona o tankBot
      if ((tankBot.position.z > tankPlayer.position.z) && (tankBot.position.x > tankPlayer.position.x)) {
        tankBot.rotateY(THREE.MathUtils.degToRad(-2));
      } else {
        tankBot.rotateY(THREE.MathUtils.degToRad(2));
      }
    }
  }

}

export function botComp(tankBot, tankPlayer, walls) {
  const raycasterWalls = new THREE.Raycaster();
  const raycasterPlayer = new THREE.Raycaster();
  const numRays = 10;
  const coneAngle = THREE.MathUtils.degToRad(45);
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
  let playerDetected = false;

  // Checar colisões com paredes (cone com alcance menor)
  for (let direction of directions) {
    raycasterWalls.set(tankBot.position, direction);
    raycasterWalls.far = 35; // Alcance para detectar paredes

    const wallIntersects = raycasterWalls.intersectObjects(walls, true);
    if (wallIntersects.length > 0) {
      wallDetected = true;
      break; // Pare a verificação assim que encontrar uma parede
    }
  }

  // Checar detecção do tankPlayer (cone com alcance maior)
  for (let direction of directions) {
    raycasterPlayer.set(tankBot.position, direction);
    raycasterPlayer.far = 100; // Alcance maior para detectar o tankPlayer

    const playerIntersects = raycasterPlayer.intersectObject(tankPlayer, true);
    if (playerIntersects.length > 0) {
      playerDetected = true;
      break; // Pare a verificação assim que encontrar o tankPlayer
    }
  }

  // Comportamento do tankBot
  if (wallDetected) {
    // Se houver uma interseção, rotaciona o tankBot
    if ((tankBot.position.x > tankPlayer.position.x)) {
      if ((tankBot.position.z > tankPlayer.position.z))
        tankBot.rotateY(THREE.MathUtils.degToRad(-4));
      else
        tankBot.rotateY(THREE.MathUtils.degToRad(4));

    } else {
      if ((tankBot.position.z > tankPlayer.position.z))
        tankBot.rotateY(THREE.MathUtils.degToRad(4));
      else
        tankBot.rotateY(THREE.MathUtils.degToRad(-4));

    }
  } else if (playerDetected) {
    // Se o player foi detectado, reaja de acordo (por exemplo, rotacionar para longe do player)
    const toPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();
    const botDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(tankBot.quaternion);

    const angleToPlayer = botDirection.angleTo(toPlayer) > 0 ? -2 : 2; // Rotacionar para se afastar do player
    tankBot.rotateY(THREE.MathUtils.degToRad(angleToPlayer));
  }
}




export function botShoot(tankBot, tankPlayer, scene) {
  const raycasterPlayer = new THREE.Raycaster();
  const interval = 3000; // 3 segundos
  let shooting = false; // Controle de disparo

  function detectAndShoot() {
    // Calcule a direção do tankBot para o tankPlayer
    const directionToPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();

    // Configurar o raycaster para verificar a detecção do tankPlayer
    raycasterPlayer.set(tankBot.position, directionToPlayer);
    raycasterPlayer.far = 100; // Alcance do raycaster para detectar o tankPlayer

    const playerDetected = raycasterPlayer.intersectObject(tankPlayer, true).length > 0;

    if (playerDetected && !shooting) {
      // Se o tankPlayer for detectado e o tankBot ainda não tiver atirado
      shoot(tankBot, scene);
      shooting = true; // Marca que o disparo ocorreu
      if (shooting) {
        // Espera 3 segundos antes de permitir outro disparo
        setTimeout(() => {
          shooting = false; // Permite que o tankBot atire novamente
        }, interval);
      }
    }
  }

  // Verifica a detecção de tempos em tempos, mas o disparo só ocorrerá uma vez a cada 3 segundos
  setInterval(detectAndShoot, 3000);
}






let lastShotTime = 0; // Tempo do último disparo

export function botShootOG(tankBot, tankPlayer, scene) {
    
  const currentTime = Date.now(); // Tempo atual em milissegundos
  const timeSinceLastShot = currentTime - lastShotTime; // Tempo desde o último disparo
  const raycasterPlayer = new THREE.Raycaster();

    // Calcule a direção do tankBot para o tankPlayer
    const directionToPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();

    // Configurar o raycaster para verificar a detecção do tankPlayer
    raycasterPlayer.set(tankBot.position, directionToPlayer);
    raycasterPlayer.far = 500; // Alcance do raycaster para detectar o tankPlayer

    const playerDetected = raycasterPlayer.intersectObject(tankPlayer, true).length > 0;

    if(playerDetected&&tankBot.position.distanceTo(tankPlayer.position)<100) {
      // Se o tankPlayer for detectado, o tankBot atira
      if (timeSinceLastShot >= 3000) { // Se já se passaram 3 segundos ou mais

        shoot(tankBot, scene); // Chama a função de disparo
        lastShotTime = currentTime; // Atualiza o tempo do último disparo
      }
    }

}



export function botShootOG2(tankBot, tankPlayer, scene) {
    
  const currentTime = Date.now(); // Tempo atual em milissegundos
  const timeSinceLastShot = currentTime - lastShotTime; // Tempo desde o último disparo
  const raycasterPlayer = new THREE.Raycaster();

    // Calcule a direção do tankBot para o tankPlayer
    const directionToPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();

    // Configurar o raycaster para verificar a detecção do tankPlayer
    raycasterPlayer.set(tankBot.position, directionToPlayer);
    raycasterPlayer.far = 500; // Alcance do raycaster para detectar o tankPlayer

    const playerDetected = raycasterPlayer.intersectObject(tankPlayer, true).length > 0;
    if (playerDetected && tankBot.position.distanceTo(tankPlayer.position) < 100) {
      // Se o tankPlayer for detectado e estiver dentro da distância, o tankBot atira
      if (timeSinceLastShot >= 3000) { // Se já se passaram 3 segundos ou mais
        shoot(tankBot, scene); // Chama a função de disparo
        lastShotTime = currentTime; // Atualiza o tempo do último disparo
      }
  
      // Agora, o tankBot deve rotacionar até que o ângulo entre ele e o tankPlayer seja 0
      const botDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(tankBot.quaternion); // Direção atual do tankBot
      const angleToPlayer = botDirection.angleTo(directionToPlayer); // Ângulo entre o tankBot e o tankPlayer
  
      // Verifique se o ângulo é maior que uma pequena margem (para evitar imprecisões)
      if (Math.abs(angleToPlayer) > THREE.MathUtils.degToRad(5)) { // Convertemos para radianos uma pequena margem (1 grau)
        const rotationDirection = botDirection.cross(directionToPlayer).y > 0 ? 1 : -1; // Determina a direção de rotação
        tankBot.rotateY(THREE.MathUtils.degToRad(2) * rotationDirection); // Rotaciona o tankBot gradualmente
      }
    }

}










export function botShoot(tankBot, tankPlayer, scene) {
  const currentTime = Date.now(); // Tempo atual em milissegundos
  const timeSinceLastShot = currentTime - lastShotTime; // Tempo desde o último disparo
  const raycasterPlayer = new THREE.Raycaster();

  // Calcule a direção do tankBot para o tankPlayer
  const directionToPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();

  // Configurar o raycaster para verificar a detecção do tankPlayer
  raycasterPlayer.set(tankBot.position, directionToPlayer);
  raycasterPlayer.far = 500; // Alcance do raycaster para detectar o tankPlayer

  const playerDetected = raycasterPlayer.intersectObject(tankPlayer, true).length > 0;

  // Verifica se o tankPlayer está perto o suficiente e detectado
  if (playerDetected && tankBot.position.distanceTo(tankPlayer.position) < 100) {
    
    // Vetor de frente do tankBot
    const botDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(tankBot.quaternion).normalize();

    // Ângulo entre a direção do tankBot e a direção para o tankPlayer
    const angleToPlayer = botDirection.angleTo(directionToPlayer);

    // Interpolação suave da rotação do tankBot para o tankPlayer
    const rotationSpeed = 0.05; // Ajusta a velocidade de rotação do tankBot
    if (angleToPlayer > 0.01) { // Se o ângulo for maior que um pequeno valor, continue rotacionando
      const step = botDirection.lerp(directionToPlayer, rotationSpeed).normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(botDirection, step);

      // Aplicar a nova rotação ao tankBot
      tankBot.quaternion.slerp(targetQuaternion, rotationSpeed);
    }
      // Se o tankBot estiver alinhado com o tankPlayer, verificar o disparo
      if (timeSinceLastShot >= 3000) { // Se já se passaram 3 segundos ou mais
        shoot(tankBot, scene); // Chama a função de disparo
        lastShotTime = currentTime; // Atualiza o tempo do último disparo
      }
    
  }
}