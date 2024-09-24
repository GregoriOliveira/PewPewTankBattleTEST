import * as THREE 			from  'three';
import {RaytracingRenderer} from  '../libs/other/raytracingRenderer.js';

var scene, renderer;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the
// objects in the negative side
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 4.5;
camera.position.y = 2;


// light
var intensity = 0.5;
var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 0, 2.50, 0 );
scene.add( light );

var light = new THREE.PointLight( 0x55aaff, 0.2);
light.position.set( -1.00, 2.50, 2.00 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 0.2 );
light.position.set( 1.00, 2.50, 2.00 );
scene.add( light );

renderer = new RaytracingRenderer(window.innerWidth, window.innerHeight, 32, camera);
container.appendChild( renderer.domElement );

// materials
var phongMaterialBox = new THREE.MeshLambertMaterial( {
	color: "rgb(150,190,220)",
} );

var phongMaterialBoxBottom = new THREE.MeshLambertMaterial( {
	color: "rgb(210,240,220)",
} );

var phongMaterialBoxCyl = new THREE.MeshLambertMaterial( {
	color: "rgb(255,0,0)",
} );

var phongMaterialBoxRight = new THREE.MeshLambertMaterial( {
	color: "rgb(100,100,255)",
} );

var phongMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(150,190,245)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
	} );

var mirrorMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
} );
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1;

var mirrorMaterialDark = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(170,170,170)",
	shininess: 10000,
} );
mirrorMaterialDark.mirror = true;
mirrorMaterialDark.reflectivity = 1;

var mirrorMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(255,170,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

var glassMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 10000,
} );
glassMaterialSmooth.glass = true;
glassMaterialSmooth.reflectivity = 0.25;
glassMaterialSmooth.refractionRatio = 1.5;

// geometries
var sphereGeometry = new THREE.SphereGeometry( 1, 24, 24 );
var planeGeometry = new THREE.BoxGeometry( 6.00, 0.05, 6.00 );
var base = new THREE.CylinderGeometry(1.2,1.2,2);
var cylGeo = new THREE.CylinderGeometry(1.2,0.6,2);
var torusGeo = new THREE.TorusKnotGeometry(0.6,0.2,64,8,2,3);

//bases
var b1 = new THREE.Mesh(base,phongMaterial);
b1.scale.multiplyScalar(0.5);
b1.position.set(-1.75, 0.05,-0.6)
scene.add(b1);
var b2 = new THREE.Mesh(base,phongMaterial);
b2.scale.multiplyScalar(0.5);
b2.position.set(0, 0.05,-1.8)
scene.add(b2);
var b3 = new THREE.Mesh(base,phongMaterial);
b3.scale.multiplyScalar(0.5);
b3.position.set(1.75,0.05,-0.6)
scene.add(b3);


// Sphere
var sphere = new THREE.Mesh( sphereGeometry, mirrorMaterial );
sphere.scale.multiplyScalar( 0.5 );
sphere.position.set( 0, 1, -1.8 );
scene.add( sphere );



// Cyl
var cyl = new THREE.Mesh( cylGeo, phongMaterialBoxCyl );
cyl.scale.multiplyScalar( 0.4 );
cyl.position.set(1.75,0.85,-0.6);
scene.add(cyl);

//Torus
var torus = new THREE.Mesh(torusGeo,mirrorMaterialSmooth);
torus.position.set(-1.75,0.95,-0.6);
torus.scale.multiplyScalar(0.4);
scene.add(torus);

// bottom
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
plane.position.set( 0, -.5, -3.00 );
scene.add( plane );

// top
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
plane.position.set( 0, 5.5, -3.00 );
scene.add( plane );

// back
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
plane.rotation.x = 1.57;
plane.position.set( 0, 2.50, -3.00 );
scene.add( plane );

// left
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxRight );
plane.rotation.z = 1.57;
plane.position.set( -3.00, 2.50, -3.00 )
scene.add( plane );

// right
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxRight );
plane.rotation.z = 1.57;
plane.position.set( 3.00, 2.50, -3.00 )
scene.add( plane );

render();

function render()
{
	renderer.render( scene, camera );
}
