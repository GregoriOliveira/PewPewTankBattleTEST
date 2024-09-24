// Importar Three.js (Assumindo que você já tem Three.js incluído no seu projeto)
import * as THREE from 'three';

// Configurar cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criar geometria e material para o tanque
const tankGeometry = new THREE.BoxGeometry(1, 1, 2);
const tankMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const tank = new THREE.Mesh(tankGeometry, tankMaterial);
scene.add(tank);

// Criar geometria e material para as paredes
const wallGeometry = new THREE.BoxGeometry(1, 5, 10);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 0, -5);
scene.add(wall1);

const wall2 = wall1.clone();
wall2.position.set(0, 0, 5);
scene.add(wall2);

const wall3 = wall1.clone();
wall3.rotation.y = Math.PI / 2;
wall3.position.set(-5, 0, 0);
scene.add(wall3);

const wall4 = wall3.clone();
wall4.position.set(5, 0, 0);
scene.add(wall4);

// Criar geometria e material para o alvo
const targetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const targetMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const target = new THREE.Mesh(targetGeometry, targetMaterial);
target.position.set(4, 0, 4);
scene.add(target);

// Posicionar a câmera
camera.position.z = 10;

// Configurar o raycaster para detectar colisões
const raycaster = new THREE.Raycaster();
const rayDirection = new THREE.Vector3();

// Configurar a velocidade do tanque
const tankSpeed = 0.05;

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Calcular direção para o alvo
    const directionToTarget = new THREE.Vector3();
    directionToTarget.subVectors(target.position, tank.position).normalize();

    // Emitir raio na direção do movimento
    rayDirection.copy(directionToTarget);
    raycaster.set(tank.position, rayDirection);

    // Detectar interseções com as paredes
    const intersects = raycaster.intersectObjects([wall1, wall2, wall3, wall4]);

    // Se houver uma colisão, mudar a direção
    if (intersects.length > 0 && intersects[0].distance < 1) {
        // Calcular nova direção ao colidir
        directionToTarget.x += Math.random() * 0.1 - 0.05; // Pequena variação aleatória para evitar travamentos
        directionToTarget.z += Math.random() * 0.1 - 0.05;
        directionToTarget.normalize();
    }

    // Mover o tanque na direção calculada
    tank.position.addScaledVector(directionToTarget, tankSpeed);

    // Renderizar a cena
    renderer.render(scene, camera);
}

animate();






/*export function detectObstacle(tankBot, obstacles) {
    // Cria um raycaster para detectar obstáculos
    const raycaster = new THREE.Raycaster();
    
    // Emitir raios em várias direções para melhor detecção
    const directions = [
        new THREE.Vector3(1, 0, 0),   // Frente
        new THREE.Vector3(-1, 0, 0),  // Trás
        new THREE.Vector3(0, 0, 1),   // Direita
        new THREE.Vector3(0, 0, -1),  // Esquerda
    ];

    for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        raycaster.set(tankBot.position, direction);

        // Verifica interseção com obstáculos
        const intersects = raycaster.intersectObjects(obstacles, true);

        if (intersects.length > 0 && intersects[0].distance < 2) { // Ajuste a distância de segurança
            const avoidDirection = new THREE.Vector3().addVectors(tankBot.position, direction.negate()).normalize();
            return avoidDirection;
        }
    }
    return null;
}


export function decideDirection(tankBot, tankPlayer, obstacles) {
    const safeDistance = 65;
    const distance = tankPlayer.position.distanceTo(tankBot.position);

    const avoidDirection = detectObstacle(tankBot, obstacles);

    if (avoidDirection) {
        // Se houver obstáculo, retorna direção para evitar
        return avoidDirection;
    }

    // Decide direção com base na distância
    if (distance < safeDistance) {
        return new THREE.Vector3().subVectors(tankBot.position, tankPlayer.position).normalize(); // Fugir do jogador
    } else {
        return new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize(); // Aproximar-se do jogador
    }
}*/
function handleObstacle(tankBot,obstacles){
    const raycaster = new THREE.Raycaster();
    const directions = [
      new THREE.Vector3(1, 0, 0),   // Frente
      new THREE.Vector3(-1, 0, 0),  // Trás
      new THREE.Vector3(0, 0, 1),   // Direita
      new THREE.Vector3(0, 0, -1),  // Esquerda
    ];
    for(i=0;i<directions.length;i++){
      raycaster.set(tankBot.position,directions[i]);

      const intersects = raycaster.intersectObjects(obstacles,true);
      if(intersects.length>0,intersects[0].distance<65){
        const dir = new THREE.Vector3().subVectors(tankPlayer.position, tankBot.position).normalize();
        return dir;
      }
      return null;
    }
}