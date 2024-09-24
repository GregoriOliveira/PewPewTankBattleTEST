import * as THREE from 'three';
import { wallBoxes } from './level1.js';
import { tank1, tank1BB, tank2, tank2BB } from './tank.js';
import { scene } from './main.js';
import { reset } from './reset.js';

let shots = []; // Array to hold all shots

let t1_hits = 0;
let t2_hits = 0;

export function shoot(tank, scene) {
    // Create a white sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Set the initial position of the sphere to the tank's position
    sphere.position.copy(tank.position);
    sphere.translateY(1.2);
    // Add the sphere to the scene
    scene.add(sphere);

    // Set the shot direction based on the tank's orientation
    let shotDirection = new THREE.Vector3();
    tank.getWorldDirection(shotDirection);

    // Add the shot to the array
    shots.push({ sphere, direction: shotDirection, tank, ricochets: 0 });

}

export function update() {
    // Move each sphere in its own direction
    for (const shot of shots) {
        shot.sphere.translateOnAxis(shot.direction, 2);

        //Collision detection shot
        const shotBB = new THREE.Box3().setFromObject(shot.sphere);
        for (let i = 0; i < wallBoxes.length; i++){
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

        if (shotBB.intersectsBox(tank1BB) && shot.tank !== tank1) {
            t1_hits++;
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        if (shotBB.intersectsBox(tank2BB) && shot.tank !== tank2) {
            t2_hits++;
            console.log(t2_hits);
            scene.remove(shot.sphere);
            shots.splice(shots.indexOf(shot), 1);
        }
        

        if (t1_hits === 10 || t2_hits === 10) {
            reset(t1_hits, t2_hits);
        }
    }
}