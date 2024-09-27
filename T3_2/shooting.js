import * as THREE from 'three';
import { doorBoxes, doors, wallBoxes } from './level1.js';
import { tank1, tank1BB, tank2, tank2BB, tank3, tank3BB, tank4, tank4BB } from './tank.js';
import { resetLevel, scene, selectedLevel } from './main.js';
import { reset, resetl } from './reset.js';
import { cannonBB, cannon } from './cannon.js';
import { Vector3 } from '../build/three.module.js';
import { godMode } from './keyboard.js';
import { doorsMove } from './doors.js';
import { soundActive } from './keyboard.js';

let shots = []; // Array to hold all shots

export let t1_hits = 0;
export let t2_hits = 0;
export let t3_hits = 0;
export let t4_hits = 0;

//POWER UPS
let icosaedroActive = false; // Flag para efeito do icosaedro
const shotColor1 = new THREE.MeshLambertMaterial({color: 0xffffff});
const shotPWColor =new THREE.MeshLambertMaterial({ color:0xfff000}); 


export function capsulePW(tankPlayer){
    if(t1_hits>=2){
        t1_hits-=2;
    }
    else{
        t1_hits=0;
    }
}


export function updateHealthBar(tankId, hits) {
    const healthBar = document.getElementById(`${tankId}-health`);
    const healthPercentage = Math.max(0, (10 - hits) * 10);
    healthBar.style.width = `${healthPercentage}%`;

    if (healthPercentage > 50) {
        healthBar.style.backgroundColor = '#00ff00'; // Green
    } else if (healthPercentage > 0) {
        healthBar.style.backgroundColor = '#ffff00'; // Yellow
    } else {
        healthBar.style.backgroundColor = '#ff0000'; // Red
    }
}

export function shoot(tank, scene) {
    // Create a white sphere
    const sphereGeometry = new THREE.SphereGeometry(0.7, 64, 64);
    let sphereMaterial;
    if(tank==tank1){
        sphereMaterial = icosaedroActive? shotPWColor:shotColor1;
    }
    else{
        sphereMaterial = shotColor1;
    }

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // Set the initial position of the sphere to the tank's position
    sphere.position.copy(tank.position);
    if(tank === cannon){
        sphere.translateY(0);
    }
    else{
    sphere.translateY(13);
    }
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    // Add the sphere to the scene
    scene.add(sphere);

    // Set the shot direction based on the tank's orientation
    let shotDirection = new THREE.Vector3();
    tank.getWorldDirection(shotDirection).negate();

    // Add the shot to the array
    shots.push({ sphere, direction: shotDirection, tank, ricochets: 0 });
    tankShotSound(soundActive);
}

export function update() {
    // Move each sphere in its own direction
    for (const shot of shots) {
        if(selectedLevel === 1){
        shot.sphere.translateOnAxis(shot.direction, 2);
        }
        else if (selectedLevel === 2 || selectedLevel === 3){
        shot.sphere.translateOnAxis(shot.direction, 3);  
        }

        // Collision detection shot
        const shotBB = new THREE.Box3().setFromObject(shot.sphere);
        for (let i = 0; i < wallBoxes.length; i++) {
            if (shotBB.intersectsBox(wallBoxes[i]) && shot.tank === cannon){
                scene.remove(shot.sphere);
                shots.splice(shots.indexOf(shot), 1);
            }
            if (shotBB.intersectsBox(wallBoxes[i])) {
                if (shot.ricochets < 2) {
                    shot.ricochets++;
                    // Calculate the normal of the collision
                    let normal = new THREE.Vector3();
                    let diff = new THREE.Vector3().subVectors(shotBB.getCenter(new THREE.Vector3()), wallBoxes[i].getCenter(new THREE.Vector3()));
                    if (Math.abs(diff.x) > Math.abs(diff.y) && Math.abs(diff.x) > Math.abs(diff.z)) {
                        normal.set(Math.sign(diff.x), 0, 0);
                    } else if (Math.abs(diff.y) > Math.abs(diff.z)) {
                        normal.set(0, Math.sign(diff.y), 0);
                    } else {
                        normal.set(0, 0, Math.sign(diff.z));
                    }
                    // Reflect the shot direction based on the normal
                    shot.direction.reflect(normal);
                } else {
                    scene.remove(shot.sphere);
                    shots.splice(shots.indexOf(shot), 1);
                }
                break;
            }
        }

        if (shotBB.intersectsBox(tank1BB) && shot.tank !== tank1 && godMode === false) {
            t1_hits++;
            hitPlayerSound(tank1,soundActive);
            updateHealthBar('t1', t1_hits);
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        if (shotBB.intersectsBox(tank1BB) && shot.tank !== tank1 && godMode === true) {
            hitPlayerSound(tank1,soundActive);
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        if (shotBB.intersectsBox(tank2BB) && shot.tank !== tank2) {
            t2_hits += icosaedroActive ? 2 : 1;
            hitPlayerSound(tank2,soundActive);
            updateHealthBar('t2', t2_hits);
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        if (shotBB.intersectsBox(tank3BB) && shot.tank !== tank3) {
            t3_hits += icosaedroActive ? 2 : 1;
            hitPlayerSound(tank3,soundActive);
            updateHealthBar('t3', t3_hits);
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        if (shotBB.intersectsBox(tank4BB) && shot.tank !== tank4) {
            t4_hits += icosaedroActive ? 2 : 1;
            hitPlayerSound(tank4,soundActive);
            updateHealthBar('t4', t3_hits);
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        if (shotBB.intersectsBox(cannonBB) && shot.tank !== cannon) {
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
            continue;
        }
        if (t3_hits === 10) {
            tank3.clear();
            scene.remove(tank3);
            scene.remove(tank3BB);
        }
        if (t4_hits === 10) {
            tank4.clear();
            scene.remove(tank4);
            scene.remove(tank4BB);
        }
        if (t2_hits === 10) {
            tank2.clear();
            scene.remove(tank2);
            scene.remove(tank2BB);
            if (selectedLevel === 1){
                doorsMove(doors, doorBoxes);
            }
        }
        if (t3_hits >= 10 && t2_hits >= 10 && t4_hits >= 10) {
            reset(t1_hits, t2_hits);
        }
        if (t3_hits >= 10 && t2_hits >= 10) {
            doorsMove(doors, doorBoxes);
        }
        if (t1_hits >= 10) {
            resetLevel(selectedLevel);
        }
    }
}

export function applyPowerUpEffect(powerUp) {
    if (powerUp.name === "capsulePowerUp") {
        if(t1_hits>=2){
            t1_hits-=2;
        }
        else{
            t1_hits-=t1_hits;
        }
        console.log("Capsule power-up collected! +20% energy");
    } else if (powerUp.name === "icosahedronPowerUp") {
        icosaedroActive = true; // Ativa o efeito
        console.log("Icosahedron power-up collected! Doubling hits applied.");

        // Define um timeout para desativar o efeito após 10 segundos
        setTimeout(() => {
            icosaedroActive = false;
            console.log("Icosahedron power-up effect has worn off.");
        }, 10000);
        
    }
}


// SOUND

export let listener = new THREE.AudioListener();
    export const musicSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./sons/music1.mp3', function(buffer) {
    musicSound.setBuffer(buffer);
    musicSound.setLoop(true);        
    musicSound.setVolume(0.3);
    musicSound.play();

});





export function tankShotSound(active){
    if(active === false){
        return;
    }
    else{
    const shotSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    
    audioLoader.load('./sons/tank-shoot2.mp3', function(buffer) {
    shotSound.setBuffer(buffer);
    shotSound.setLoop(false);
    shotSound.setVolume(0.5);
    shotSound.play();
});}
}

export function hitPlayerSound(tank,active){
    if(active===false){
        return;
    }
    else{
    const shotSound = new THREE.Audio(listener);
    const p = 0.8;
    const b = 0.4;
    const audioLoader = new THREE.AudioLoader();
    let s;
    s = (tank ===tank1)? p:b;
    audioLoader.load('./sons/tank-hit.mp3', function(buffer) {
    shotSound.setBuffer(buffer);
    shotSound.setLoop(false);
    shotSound.setVolume(s);
    shotSound.play();
});}
}

export function gateSound(active){
    if(active===false){
        return;
    }
    else{
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./sons/gate-open.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(s);
    sound.play();
});}
}

tank1.add(listener);
