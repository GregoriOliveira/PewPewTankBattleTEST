import * as THREE from "three";
import { tank1, tank2, tank3, tank3BB, tank4, tank4BB } from './tank.js';
import { cannon } from "./cannon.js";
import { t1_hits, t2_hits, t3_hits } from "./shooting.js";
import { selectedLevel } from "./main.js";
import { applyPowerUpEffect } from "./shooting.js";

const textureLoader = new THREE.TextureLoader();
let m;
const wallTextureLevel1 = textureLoader.load('./textures/m-006.jpg'); // Texture for level 1 walls
const wallTextureLevel2 = textureLoader.load('./textures/m-008.jpg'); // Texture for level 2 walls
const floorTextureLevel1 = textureLoader.load('./textures/m-013.jpg'); // Texture for level 1 floor
const floorTextureLevel2 = textureLoader.load('./textures/m-014.jpg'); // Texture for level 2 floor
const wallTextureLevel3 = textureLoader.load('./textures/m-003.jpg'); // Texture for level 3 walls
const floorTextureLevel3 = textureLoader.load('./textures/m-015.jpg'); // Texture for level 3 floor
const passageFloorTexture = textureLoader.load('./textures/m-013-015-bg.jpg');
const passageWallTexture = textureLoader.load('./textures/m-009.jpg');

let wallMaterialLevel1 = new THREE.MeshLambertMaterial({ map: wallTextureLevel1 });
let wallMaterialLevel2 = new THREE.MeshLambertMaterial({ map: wallTextureLevel2 });
let floorMaterialLevel1 = new THREE.MeshLambertMaterial({ map: floorTextureLevel1 });
let floorMaterialLevel2 = new THREE.MeshLambertMaterial({ map: floorTextureLevel2 });
let wallMaterialLevel3 = new THREE.MeshLambertMaterial({ map: wallTextureLevel3 });
let floorMaterialLevel3 = new THREE.MeshLambertMaterial({ map: floorTextureLevel3 });
let passageFloorMaterial = new THREE.MeshLambertMaterial({ map: passageFloorTexture });
let passageWallMaterial = new THREE.MeshLambertMaterial({ map: passageWallTexture });

const doorTexture = textureLoader.load('./textures/m-002.jpg'); // Door texture
let doorMaterial = new THREE.MeshLambertMaterial({ map: doorTexture });


const wallBoxes = [];
const walls = [];
const doorBoxes = [];
const doors = [];
const door1Boxes = [];
const doors1 = [];
export const targets = [];
const movingWalls = [];
const movingWallBoxes = [];
const levelcheck = [];
const targetObject = new THREE.Object3D();
targetObject.position.set(39, 0, -8);

//POWER UP
let powerUpActive = false;
let powerUpTimeout;
let powerUpPositions = []; // Armazena as posições válidas para os power-ups

// Define the matrix
let matrix = [
    'w w w w w w w w w w w w w w w w w e1 e1 e1 e1',
    'w e e e e e e e w e e e e e e e w e1 e1 e1 e1',
    'w e e e e e e e w e e e e e e e w wp wp wp wp',
    'w e e e e e e e w e e e e e e e d e1 e1 BB d1',
    'w e e e e e e e e e e e e e e e d e1 e1 BB d1',
    'w e e e e e e e e e e e e e e e d e1 e1 BB d1',
    'w e e e e e e e e e e e e e e e d e1 e1 BB d1',
    'w e e e e e e e e e e e e e e e d e1 e1 BB d1',
    'w e e e e e e e w e e e e e e e w wp wp wp wp',
    'w e t1 e e e e e w e e e e e t2 e w e1 e1 e1 e1',
    'w e e e e e e e w e e e e e e e w e1 e1 e1 e1',
    'w w w w w w w w w w w w w w w w w e1 e1 e1 e1'
];

let matrix1 = [
    'ws w w w w w w w w ws w w w w w w w w w e1 e1 e1 e1',
    'w e e e w e e e e s2 e e e e e e e e w e1 e1 e1 e1',
    'w e t1 e w e e e e e e e e e e e t3 e w e1 e1 e1 e1',
    'w e e s1 w e e e e e e e e e e e e e w wp wp wp wp',
    'd1 e e e w e e e e e e e e e e e e e d e1 e1 BB d1',
    'd1 e e e e e e e w1 w1 w1 e e e e e e e d e1 e1 BB d1',
    'd1 e e e e e e e w1 c w1 e e e e e e e d e1 e1 BB d1',
    'd1 e e e e e e e w1 w1 w1 e e e e e e e d e1 e1 BB d1',
    'd1 e e e e e e e e e e e e e w e e e d e1 e1 BB d1',
    'w e e e e e e e e e e e e e w s4 e e w wp wp wp wp',
    'w e e e e e e e e e e e e e w e t2 e w e1 e1 e1 e1',
    'w e e e e e e e e s3 e e e e w e e e w e1 e1 e1 e1',
    'w w w w w w w w w ws w w w w w w w w ws e1 e1 e1 e1'
];

let matrix2 = [
    'w w w w w w w w w w w w w w w w w w w w w w',
    'w e e e e e w e e e e w e e e e w e e e e w',
    'w e e e e e w e e t2 e w e e e e w e e t4 e w',
    'w e e e e e w e e e e w e e e e w e e e e w',
    'w e e e e e mw e e e e mw e e e e mw e e e e w',
    'd e e e e e mw e e e e mw e e e e mw e e e e w',
    'd e e e e e mw e e e e mw e e e e mw e e e e w',
    'd e t1 e e e e e e e e e e e e e e e e e e w',
    'd e e e e e e e e e e e e e e e e e e e e w',
    'd e e e e e e e e e e e e e e e e e e e e w',
    'w e e e e e e e e e e e e e e e e e e e e w',
    'w e e e e e w e e e e w e e e e w e e e e w',
    'w e e e e e w e e e e w e e t3 e w e e e e w',
    'w e e e e e w e e e e w e e e e w e e e e w',
    'w w w w w w w w w w w w w w w w w w w w w w'
];

let matrix3 = [
    'w w w w w',
    'd e e e d',
    'd e e e d',
    'd e e e d',
    'd e e e d',
    'd e e e d',
    'w w w w w'
]

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
    cylinder.rotation.x = (Math.PI / 3)
    spotlightModel.add(cylinder);

    return spotlightModel;
}

// Update the position of moving walls
export function updateMovingWalls(deltaTime) {
    movingWalls.forEach((wall) => {
        const speed = 10; // Speed of movement (adjust as needed)
        const maxRange = wall.userData.range;
        const direction = wall.userData.direction;

        // Update the position based on direction and speed
        wall.position.z += direction * speed * deltaTime;

        // Reverse direction if the wall reaches the end of its range
        if (wall.position.z > wall.userData.initialPosition.z + maxRange || wall.position.z < wall.userData.initialPosition.z + 1) {
            wall.userData.direction *= -1; // Change direction
        }

        // Update the bounding box after movement
        const wallBox = new THREE.Box3().setFromObject(wall);
        wallBoxes[movingWalls.indexOf(wall)] = wallBox;
    });
}

for (let i = 0; i < matrix1.length; i++) {
    let row = matrix1[i].split(' ');
    for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        if (cell === 's1') {
            let target = new THREE.Object3D();
            target.position.set(-70, 0, -70);
            targets[3] = target;
        } else if (cell === 's2') {
            let target = new THREE.Object3D();
            target.position.set(39, 0, -65);
            targets[2] = target;
        } else if (cell === 's3') {
            let target = new THREE.Object3D();
            target.position.set(39, 0, 50);
            targets[1] = target;
        } else if (cell === 's4') {
            let target = new THREE.Object3D();
            target.position.set(150, 0, 50);
            targets[0] = target;
        }
    }
}

// Create the arena and the tanks
function createArena(size, scene, level) {
    if (level === 1) {
        m = matrix;
        
    } else if (level === 2) {
        m = matrix1;
        
    } else if (level === 3) {
        m = matrix2;
        
    }

    const cubeSize = size / m.length;
    const halfSize = size / 2;

    for (let i = 0; i < m.length; i++) {
        let row = m[i].split(' ');
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];

            if (cell === 'w') {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let material;
                if (level === 3) {
                    material = wallMaterialLevel3; // Use level 3 wall texture
                } else if (level === 2) {
                    material = wallMaterialLevel2;
                } else {
                    material = wallMaterialLevel1;
                }
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const wallBox = new THREE.Box3().setFromObject(cube);
                wallBoxes.push(wallBox);
                walls.push(cube);
            } else if (cell === 'd') {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let material = doorMaterial;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const doorBox = new THREE.Box3().setFromObject(cube);
                doorBoxes.push(doorBox);
                doors.push(cube);
            } else if (cell === 'd1') {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let material = doorMaterial;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const doorBox = new THREE.Box3().setFromObject(cube);
                door1Boxes.push(doorBox);
                doors1.push(cube);
            } else if (cell === 'wp') {
            let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            let material = passageWallMaterial;
            let cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
            cube.castShadow = true;
            scene.add(cube);

            const wallBox = new THREE.Box3().setFromObject(cube);
            wallBoxes.push(wallBox);
            walls.push(cube);
        }   else if (cell === 'BB') {
            // Create the bounding box for level transition without adding a visible mesh
            let bbPosition = new THREE.Vector3(j * cubeSize - halfSize, 0, i * cubeSize - halfSize);
            let bbBox = new THREE.Box3(
                new THREE.Vector3(bbPosition.x - cubeSize / 2, bbPosition.y, bbPosition.z - cubeSize / 2),
                new THREE.Vector3(bbPosition.x + cubeSize / 2, bbPosition.y + cubeSize, bbPosition.z + cubeSize / 2)
            );
            
            levelcheck.push(bbBox);

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
            } else if (cell === 't3') {
                tank3.castShadow = true
                tank3.position.set(j * cubeSize - halfSize, -2.8, i * cubeSize - halfSize);
                tank3.rotateY(THREE.MathUtils.degToRad(90));
                scene.add(tank3);
            } else if (cell === 't4') {
                tank4.castShadow = true;
                tank4.position.set(j * cubeSize - halfSize, -2.8, i * cubeSize - halfSize); ''
                tank4.rotateY(THREE.MathUtils.degToRad(90));
                scene.add(tank4);
            } else if (cell === 'mw') {
                let movingWallGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let movingWallMaterial = new THREE.MeshLambertMaterial({ map: textureLoader.load('./textures/m-001.jpg') });
                let movingWall = new THREE.Mesh(movingWallGeometry, movingWallMaterial);
                movingWall.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                movingWall.castShadow = true;
                scene.add(movingWall);

                // Store the initial position and movement range
                movingWall.userData = {
                    initialPosition: movingWall.position.clone(),
                    direction: -1, // 1 for forward, -1 for backward
                    range: 52 // Range of movement (adjust as needed)
                };

                movingWalls.push(movingWall); // Add to the movingWalls array

                const movingWallBox = new THREE.Box3().setFromObject(movingWall);
                movingWallBoxes.push(movingWallBox);
            } else if (cell === 'w1') {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize / 10, cubeSize);
                let material = (level === 2) ? wallMaterialLevel2 : wallMaterialLevel1;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 20, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const wallBox = new THREE.Box3().setFromObject(cube);
                wallBoxes.push(wallBox);
                walls.push(cube);
            } else if (cell === "ws") {
                let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                let material = (level === 2) ? wallMaterialLevel2 : wallMaterialLevel1;
                let cube = new THREE.Mesh(cubeGeometry, material);
                cube.position.set(j * cubeSize - halfSize, cubeSize / 2, i * cubeSize - halfSize);
                cube.castShadow = true;
                scene.add(cube);

                const wallBox = new THREE.Box3().setFromObject(cube);
                wallBoxes.push(wallBox);
                walls.push(cube);

                // Add the spotlight model
                let spotlightModel = createSpotlightModel();
                if (p === 0) {
                    spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize);
                    spotlightModel.rotateY(THREE.MathUtils.degToRad(-140));
                }
                if (p === 1) {
                    spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize);
                    spotlightModel.rotateY(THREE.MathUtils.degToRad(180));
                }
                if (p === 2) {
                    spotlightModel.position.set(j * cubeSize - halfSize, cubeSize, i * cubeSize - halfSize);
                }
                if (p === 3) {
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

    // Clean up for level 1 to ensure no unintended objects from level 2 are left
    if (level === 1) {
        tank3.clear();
        scene.remove(tank3BB);
    }
    if (level === 1 || level === 2) {
        tank4.clear();
        scene.remove(tank4BB);
        startPowerUps(scene,level,size); //PW
    }
    else if(level===3){
        startPowerUps(scene,level,size); //PW
    }
}

function createFloor(size, scene, level) {
    let floorGeometry, passageGeometry;
    if (level === 1) {
        m = matrix;
    } else if (level === 2) {
        m = matrix1;
    } else if (level === 3) {
        m = matrix2;
    }
    const floorSize = size / m.length;
    if (level === 1) {
        floorGeometry = new THREE.PlaneGeometry(floorSize * 17, floorSize * 12);
        passageGeometry = new THREE.PlaneGeometry(floorSize * 3, floorSize * 5);
    }
    else if (level === 2) {
        floorGeometry = new THREE.PlaneGeometry(floorSize * 18, floorSize * 12);
        passageGeometry = new THREE.PlaneGeometry(floorSize * 3, floorSize * 6);
    }
    else if (level === 3) {
        floorGeometry = new THREE.PlaneGeometry(floorSize * 22, floorSize * 14);
    }
    let material;
    if (level === 3) {
        material = floorMaterialLevel3;
    } else if (level === 2) {
        material = floorMaterialLevel2;
    } else {
        material = floorMaterialLevel1;
    }
    let floor = new THREE.Mesh(floorGeometry, material);
    let pfloor = new THREE.Mesh(passageGeometry, passageFloorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate the floor 90 degrees
    pfloor.rotation.x = -Math.PI / 2;
    if (level === 1) {
        floor.position.set(floorSize * 2, 0, -floorSize + 8.3);
        pfloor.position.set(floorSize * 12, 0, -floorSize * 1);
    }
    else if (level === 2) {
        floor.position.set(floorSize * 3, 0, -floorSize + 8.3);
        pfloor.position.set(floorSize * 13.5, 0, -floorSize * 1);
    }
    else if (level === 3) {
        floor.position.set(floorSize * 3, 0, -floorSize + 8.3);
    }
    floor.receiveShadow = true;
    pfloor.receiveShadow = true;
    scene.add(pfloor);
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
    let mtx;
    if(level===1){
        mtx = matrix;
    }
    else if(level===2){
        mtx = matrix1;
    }
    else if(level===3){
        mtx = matrix2;
    }
    setPowerUpPositions(mtx, size);
    spawnPowerUp(scene);  // Inicializa o primeiro spawn
}

// Função auxiliar para detectar a interação com o jogador (essa lógica pode ser substituída pela sua lógica de colisão)
export function detectPlayerInteraction(powerUp) {
    
    const playerPosition = tank1.position;  
    const distance = powerUp.position.distanceTo(playerPosition);
    return distance < 20;  // Distância de detecção (ajuste conforme necessário)
}


export { createArena, createFloor, wallBoxes, walls, doors, doorBoxes, movingWalls, movingWallBoxes, door1Boxes, doors1, levelcheck};
