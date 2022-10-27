import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
let mixer;
let robot;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(100, 0.1, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const gloader = new GLTFLoader();
gloader.load("./models/mech_drone/scene.gltf", (drone) => {
    mixer = new THREE.AnimationMixer(drone.scene);
    robot = drone.scene;
    drone.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    })
    scene.add(drone.scene);
});

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    "./textures/clouds1/clouds1_south.bmp",
    "./textures/clouds1/clouds1_north.bmp",
    "./textures/clouds1/clouds1_up.bmp",
    "./textures/clouds1/clouds1_down.bmp",
    "./textures/clouds1/clouds1_east.bmp",
    "./textures/clouds1/clouds1_west.bmp",
]);
scene.background = texture;


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  let delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
}
animate();

var xSpeed = 0.1;
var ySpeed = 0.1;

document.addEventListener("keydown", onDocumentKeyDown, false);

//w,a,s,d and space for reset position
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        robot.position.y += ySpeed;
    } else if (keyCode == 83) {
        robot.position.y -= ySpeed;
    } else if (keyCode == 65) {
        robot.position.x -= xSpeed;
    } else if (keyCode == 68) {
        robot.position.x += xSpeed;
    } else if (keyCode == 32) {
        robot.position.set(0, 0, 0);
    }
};