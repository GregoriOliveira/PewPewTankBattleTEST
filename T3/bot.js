import * as THREE from 'three';
import { tank1, tank2, tank3, tank4, tank1BB, tank2BB, tank3BB, tank4BB } from './tank.js';
import { shoot, t1_hits, t2_hits } from './shooting.js';
import { scene, selectedLevel } from './main.js';
import { wallBoxes, walls } from './level1.js';
import { cannon, cannonBB } from './cannon.js';

let lastShotTime = 0;
let lastCannonShotTime = 0;
const cannonRotationSpeed = 0.02;
const safeDistance = 50;
const shootingDistance = 100;
const retreatDuration = 2000; // 2 seconds
let retreatStartTime = null;


const bot = {
    controlTank(tank, boundingBox, tankPlayer) {
        boundingBox.setFromObject(tank);
        const boundingBoxCenter = new THREE.Vector3();
        boundingBox.getCenter(boundingBoxCenter);
        boundingBox.expandByScalar(3);
        boundingBoxCenter.setY(0.2);

        const raycasterWalls = new THREE.Raycaster();
        const numRays = 20;
        const coneAngle = THREE.MathUtils.degToRad(60);
        const directions = [];
    
        for (let i = 0; i < numRays; i++) {
            const angleOffset = (Math.random() - 0.5) * coneAngle;
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(tank.quaternion);
            direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleOffset);
            directions.push(direction);
        }
    
        let wallDetected = false;
        
        let avoidanceDirection = new THREE.Vector3();
    
        for (let direction of directions) {
            raycasterWalls.set(boundingBoxCenter, direction);
            raycasterWalls.far = 10;
    
            const wallIntersects = raycasterWalls.intersectObjects(walls, true);
            if (wallIntersects.length > 0) {
                wallDetected = true;
                
            }
        }
        
        const toPlayer = new THREE.Vector3().subVectors(tankPlayer.position, tank.position).normalize();
        const distanceToPlayer = tank.position.distanceTo(tankPlayer.position);
    
        const oldPosition = tank.position.clone();
    
        if (distanceToPlayer < safeDistance) {
            if (retreatStartTime === null) {
                retreatStartTime = Date.now();
            }
            const elapsedTime = Date.now() - retreatStartTime;
    
            const escapeDirection = new THREE.Vector3().subVectors(tank.position, tankPlayer.position).normalize();
            const targetRotation = Math.atan2(-escapeDirection.x, -escapeDirection.z);
            tank.rotation.y = THREE.MathUtils.lerp(tank.rotation.y, targetRotation + Math.PI, 0.05);
    
            if (elapsedTime < retreatDuration) {
                tank.translateZ(0.5);
                const distanceZ = Math.abs(tank.position.z - tankPlayer.position.z);
                const distanceX = Math.abs(tank.position.x - tankPlayer.position.x);
        
                // Comportamento do tankBot
                if (wallDetected) {
        
                  // Se houver uma interseção, rotaciona o tankBot
                  if (distanceX) {
                    if ((tankBot.position.z > tankPlayer.position.z))
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
            } else {
                retreatStartTime = null; // Reset retreat timer after 2 seconds
            }
        } else if (distanceToPlayer > safeDistance) {
            retreatStartTime = null; // Reset retreat timer if no longer retreating

            const targetRotation = Math.atan2(-toPlayer.x, -toPlayer.z);
            tank.rotation.y = THREE.MathUtils.lerp(tank.rotation.y, targetRotation, 0.05);
    
            if (!wallDetected) {
                tank.translateZ(-0.5);
            } else {
                avoidanceDirection.normalize();
                const avoidTargetRotation = Math.atan2(-avoidanceDirection.x, -avoidanceDirection.z);
                tank.rotation.y = THREE.MathUtils.lerp(tank.rotation.y, avoidTargetRotation, 0.1);
                tank.translateZ(0.5);
            }
        }
    
    
        const tanks = [{ tank: tank1, bb: tank1BB }, { tank: tank2, bb: tank2BB }, { tank: tank3, bb: tank3BB },{tank: tank4,bb: tank4BB}];
        for (let other of tanks) {
            if (other.tank !== tank && boundingBox.intersectsBox(other.bb)) {
                tank.position.copy(oldPosition);
                boundingBox.setFromObject(tank);
                break;
            }
        }
    
        const currentTime = Date.now();
        const timeSinceLastShot = currentTime - lastShotTime;
    
        if (timeSinceLastShot >= 3000 && distanceToPlayer < shootingDistance) {
            let shootDirection = toPlayer.clone();
    
            raycasterWalls.set(tank.position, shootDirection);
            raycasterWalls.far = shootingDistance;
            const directShotBlocked = raycasterWalls.intersectObjects(walls, true).length > 0;
    
            if (directShotBlocked) {
                let ricochetCalculated = false;
                for (let direction of directions) {
                    raycasterWalls.set(tank.position, direction);
                    const wallIntersects = raycasterWalls.intersectObjects(walls, true);
                    if (wallIntersects.length > 0) {
                        const wallNormal = wallIntersects[0].face.normal;
                        shootDirection = direction.clone().reflect(wallNormal).normalize();
                        
                        const ricochetRotation = Math.atan2(shootDirection.x, shootDirection.z);
                        tank.rotation.y = THREE.MathUtils.lerp(tank.rotation.y, ricochetRotation, 0.1);

                        ricochetCalculated = true;
                        break;
                    }
                }
                if (!ricochetCalculated) {
                    shootDirection = toPlayer.clone();
                }
            } else {
                const targetRotation = Math.atan2(shootDirection.x, shootDirection.z);
                tank.rotation.y = THREE.MathUtils.lerp(tank.rotation.y, targetRotation, 0.05);
            }

            // Final check to avoid shooting directly into a wall without a ricochet
            raycasterWalls.set(tank.position, shootDirection);
            raycasterWalls.far = 10; // Short range to check immediate obstacles
            const immediateWall = raycasterWalls.intersectObjects(walls, true).length > 0;

            if (!immediateWall) {
                shoot(tank, scene); // Shoot only if not directly hitting a wall
                lastShotTime = currentTime;
            }
        }
    },

    controlCannon() {
        const targets = [tank1, tank2, tank3].filter(tank => scene.getObjectById(tank.id) !== undefined);
        if (targets.length === 0) return;

        let closestTank = targets[0];
        let minDistance = cannon.position.distanceTo(closestTank.position);

        for (let i = 1; i < targets.length; i++) {
            const distance = cannon.position.distanceTo(targets[i].position);
            if (distance < minDistance) {
                closestTank = targets[i];
                minDistance = distance;
            }
        }

        const cannonDirection = new THREE.Vector3().subVectors(closestTank.position, cannon.position).normalize();
        const targetRotation = -Math.atan2(cannonDirection.x, cannonDirection.z);
        cannon.rotation.y = THREE.MathUtils.lerp(cannon.rotation.y, targetRotation, cannonRotationSpeed);

        const currentTime = Date.now();
        if (currentTime - lastCannonShotTime > 3000) {
            shoot(cannon, scene); // Shoot without specifying a direction
            lastCannonShotTime = currentTime;
        }
    }
};

function updateBots() {
    if (selectedLevel === 1 && t2_hits < 10) {
        bot.controlTank(tank2, tank2BB, tank1);
    } else if (selectedLevel === 2) {
        bot.controlTank(tank2, tank2BB, tank1);
        bot.controlTank(tank3, tank3BB, tank1);
        bot.controlCannon();
    }
    else if (selectedLevel === 3) {
        bot.controlTank(tank2, tank2BB, tank1);
        bot.controlTank(tank3, tank3BB, tank1);
        bot.controlTank(tank4, tank4BB, tank1)
    }
}

export { updateBots };
