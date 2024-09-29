import * as THREE from 'three';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { createArena, createFloor, levelcheck, updateMovingWalls,wallBoxes } from './level1.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { initRenderer, setDefaultMaterial, initDefaultBasicLight } from "../libs/util/util.js";
import { keyboard, keyboardUpdate, isOrbitControlsActive, initialCameraPosition, godMode } from './keyboard.js';
import { t1_hits, update, updateHealthBar,shoot } from './shooting.js';
import { tank1, tank2, tank3 } from './tank.js';
import { resetl } from './reset.js';
import { updateBots } from './bot.js';
import { checkComplete } from './collisions.js';

function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    // Verifica se o userAgent contém informações comuns de dispositivos móveis
    if (/android/i.test(userAgent)) {
      return true;
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return true;
    }
  
    return false;
  }
  
  // Uso
    if (isMobile()==true) {
        // Adicionando o joystick
        console.log("Dispositivo mobile detectado");
        const joystick = nipplejs.create({
          zone: document.getElementById('joystickZone'),
          mode: 'static',
          position: { left: '300px', bottom: '50px' },  // Posição do joystick
          color: 'blue',
          size: 150
        });
      
        joystick.on('move', function (evt, data) {
          if (data.direction) {
            const angle = data.direction.angle;
            console.log("Direção:", angle);
            
            // Simula pressionamento de teclas baseado no ângulo do joystick
            switch (angle) {
              case 'up':
                if(selectedLevel === 1){
                    tank1.translateZ(-0.7); }
                else if (selectedLevel === 2){
                    tank1.translateZ(-1.05); }
                else if (selectedLevel === 3){
                    tank1.translateZ(-1.4);} // Simula pressionar a tecla W
                break;
              case 'down':
                if(selectedLevel === 1){
                   tank1.translateZ(0.7);
                    }
                    else if (selectedLevel === 2){
                    tank1.translateZ(1.05);  
                    }
                    else if (selectedLevel === 3){
                      tank1.translateZ(1.4); 
                        } // Simula pressionar a tecla S
                break;
              case 'left':
                tank1.rotateY(THREE.MathUtils.degToRad(5));
                break;
              case 'right':
                tank1.rotateY(THREE.MathUtils.degToRad(-5));
                break;
            }
          }
        });

        document.addEventListener('DOMContentLoaded', function () {
            // Função para detectar o toque no botão de tiro
            const shootButton = document.getElementById('shootButton');
            
        
            // Evento de 'touchstart' para dispositivos móveis
            shootButton.addEventListener('touchstart', function () {
                console.log("Disparou com touch!");
                shoot(tank1,scene,wallBoxes); // Função para o tank atirar
            });
        
            // Fallback para dispositivos desktop
            shootButton.addEventListener('click', function () {
                console.log("Disparou com click!");
                shoot(tank1,scene,wallBoxes); // Função para o tank atirar
            });
        });
  }else {
    // Oculta o botão de tiro em dispositivos que não são móveis
    document.getElementById('shootButton').style.display = 'none';
}


let scene, renderer, camera, material, orbit, light; // Initial variables
let ambientLight, directionalLight;

const clock = new THREE.Clock();
let zoomDistance = 300; // Initial distance from the tank
const maxZoom = 400;
const minZoom = 100;
const tiltAngle = THREE.MathUtils.degToRad(50);

// Retrieve the selected level from localStorage or default to level 1
let selectedLevel = localStorage.getItem('selectedLevel') ? parseInt(localStorage.getItem('selectedLevel'), 10) : 1;

function loadSkybox(scene) {
    const loader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    // Load the GLB skybox model
    loader.load('./skybox/source/skybox.glb', function (gltf) {
        const skybox = gltf.scene;

        // Load the texture for the skybox
        const skyboxTexture = textureLoader.load('./skybox/textures/skybox.png', function (texture) {
            // Apply the texture to the skybox (assuming it uses a MeshStandardMaterial or MeshBasicMaterial)
            skybox.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture; // Apply the texture to the mesh
                    child.material.needsUpdate = true;
                }
            });
        });

        // Scale the skybox and add it to the scene
        skybox.scale.set(500, 500, 500); // Adjust the scale as necessary
        scene.add(skybox);
    },
    // On error callback
    undefined,
    function (error) {
        console.error('An error occurred loading the skybox:', error);
    });
}

// Function to initialize the scene
function init(level) {
    selectedLevel = level;
    scene = new THREE.Scene();    // Create main scene
    renderer = initRenderer();    // Init a basic renderer
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // Init camera in this position
    material = setDefaultMaterial(); // create a basic material
    orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

    loadSkybox(scene);

    // Add lights based on the selected level
    if (level === 1 || level === 3) {
        // Basic light for level 1
        light = initDefaultBasicLight(scene);
    } else if (level === 2) {
        // Ambient and directional lights for level 2 with almost no brightness
        ambientLight = new THREE.AmbientLight(0x404040, 0.1); // Dim ambient light
        scene.add(ambientLight);

        directionalLight = new THREE.DirectionalLight(0xffffff, 0.1); // Dim directional light
        directionalLight.position.set(0, 200, 100);
        directionalLight.shadow.mapSize.width = 1024; 
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        scene.add(directionalLight);
    }

    // Listen for window size changes
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    createArena(200, scene, level);
    createFloor(200, scene, level);

    createHealthBars();

    if (level === 1) {
        tank3.clear();
    }

    render();
}

// Function to adjust the camera view
function adjustCameraView(tank1, camera) {
    const tankPosition = tank1.position.clone();

    const cameraOffset = new THREE.Vector3(0, zoomDistance * Math.sin(tiltAngle), zoomDistance * Math.cos(tiltAngle));

    camera.position.copy(tankPosition).add(cameraOffset);
    
    camera.lookAt(tankPosition);
}

function handleZoom(event) {
    if (event.deltaY < 0) {
        zoomDistance = Math.max(minZoom, zoomDistance - 10);
    } else if (event.deltaY > 0) {
        zoomDistance = Math.min(maxZoom, zoomDistance + 10);
    }
}


window.addEventListener('wheel', handleZoom);

// Function to render the scene
function render() {
    requestAnimationFrame(render);

    const deltaTime = clock.getDelta();

    keyboardUpdate();
    update(tank1, tank2, scene);
    updateBots();

    if(checkTankPassage(tank1)){
        if(selectedLevel===1){resetLevel(2);}
        else if(selectedLevel===2){resetLevel(3);}
        
    }

    updateMovingWalls(deltaTime);

    updateHealthBarAppearance();

    if (!isOrbitControlsActive) {
        adjustCameraView(tank1, camera);
    } else {
        initialCameraPosition.copy(camera.position);
    }

    renderer.render(scene, camera); // Render scene
}

// Function to create health bars
function createHealthBars() {
    function createHealthBar(id, left, bottom, identifier) {
        const healthBarContainer = document.createElement('div');
        healthBarContainer.id = `${id}-container`;
        healthBarContainer.style.position = 'absolute';
        healthBarContainer.style.bottom = `${bottom}px`;
        healthBarContainer.style.left = `${left}px`;
        healthBarContainer.style.width = '100px';
        healthBarContainer.style.height = '20px';
        healthBarContainer.style.border = '1px solid #ffffff';
        healthBarContainer.style.backgroundColor = '#ff0000';

        const healthBar = document.createElement('div');
        healthBar.id = id;
        healthBar.style.width = '100%';
        healthBar.style.height = '100%';
        healthBar.style.backgroundColor = '#00ff00';

        const identifierText = document.createElement('span');
        identifierText.innerText = identifier;
        identifierText.style.position = 'absolute';
        identifierText.style.width = '100%';
        identifierText.style.textAlign = 'center';
        identifierText.style.color = '#000000';

        healthBar.appendChild(identifierText);
        healthBarContainer.appendChild(healthBar);
        document.body.appendChild(healthBarContainer);
    }

    createHealthBar('t1-health', 10, 10, 'Tank 1');
    createHealthBar('t2-health', window.innerWidth - 120, 40, 'Tank 2');
    if (selectedLevel === 2 || selectedLevel === 3) {
        createHealthBar('t3-health', window.innerWidth - 120, 70, 'Tank 3');
    }
    if (selectedLevel === 3){
        createHealthBar('t4-health', window.innerWidth - 120, 100, 'Tank 4');
    }
}

// Function to update health bar appearance based on godMode
function updateHealthBarAppearance() {
    const healthBar = document.getElementById('t1-health');

    if (godMode) {
        let aux = 0;
        updateHealthBar('t1', aux);
        healthBar.style.background = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
        healthBar.style.backgroundSize = '150% 100%'; // Gradient stretched across double the width
        healthBar.style.animation = 'rainbow-wave 4s infinite linear'; // Slower and smoother wave
    } else {
        updateHealthBar('t1', t1_hits);
        healthBar.style.background = '#00ff00'; // Restore to normal green health bar
        healthBar.style.animation = ''; // Remove animation
    }
}

export function checkTankPassage(tank) {
    // Create a bounding box for the tank
    const tankBox = new THREE.Box3().setFromObject(tank);

    // Check for level transition
    for (let i = 0; i < levelcheck.length; i++) {
        if (tankBox.intersectsBox(levelcheck[i])) {
            return true; // Return true if level transition is detected
        }
    }
}

// CSS for rainbow wave effect
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow-wave {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 0%; }
  }
  #t1-health {
    background-size: 150% 100%;
  }
`;
document.head.appendChild(style);

function onButtonPressed() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    loadingScreen.addEventListener('transitionend', (e) => {
        const element = e.target;
        element.remove();  
    });

    // Call the init function and pass the level (you can get level dynamically)
    init(selectedLevel);
}

// Funçao reset de level.
function resetLevel(level) {
    if(level===1){
        selectedLevel=1;
    }
    if(level===2){
        selectedLevel=2;
    }
    if(level===3){
        selectedLevel=3;
    }
    
    resetl(); // Reset game state
}

//ANIMAÇAO DOS POWERUP
export function rotateObject(object) {
    // Função de animação
    function animateRotation() {
      requestAnimationFrame(animateRotation);
  
      // Aplica a rotação nos eixos X, Y e Z
      object.rotation.x+=0.1;  
      object.rotation.y +=0.1;
  
      renderer.render(scene, camera);
    }
  
    // Inicia a animação de rotação
    animateRotation();
  }

// Automatically start the game at the selected level
document.getElementById('myBtn').addEventListener('click', onButtonPressed);

export { scene, selectedLevel, resetLevel }; // Export the scene, selectedLevel, and resetLevel function
