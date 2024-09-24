import * as THREE from 'three';

function createBarrel(size, material) {
  const geometry = new THREE.CylinderGeometry(size / 10, size / 10, size * 2, 32);
  const barrel = new THREE.Mesh(geometry, material);
  barrel.castShadow = true;
  barrel.receiveShadow = true;
  return barrel;
}

function createCannon(size, material) {
  const cannon = new THREE.Object3D();
  const barrel = createBarrel(size, material);
  barrel.position.y = size;
  cannon.add(barrel);
  cannon.rotation.x = 90 * Math.PI / 180;
  cannon.position.y = size / 10;
  cannon.castShadow = true;
  cannon.receiveShadow = true;
  return cannon;
}

function createCannonBase(size, material) {
  const geometry = new THREE.SphereGeometry(size * 0.8, 32, 16);
  const cannonBase = new THREE.Mesh(geometry, material);
  cannonBase.castShadow = true;
  cannonBase.receiveShadow = true;
  return cannonBase;
}

function createBase(size, material) {
  const geometry = new THREE.BoxGeometry(size * 2, size, size * 2);
  const base = new THREE.Mesh(geometry, material);
  base.castShadow = true;
  base.receiveShadow = true;
  return base;
}

function createWheel(size, material, position) {
  const geometry = new THREE.CylinderGeometry(size / 2, size / 2, size / 2, 32);
  const wheel = new THREE.Mesh(geometry, material);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(...position);
  wheel.castShadow = true;
  wheel.receiveShadow = true;
  return wheel;
}

function assembleTank(size, material, materialW) {
  const tank = new THREE.Object3D();
  const base = createBase(size, material);
  const top = new THREE.Object3D();
  const cannonBase = createCannonBase(size, material);
  const cannon = createCannon(size, material);

  top.add(cannonBase);
  top.add(cannon);
  top.position.y = size / 2;
  top.position.z = size / 10;
  top.castShadow = true;
  top.receiveShadow = true;

  const wheelPositions = [
    [-size, -size / 10, size / 2],
    [size, -size / 10, size / 2],
    [-size, -size / 10, -size / 2],
    [size, -size / 10, -size / 2]
  ];
  const wheels = wheelPositions.map(pos => createWheel(size, materialW, pos));
  wheels.forEach(wheel => base.add(wheel));

  tank.add(base);
  tank.add(top);
  tank.position.set(-size * 10, size / 2, size * 10);
  tank.rotateY(Math.PI);
  tank.castShadow = true;
  tank.receiveShadow = true;

  return tank;
}

const tankSize = 2; // Adjust as needed
let redMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000});
let blueMaterial = new THREE.MeshPhongMaterial({color: 0x0000FF});
let blackMaterial = new THREE.MeshPhongMaterial({ color: 'black' });
const tank1 = assembleTank(tankSize, blueMaterial, blackMaterial);
const tank2 = assembleTank(tankSize, redMaterial, blackMaterial);
const tank1BB = new THREE.Box3();
const tank2BB = new THREE.Box3();
export { tank1, tank2, tank1BB, tank2BB };
