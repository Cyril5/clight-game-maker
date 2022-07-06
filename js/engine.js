
import * as THREE from '../node_modules/three/build/three.module.js';

import GameObject from "./gameObject.js";

import { MapControls, OrbitControls } from './libs/three/jsm/controls/OrbitControls.js';
import { TransformControls } from './libs/three/jsm/controls/TransformControls.js';
import { Car } from './tests/gameProjects/runTraffic/Assets/Prefabs/car.js';

const ControlMode = {
    Translate: 'translate',
    Rotate: 'rotate',
    Scale: 'scale'
}

const Space = {
    Local: 'local',
    World: 'world'
}

var options = { 
	toolbox : toolbox, 
	collapse : true, 
	comments : true, 
	disable : true, 
	maxBlocks : Infinity, 
	trashcan : true, 
	horizontalLayout : true, 
	toolboxPosition : 'start', 
	css : true, 
	media : 'https://blockly-demo.appspot.com/static/media/', 
	rtl : false, 
	scrollbars : true, 
	sounds : true, 
	oneBasedIndex : true
};

const demoWorkspace = Blockly.inject( document.getElementById("stateA_workspace"),options);

// const demoWorkspace2 = Blockly.inject('onupdatestate_workspace',
//     {
//         toolbox: document.getElementById('toolbox')
//     });

// const demoWorkspace3 = Blockly.inject('onexitstate_workspace',
//     {
//         toolbox: document.getElementById('toolbox')
//     });

const clock = new THREE.Clock(false);
var deltaTime = 0;

let gameIsRunning = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

const grid = new THREE.GridHelper(10, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
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

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(600, 480);
renderer.shadowMap.enabled = true;
document.getElementById('renderer').appendChild(renderer.domElement);


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    RIGHT: THREE.MOUSE.PAN
};
orbit.update();
orbit.addEventListener('change', render);

const control = new TransformControls(camera, renderer.domElement);
control.addEventListener('change', render);
control.addEventListener('dragging-changed', function (event) {
    orbit.enabled = !event.value;
});
control.setSize(1.5);
control.setSpace(Space.Local);

control.setScaleSnap( 0.01 );



camera.position.z = 5;

animate();

const go = new GameObject('Player Car');
const car = new Car('Car Group');

//go.attach(car);

go.addFSM('Cube State Machine');

scene.add(car);
car.scale.set(0.1,0.1,0.1);
go.attach(car);
scene.add(go);


document.getElementById("objectsList").value = 'Name : '+go.name +'     ID : '+go.id;
document.getElementById("objectsList").value += '\nName : '+car.name +'     ID : '+car.id+'  ParentID : '+car.parent.id;

selectObject(go);

scene.add(control);


// Button start game
function startGame() {

    console.log("Game started !");

    //go.finiteStateMachines[0].currState.onUpateStateWorkSpace = demoWorkspace2;

    if (go.finiteStateMachines[0].enabled) {

        go.finiteStateMachines[0].start();
    }



    clock.start();
    gameIsRunning = true;

    // TEST
    //setTimeout(stopGame,3000);
}

function stopGame() {
    clock.stop();
    gameIsRunning = false;
}

function animate(timestamp) {
    requestAnimationFrame(animate);

    render();

    if (gameIsRunning) {
        deltaTime = clock.getDelta();
        gameLoop();
    }


}

function render() {

    renderer.render(scene, camera);
}

function gameLoop() {
    //if (go.finiteStateMachines[0].enabled)
    //go.finiteStateMachines[0].runCode(demoWorkspace2);

    go.finiteStateMachines[0].update();
}

demoWorkspace.addChangeListener(onChangeWorkspace);


function onChangeWorkspace(event) {

    var workspaceCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    let code = '';

    demoWorkspace.getAllBlocks().forEach(block => {

        const imports = block.imports;

        // if (imports !== undefined) {

        //     let importString = '';

        //     imports.forEach(i => {
        //         importString = "Import " + i[0] + " from '" + i[1] + "';"; // ex : Import Mathf from '../dir/mathf.js';
        //         if (!code.includes(importString)) // evite d'importer plusieurs fois les classes
        //             code += importString;
        //     });
        // }
    });

    code += '\n\n' + workspaceCode;

    go.finiteStateMachines[0].currState.code = code;

    document.getElementById('code').value = code;
    // var fullCode = code;
}

document.getElementById('startGameBtn').addEventListener("click", startGame);
document.getElementById('stopGameBtn').addEventListener("click", stopGame);
document.getElementById('translateModeBtn').addEventListener("click", ()=>{ control.setMode(ControlMode.Translate) });
document.getElementById('rotateModeBtn').addEventListener("click", ()=>{ control.setMode(ControlMode.Rotate) });
document.getElementById('scaleModeBtn').addEventListener("click", ()=>{ control.setMode(ControlMode.Scale) });
document.getElementById('localSpaceBtn').addEventListener("click", ()=>{ control.setSpace(Space.Local)});
document.getElementById('worldSpaceBtn').addEventListener("click", ()=>{ control.setSpace(Space.World)});

document.getElementById('executeCommandBtn').addEventListener("click",executeCommand);

function selectObject(gameObject) {
    control.attach(gameObject);
}

function executeCommand() {

    try {
        eval(document.getElementById("command").value)
    } catch (error) {
        alert(error);
    }
}

