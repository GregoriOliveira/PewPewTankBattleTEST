import * as THREE from 'three';


export function doorsMove(doors, doorBoxes) {
    
for (let i = 0; i < doors.length; i++) {
    const wall = doors[i];
    wall.position.y = THREE.MathUtils.lerp(wall.position.y, -9, 0.1);
}
for (let i = 0; i < doors.length; i++) {
    const wall = doors[i];
    
    doorBoxes[i].setFromObject(wall);

}
}