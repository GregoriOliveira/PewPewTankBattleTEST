import * as THREE from 'three';
import { CSG } from '../libs/other/CSGMesh.js';

function createCannonBase(size, material) {

    const outerBarrelGeometry = new THREE.CylinderGeometry(size / 5, size / 5, size * 2.5, 32);
    const innerBarrelGeometry = new THREE.CylinderGeometry(size / 10, size / 10, size * 2.6, 32);

    const outerBarrelMesh = new THREE.Mesh(outerBarrelGeometry, material);
    const innerBarrelMesh = new THREE.Mesh(innerBarrelGeometry, material);

    innerBarrelMesh.matrixAutoUpdate = false;
    outerBarrelMesh.matrixAutoUpdate = false;

    outerBarrelMesh.rotateX(THREE.MathUtils.degToRad(90));
    innerBarrelMesh.rotateX(THREE.MathUtils.degToRad(90));

    outerBarrelMesh.updateMatrix();
    innerBarrelMesh.updateMatrix();

    outerBarrelMesh.position.set(0, 0, -3);
    outerBarrelMesh.updateMatrix();
    innerBarrelMesh.position.set(0, 0, -4);
    innerBarrelMesh.updateMatrix();

    let outerCSG = CSG.fromMesh(outerBarrelMesh);
    let innerCSG = CSG.fromMesh(innerBarrelMesh);
    let barrelCSG = outerCSG.subtract(innerCSG);

    // Create the cylindrical base
    const baseGeometry = new THREE.CylinderGeometry(size * 0.5, size * 0.5, size * 0.05, 32);
    const connectorGeometry = new THREE.BoxGeometry(size * 0.6, size * 0.6, size * 0.6);

    const baseMesh = new THREE.Mesh(baseGeometry, material);
    const connectorMesh = new THREE.Mesh(connectorGeometry, material);

    connectorMesh.position.set(0, -3, 0);
    connectorMesh.updateMatrix();

    baseMesh.position.set(0, -5.5, 0);
    baseMesh.updateMatrix();

    let baseCSG = CSG.fromMesh(baseMesh);
    let connectorCSG = CSG.fromMesh(connectorMesh);

    let cannonBaseCSG = baseCSG.union(connectorCSG);
    cannonBaseCSG = cannonBaseCSG.union(barrelCSG);
    cannonBaseCSG = cannonBaseCSG.subtract(innerCSG);

    const cannonBaseMesh = CSG.toMesh(cannonBaseCSG, baseMesh.matrix);
    cannonBaseMesh.material = material;
    cannonBaseMesh.castShadow = true;
    cannonBaseMesh.receiveShadow = true;

    return cannonBaseMesh;
}

function assemblecannon(size, material) {
    const cannon = new THREE.Group();
    const cannonBase = createCannonBase(size * 2, material);

    cannon.add(cannonBase);
    cannon.position.set(-size * 10, size / 2, size * 10);
    cannon.rotateY(Math.PI);
    cannon.castShadow = true;
    cannon.receiveShadow = true;

    return cannon;
}

function createBoundingBox(group) {
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(group);
    return boundingBox;
}

const cannonSize = 5;
let blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });

const cannon = assemblecannon(cannonSize, blueMaterial);
let cannonBB = createBoundingBox(cannon);

export { cannon, cannonBB };
