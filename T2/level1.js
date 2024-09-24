import * as THREE from "three";
import { tank1, tank2, tank3, tank3BB } from './tank.js';
import { cannon } from "./cannon.js";
import { SphereGeometry } from "../build/three.module.js";
import { applyPowerUpEffect } from "./shooting.js";

// Define materials
let greyMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
let darkGreyMaterial = new THREE.MeshLambertMaterial({ color: 0x505050 });

// Define materials for level 2
let almostBlackMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
let offWhiteMaterial = new THREE.MeshLambertMaterial({ color: 0xf8f8ff });

let m;
const wallBoxes = [];
const walls = [];
const targets = [];
const targetObject = new THREE.Object3D();
targetObject.position.set(39, 0, -8);

//POWER UP
let powerUpActive = false;
let powerUpTimeout;
let powerUpPositions = []; // Armazena as posições válidas para os power-ups

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

let matrix1 = [
    'ws w w w w w w w w ws w w w w w w w w w',
    'w e e e w e e e e s2 e e e e e e e e w',
    'w e t1 e w e e e e e e e e e e e t3 e w',
    'w e e s1 w e e e e e e e e e e e e e w',
    'w e e e w e e e e e e e e e e e e e w',
    'w e e e e e e e w1 w1 w1 e e e e e e e w',
    'w e e e e e e e w1 c w1 e e e e e e e w',
    'w e e e e e e e w1 w1 w1 e e e e e e e w',
    'w e e e e e e e e e e e e e w e e e w',
    'w e e e e e e e e e e e e e w s4 e e w',
    'w e e e e e e e e e e e e e w e t2 e w',
    'w e e e e e e e e s3 e e e e w e e e w',
    'w w w w w w w w w ws w w w w w w w w ws'
];

let l = 3;
let p = 0;

// Function to create the spotlight model (cylinder on top of a cone)
function createSpotlightModel() {
    const spotlightModel = new THREE.Group();

    // Create the cone (bottom part of the spotlight)
    const coneGeometry = new THREE.ConeGeometry(5, 20, 32);
    const coneMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = 10; // Position the cone so the top is at the origin of the spotlight model
    spotlightModel.add(cone);

    // Create the cylinder (top part of the spotlight)
    const cylinderGeometry = new THREE.CylinderGeometry(7, 7, 10, 32);
    const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = 20; // Position the cylinder above the cone
    cylinder.rotation.x = (Math.PI/3)
    spotlightModel.add(cylinder);

    return spotlightModel;
}

for (let i = 0; i < matrix1.length; i++) {
    let row = matrix1[i].split(' ');
    for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        if(cell === 's1'){
        let target = new THREE.Object3D();
        target.position.set(-70,0,-70);
        targets[3] = target;
        } else if(cell === 's2'){
            let target = new THREE.Object3D();
            target.position.set(39,0,-65);
            targets[2] = target;
            } else if(cell === 's3'){
                let target = new THREE.Object3D();
                target.position.set(39,0,50);
                targets[1] = target;
                } else if(cell === 's4'){
                    let target = new THREE.Object3D();
                    target.position.set(150,0,50);
                    targets[0] = target;
                    }
    }
}

// Create the arena and the tanks
function createArena(size, scene, level) {
    m = (level === 1) ? matrix : matrix1;

    const cubeSize = size / m.length;
    const halfSize = size / 2;

    for (let i = 0; i < m.length; i++) {
        let row = m[i].split(' ');
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            if (cell === 'w') {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let material = (level === 2) ? almostBlackMaterial : darkGreyMaterial;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const wallBox = new THREE.Box3().setFromObject(cube);
                wallBoxes.push(wallBox);
                walls.push(cube);
            } else if (cell === 't1') {
                tank1.castShadow = true;
                tank1.position.set(j * cubeSize - halfSize, -2.8, i * cubeSize - halfSize);
                if (level === 2) {
                    tank1.rotateY(THREE.MathUtils.degToRad(180));
                }
                scene.add(tank1);
            } else if (cell === 't2') {
                tank2.castShadow = true;
                tank2.position.set(j * cubeSize - halfSize, -2.8, i * cubeSize - halfSize);
                scene.add(tank2);
            } else if (cell === 't3' && level === 2) {
                tank3.castShadow = true
                tank3.position.set(j * cubeSize - halfSize, -2.8, i * cubeSize - halfSize);
                tank3.rotateY(THREE.MathUtils.degToRad(90));
                scene.add(tank3);
            } else if (cell === 'w1') {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize / 10, cubeSize);
                let material = (level === 2) ? almostBlackMaterial : darkGreyMaterial;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 20, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const wallBox = new THREE.Box3().setFromObject(cube);
                wallBoxes.push(wallBox);
                walls.push(cube);
            } else if (cell === "ws") {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let material = (level === 2) ? almostBlackMaterial : darkGreyMaterial;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const wallBox = new THREE.Box3().setFromObject(cube);
                wallBoxes.push(wallBox);
                walls.push(cube);

                // Add the spotlight model
                let spotlightModel = createSpotlightModel();
                if(p === 0){
                spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize);
                spotlightModel.rotateY(THREE.MathUtils.degToRad(-140));
                }
                if(p === 1){
                    spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize);
                    spotlightModel.rotateY(THREE.MathUtils.degToRad(180));
                }
                    if(p === 2){
                        spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize); 
                        }
                        if(p === 3){
                            spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize);
                            spotlightModel.rotateY(THREE.MathUtils.degToRad(40));
                            }
                scene.add(spotlightModel);
                p++;

                // Create and add the spotlight
                let spotLight = new THREE.SpotLight(0xffffff, 2000);
                spotLight.position.set(j * cubeSize - halfSize, 40, i * cubeSize - halfSize); // Position the spotlight at the top of the light post
                spotLight.castShadow = true;
                spotLight.rotation.set(0, -2, 0);
                spotLight.angle = Math.PI / 6;
                spotLight.penumbra = 0.5;
                spotLight.decay = 2;
                scene.add(targets[l]);
                spotLight.target = targets[l];
                l--;
                scene.add(spotLight);

            } else if (cell === "c") {
                cannon.position.set(j * cubeSize - halfSize, 6, i * cubeSize - halfSize);
                scene.add(cannon);
            }
        }
    }

    if (level === 1) {
        startPowerUps(scene,level,size); //PW
        tank3.clear();
        scene.remove(tank3BB);
    }
   else if(level==2){
    startPowerUps(scene,level,size); // PW

    }
}

function createFloor(size, scene, level) {
    let floorGeometry;
    m = (level === 1) ? matrix : matrix1;
    const floorSize = size / m.length;
    if (level === 1) {
        floorGeometry = new THREE.PlaneGeometry(floorSize * 17, floorSize * 12);
    }
    else if (level === 2) {
        floorGeometry = new THREE.PlaneGeometry(floorSize * 18, floorSize * 12);
    }
    let material = (level === 2) ? offWhiteMaterial : greyMaterial;
    let floor = new THREE.Mesh(floorGeometry, material);
    floor.rotation.x = -Math.PI / 2; // Rotate the floor 90 degrees
    if (level === 1) {
        floor.position.set(floorSize * 2, 0, -floorSize + 8.3);
    }
    else if (level === 2) {
        floor.position.set(floorSize * 3, 0, -floorSize + 8.3);
    }
    floor.receiveShadow = true;
    scene.add(floor);
}

//POWER UP FUNCTIONS
// Função para definir as posições válidas de acordo com a matriz e o nível
function setPowerUpPositions(matrix,size) {
    powerUpPositions = [];  // Limpa as posições anteriores
    const sz = size;  // Defina o tamanho da arena conforme necessário
    const cubeSize = sz / matrix.length;
    const halfSize = sz / 2;

    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i].split(' ');
        for (let j = 0; j < row.length; j++) {
            if (row[j] === 'e') {  // 'e' indica uma célula válida para spawn
                const x = j * cubeSize - halfSize;
                const z = i * cubeSize - halfSize;
                powerUpPositions.push({ x, z });  // Adiciona a posição válida
            }
        }
    }
}

// Função para criar o power-up em formato de cápsula
function createCapsulePowerUp() {
    const capsuleGeometry = new THREE.CapsuleGeometry(3, 5, 8, 16);
    const capsuleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    capsule.position.y = 3;
    capsule.name = "capsulePowerUp";
    return capsule;
}

// Função para criar o power-up em formato de icosaedro
function createIcosahedronPowerUp() {
    const icosahedronGeometry = new THREE.IcosahedronGeometry(6, 0);
    const icosahedronMaterial = new THREE.MeshLambertMaterial({ color: 0xfff000 });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.position.y = 5;
    icosahedron.name = "icosahedronPowerUp";
    return icosahedron;
}

function spawnPowerUp(scene) {
    if (powerUpActive || powerUpPositions.length === 0) return;  // Impede que dois power-ups sejam spawnados ao mesmo tempo ou se não houver posições válidas

    powerUpActive = true;
    const powerUpType = Math.random() > 0.5 ? createCapsulePowerUp() : createIcosahedronPowerUp();

    // Escolhe uma posição aleatória das posições válidas
    const position = powerUpPositions[Math.floor(Math.random() * powerUpPositions.length)];
    powerUpType.position.set(position.x, 5, position.z);
    scene.add(powerUpType);

    // Adiciona detecção de interação com o jogador (substitua por sua lógica de detecção de colisão ou interação)
    const checkPlayerInteraction = setInterval(() => {
        if (detectPlayerInteraction(powerUpType)) {  // Suponha que essa função detecte interação
            applyPowerUpEffect(powerUpType);
            scene.remove(powerUpType);  // Remove o power-up ao ser coletado
            powerUpActive = false;

            clearInterval(checkPlayerInteraction);  // Para de checar interação

            // Próximo spawn após 10 segundos da coleta
            powerUpTimeout = setTimeout(() => spawnPowerUp(scene), 10000);
        }
    }, 100);  // Verifica a cada 100ms (ajuste conforme necessário)
}

// Iniciar a função de spawn de power-ups com base no nível
function startPowerUps(scene, level, size) {
    const mtx = (level === 1) ? matrix : matrix1;  // Escolhe a matriz baseada no nível
    setPowerUpPositions(mtx, size);
    spawnPowerUp(scene);  // Inicializa o primeiro spawn
}

// Função auxiliar para detectar a interação com o jogador (essa lógica pode ser substituída pela sua lógica de colisão)
export function detectPlayerInteraction(powerUp) {
    
    const playerPosition = tank1.position;  
    const distance = powerUp.position.distanceTo(playerPosition);
    return distance < 20;  // Distância de detecção (ajuste conforme necessário)
}


export { createArena, createFloor, wallBoxes, walls };
