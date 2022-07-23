console.log("Welcome to Lusine GM engine !");

import Stats from './jsm/libs/stats.module.js';
import { Game } from './game';

import { Editor } from './editor';
import { GameObject } from './gameObject';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { TransformControls } from './jsm/controls/TransformControls.js';
import { Car } from './gameProjects/runTraffic/Assets/Prefabs/car.js';
import * as THREE from 'three';

const editor = new Editor();
const OBJA_ID = 161;
const OBJB_ID = 164;

const fsmEditor = document.getElementById("fsm");
const objectsList = document.getElementById('objectsList');
const startGameBtn = document.getElementById('startGameBtn');
const stopGameBtn = document.getElementById('stopGameBtn');


const ControlMode = {
    Translate: 'translate',
    Rotate: 'rotate',
    Scale: 'scale'
}

const Space = {
    Local: 'local',
    World: 'world'
}


const clock = new THREE.Clock(false);

let gameIsRunning = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

const grid = new THREE.GridHelper(10, 20, 0x000000, 0x000000);
// grid.material.opacity = 0.2;
// grid.material.transparent = true;
scene.add(grid);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = - 100;
dirLight.shadow.camera.left = - 120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);

scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

// ground
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);


const camera = new THREE.PerspectiveCamera(75, 600 / 480, 0.1, 1000);
camera.position.y = 10;
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(600, 480);
renderer.shadowMap.enabled = true;

const rendererElement = document.getElementById('renderer');


const stats = Stats();

if (rendererElement) {
    rendererElement.appendChild(renderer.domElement);
    rendererElement.appendChild(stats.dom);
} else {
    console.error('rendererElement is undefined');
}


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.MIDDLE,
    RIGHT: THREE.MOUSE.PAN
};
orbit.update();
orbit.addEventListener('change', render);

const control = new TransformControls(camera, renderer.domElement);
control.addEventListener('change', render);
control.addEventListener('dragging-changed', function (event: any) {
    orbit.enabled = !event.value;
});
control.setSize(1.5);
control.setSpace(Space.Local);

control.setScaleSnap(0.01);



camera.position.z = 5;

animate(undefined);

editor.playerCarGO = new GameObject('Player Car');
var car: Car = new Car();


editor.playerCarGO.addFSM('PlayerCar State Machine');

scene.add(car);

car.scale.set(0.025, 0.025, 0.025);

editor.playerCarGO.attach(car);

scene.add(editor.playerCarGO);

// @ts-ignore
document.getElementById("selectObjABtn").innerHTML = editor.playerCarGO.name + '     ID : ' + editor.playerCarGO.id;
// @ts-ignore
document.getElementById("selectObjBBtn").innerHTML = car.name + '     ID : ' + car.id;

selectObject(editor.playerCarGO);

scene.add(control);


//camera.lookAt(go);

// Button start game
function startGame() {

    console.log("Game started !");
    // @ts-ignore
    startGameBtn.disabled = true;
    // @ts-ignore
    stopGameBtn.disabled = false;
    // @ts-ignore
    fsmEditor.style.display = 'none';
    // @ts-ignore
    objectsList.style.display = 'none';

    //editor.gameObjectToExport = editor.playerCarGO;


    // editor.saveGameObjectToJSON();
    // @ts-ignore
    editor.playerCarGO.saveTransform();

    //go.finiteStateMachines[0].currState.onUpateStateWorkSpace = demoWorkspace2;
    // @ts-ignore
    if (editor.playerCarGO.finiteStateMachines[0].enabled) {
        // @ts-ignore
        editor.playerCarGO.finiteStateMachines[0].start();
    }


    clock.start();
    gameIsRunning = true;

    // TEST
    //setTimeout(stopGame,3000);

}

function stopGame() {

    console.log("game stoped !");
    // @ts-ignore
    stopGameBtn.disabled = true;

    clock.stop();
    Game.deltaTime = 0;

    gameIsRunning = false;
    //scene.remove(car);
    //editor.loadGameObjectFromJSON();

    // @ts-ignore
    editor.playerCarGO.resetTransform(); // remettre l'objet comme il était avant le début du jeu

    // @ts-ignore
    startGameBtn.disabled = false;
    // @ts-ignore
    fsmEditor.style.display = 'block';
    // @ts-ignore
    objectsList.style.display = 'block';

}

function animate(timestamp: any) {
    requestAnimationFrame(animate);

    stats.update();
    render();

    if (gameIsRunning) {
        Game.deltaTime = clock.getDelta();
        gameLoop();
    }


}

function render() {

    renderer.render(scene, camera);
}

function gameLoop() {
    //if (go.finiteStateMachines[0].enabled)
    //go.finiteStateMachines[0].runCode(demoWorkspace2);

    // @ts-ignore
    editor.playerCarGO.finiteStateMachines[0].update();
}


function selectObject(gameObject: GameObject) {

    if (gameObject) {
        control.attach(gameObject);

        var f = document.getElementById("fsm-name");
        if (gameObject.finiteStateMachines.length == 0) {
            // @ts-ignore
            f.innerHTML = "Aucun Automate Fini dans cet objet";
            // @ts-ignore
            fsmEditor.style.display = 'none';
        } else {
            // @ts-ignore
            f.innerHTML = gameObject.name + "->" + gameObject.finiteStateMachines[0].name + "->StateA";

        }
    }

}

function executeCommand() {

    try {
        // @ts-ignore
        eval(document.getElementById("command").value)
    } catch (error) {
        alert(error);
    }
}

// @ts-ignore
document.getElementById('selectObjABtn').addEventListener("click", () => { selectObject(GameObject.getById(OBJA_ID)) });
// @ts-ignore
document.getElementById('selectObjBBtn').addEventListener("click", () => { selectObject(GameObject.getById(OBJB_ID)) });

// @ts-ignore
document.getElementById('translateModeBtn').addEventListener("click", () => { control.setMode(ControlMode.Translate) });
// @ts-ignore
document.getElementById('rotateModeBtn').addEventListener("click", () => { control.setMode(ControlMode.Rotate) });
// @ts-ignore
document.getElementById('scaleModeBtn').addEventListener("click", () => { control.setMode(ControlMode.Scale) });
// @ts-ignore
document.getElementById('localSpaceBtn').addEventListener("click", () => { control.setSpace(Space.Local) });
// @ts-ignore
document.getElementById('worldSpaceBtn').addEventListener("click", () => { control.setSpace(Space.World) });
// @ts-ignore
document.getElementById('executeCommandBtn').addEventListener("click", executeCommand);
// @ts-ignore
document.getElementById('startGameBtn').addEventListener("click", startGame);
// @ts-ignore
document.getElementById('stopGameBtn').addEventListener("click", stopGame);
// @ts-ignore
document.getElementById('saveStateABtn').addEventListener('click', (event) => { editor.saveDemoWorkspace(); });
// @ts-ignore
document.getElementById('clearConsoleBtn').addEventListener('click', (event) => {
    // @ts-ignore
    document.getElementById('console').innerHTML = "";
});

window.addEventListener('resize', onWindowResize);


function onWindowResize() {
    camera.aspect = 600 / 480;
    camera.updateProjectionMatrix();
    renderer.setSize(600, 480);
}


