<template>
    <div class="container">
        <div id="objectsList">
            <h2>Objets</h2>
            <button id="selectObjABtn" v-on:click="selectObjectA()"> (ID: })</button>
            <div class="child">
                <button id="selectObjBBtn" v-on:click="selectObjectB()">Child Car (ID: 4)</button>
            </div>
        </div>

        <div class="left">
            <button id="translateModeBtn" v-on:click="setControlMode('Translate')">Pos</button>
            <button id="rotateModeBtn" v-on:click="setControlMode('Rotate')">Rot</button>
            <button id="scaleModeBtn" v-on:click="setControlMode('Scale')">Scale</button>
            <button id="localSpaceBtn" v-on:click="setSpace('local')">Local</button>
            <button id="worldSpaceBtn" v-on:click="setSpace('world')">Monde</button>
            <button id="startGameBtn">Start</button>
            <button id="stopGameBtn" disabled>Stop</button>

            <Renderer />

        </div>

        <div class="right">

            <h5 style="color:red">{{ count }}</h5>

            <div class="properties-bar">
                <div class="component" v-if="selectedObjectRef">
                    <h2>{{ selectedObjectRef.name }}</h2>
                    <h3>Position : </h3>
                    <div class="position" style="display: flex; justify-content: space-between;">
                        <div class="local">
                            <label for="posx">X : </label>
                            <input type="number" id="posx" v-model="selectedObjectRef.position.x" width="5">
                            <label for="posx">Y : </label>
                            <input type="number" id="posy" v-model="selectedObjectRef.position.y" width="5">
                            <label for="posx">Z : </label>
                            <input type="number" id="posz" v-model="selectedObjectRef.position.z" width="5">

                            <!-- <p>{{ selectedObjectRef.position }}</p> -->
                            <!-- <p>{{ selectedObjectRef.position.y }}</p>
                            <p>{{ selectedObjectRef.position.z }}</p> -->
                        </div>
                        <!-- <div class="world" v-if="control.space == 'world'">
                            <p>MX : {{ selectedObjectRef.getWorldPos().x }}</p>
                            <p>MY : {{ selectedObjectRef.getWorldPos().y }}</p>
                            <p>MZ : {{ selectedObjectRef.getWorldPos().z }}</p>
                        </div> -->
                    </div>
                    <h3>Rotation</h3>
                    <div class="rotation" style="display: flex;">
                        <p>X : 0</p>
                        <p>Y : 0</p>
                        <p>Z : 0</p>
                    </div>
                    <h3>Echelle</h3>
                    <div class="scale" style="display: flex;">
                        <p></p>
                        <p>Y : 1</p>
                        <p>Z : 1</p>
                    </div>
                </div>
                <button id="addFSMBtn">Ajouter une machine d'Etat sur l'objet</button>

            </div>





            <div id="fsm">
                <button>Nouveau</button>
                <button id="saveStateABtn">Enregistrer</button>
                <button>Enregistrer Sous</button>
                <p id="fsm-name" style="color: #fff; text-align: center;">PlayerCar->FSM->State A</p>

                <div style="display: flex; width: 100%;">
                    <p>Etat</p>
                    <select name="fsm-states" id="fsm-states">
                        <option value="stateA">State A</option>
                    </select>

                    <p>Fichier : Assets/FSM States/stateA.json</p>
                    <button id="changeStateFileBtn">Changer</button>
                </div>

                <div id="stateA">
                    <div id="stateA_workspace"></div>
                    <textarea id="code-editor"></textarea>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

import { onMounted, onUpdated, reactive, ref } from 'vue';
import Engine from '../engine';
import * as THREE from 'three';

// //import DarkTheme from '../node_modules/@blockly/theme-dark/src/index.js';
import LusineBlocksDarkTheme from '../blocks/themes/lusine-gm-dark'
import Blockly from 'blockly';

import { GameObject } from '../gameObject';
import * as fs from 'fs';
import CodeMirror from 'codemirror';
import { OrbitControls } from '../jsm/controls/OrbitControls';
import { TransformControls } from '../jsm/controls/TransformControls';

import { Car } from '../gameProjects/runTraffic/Assets/Prefabs/car';

import Renderer from './Renderer.vue';

enum ControlMode {
    Translate = 'translate',
    Rotate = 'rotate',
    Scale = 'scale'
}

enum Space {
    Local = 'local',
    World = 'world'
}

let control;
let selectedObject: GameObject;

export default {

    name: 'Editor',
    components: {
        Renderer  // obtenir l'instance de renderer
    },

    setup() {
        console.log("setup editor");

        initEditor();
        //return { count, controlRef, selectedObjectState }
    },
    mounted() {
        console.log("Editor mounted");
    },
    data() {
        return {
            selectedObjectRef: null,
        }
    },
    methods: {

        selectObjectA() {
            // for (const entry of GameObject.gameObjects) {

            //     console.log(entry);
            // }
            this.selectObject(GameObject.getById(161));
            this.count++;
        },
        selectObjectB() {
            this.selectObject(GameObject.getById(164));
        },
        setControlMode(controlMode: String) {
            var cm: ControlMode = ControlMode.Translate;
            switch (controlMode) {
                case 'Translate':
                    cm = ControlMode.Translate;
                    break;
                case 'Rotate':
                    cm = ControlMode.Rotate;
                    break;
                case 'Scale':
                    cm = ControlMode.Scale;
            }
            control.setMode(cm);
        },
        setSpace(space: String) {
            var s: Space = Space.Local;
            switch (space) {
                case 'local':
                    s = Space.Local;
                    break;
                case 'world':
                    s = Space.World;
            }
            control.setSpace(s);

        },
        selectObject(gameObject: GameObject) {

            if (gameObject != undefined) {
                selectedObject = gameObject;
                this.selectedObjectRef = selectedObject;
                control.attach(gameObject);
            } else {
                alert("object not found");
            }

            // var f = document.getElementById("fsm-name");
            // if (gameObject.finiteStateMachines.length == 0) {
            //     // @ts-ignore
            //     f.innerHTML = "Aucun Automate Fini dans cet objet";
            //     // @ts-ignore
            //     fsmEditor.style.display = 'none';
            // } else {
            //     // @ts-ignore
            //     f.innerHTML = gameObject.name + "->" + gameObject.finiteStateMachines[0].name + "->StateA";

            // }

        }
    },

}

function initEditor() {

    const renderer = Renderer.getRenderer();
    const camera = Renderer.getCamera();
    const scene = Renderer.getMainScene();

    scene.background = new THREE.Color(0xb0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    control = new TransformControls(camera, renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.MIDDLE,
        RIGHT: THREE.MOUSE.PAN
    };
    orbit.update();
    orbit.addEventListener('change', Renderer.updateRender);


    // control.addEventListener('change', engine.render);
    control.addEventListener('dragging-changed', (event: any) => {
        orbit.enabled = !event.value;
    });
    control.setSize(1.5);
    control.setSpace(Space.Local);

    control.setScaleSnap(0.01);
    scene.add(control);

    // ground
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;

    scene.add(mesh);

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

    const playerCarGO = new GameObject('Player Car');
    var car: Car = new Car();

    playerCarGO.addFSM('PlayerCar State Machine');

    scene.add(car);

    car.scale.set(0.025, 0.025, 0.025);

    playerCarGO.attach(car);

    scene.add(playerCarGO);

   // selectObject(playerCarGO);

}


function traverseTest() {
    console.log("mody");
}



// engine.camera.position.z = 5;

// var demoWorkspace;
// var codeEditor;


// // private addFSMBtn = document.getElementById('addFSMBtn');
// // private componentsList = document.getElementById('componentsList');


// var selectedObject: GameObject;
// function getSelectedObject(): GameObject {
//     return this.currGameObject;
// }

// var stateAJSONFile: string = 'src/gameProjects/runTraffic/Assets/FSM States/StateA.json';


// // IMPORT TOOLBOX
// var ajax = new XMLHttpRequest();
// ajax.open("GET", "src/blocks/toolbox.xml", false);
// ajax.send();
// document.body.innerHTML += ajax.responseText;

// const toolbox = document.getElementById('toolbox');

// console.log(toolbox);

// // var toolbox = {
// //     "kind": "flyoutToolbox",
// //     "contents": [
// //       {
// //         "kind": "block",
// //         "type": "controls_if"
// //       },
// //       {
// //         "kind": "block",
// //         "type": "controls_repeat_ext"
// //       },
// //       {
// //         "kind": "block",
// //         "type": "logic_compare"
// //       },
// //       {
// //         "kind": "block",
// //         "type": "math_number"
// //       },
// //       {
// //         "kind": "block",
// //         "type": "math_arithmetic"
// //       },
// //       {
// //         "kind": "block",
// //         "type": "text"
// //       },
// //       {
// //         "kind": "block",
// //         "type": "text_print"
// //       },
// //     ]
// //   }

// const options = {
//     theme: LusineBlocksDarkTheme,
//     toolbox: toolbox,
//     grid: {
//         spacing: 25,
//         length: 3,
//         colour: '#ccc',
//         snap: true,
//     },
//     zoom: {
//         controls: true,
//         wheel: true,
//         startScale: 1,
//         maxScale: 3,
//         minScale: 0.3,
//         scaleSpeed: 1.2
//     },
//     collapse: true,
//     comments: true,
//     disable: true,
//     maxBlocks: Infinity,
//     trashcan: true,
//     toolboxPosition: 'start',
//     css: true,
//     // media : 'https://blockly-demo.appspot.com/static/media/',
//     rtl: false,
//     scrollbars: true,
//     oneBasedIndex: true
// };


// // this.codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor') as HTMLTextAreaElement, {
// //     lineNumbers: true,
// //     mode: 'javascript',
// //     theme: 'dracula'
// // });




// // const stateA_workspace = document.getElementById("stateA_workspace") as string | Element;
// // if(!stateA_workspace) {
// //     this.demoWorkspace = Blockly.inject(stateA_workspace, options as any)
// //     this.demoWorkspace.addChangeListener(this.onChangeWorkspace);
// // }
// // else{
// //     console.error('workspace id not found');
// // }



// // Cacher la première catégorie quand on edite un FSM State
// // const getToolbox: any = this.demoWorkspace.getToolbox();
// // const fsmCategory = getToolbox.getToolboxItems()[0];
// // fsmCategory.hide();


// var json: any;

// var gameObjectToExport: GameObject | undefined;
// var outputGameObject: GameObject | undefined;




// function onChangeWorkspace(event: { type: string; }) {

//     // @ts-ignore
//     let workspaceCode = Blockly.JavaScript.workspaceToCode(Editor.getInstance().demoWorkspace);

//     // @ts-ignore
//     if (Editor.getInstance().playerCarGO)
//         // @ts-ignore
//         Editor.getInstance().playerCarGO.finiteStateMachines[0].getCurrState().code = workspaceCode;

//     // document.getElementById('code-editor-test').value = workspaceCode;
//     // @ts-ignore
//     Editor.getInstance().codeEditor.setValue(workspaceCode);

//     //console.log(event);

//     if (event.type == Blockly.Events.BLOCK_MOVE) {
//         // @ts-ignore
//         Editor.getInstance().saveDemoWorkspace();
//     }
// }

// function openDemoWorkspace() {
//     fs.readFile(this.stateAJSONFile, 'utf8', (err: any, data: any) => {
//         if (err) {
//             console.error(err);
//             alert("Une erreur c'est produite pendant l'ouverture de StateA :\n\n" + err);
//             return;
//         }

//         Blockly.serialization.workspaces.load(JSON.parse(data), this.demoWorkspace);
//     });
// }

// function saveDemoWorkspace() {

//     const json = Blockly.serialization.workspaces.save(this.demoWorkspace);

//     fs.writeFile(
//         this.stateAJSONFile,
//         JSON.stringify(json), (err: any) => {
//             if (err) {
//                 console.error(err);
//             }
//         }


//     );

// }


// function saveSceneToJSON(scene: any) {
//     this.json = scene.toJSON();
// }

// // saveGameObjectToJSON() {
// //     //this.json = JSON.stringify(gameObject);
// //     if (this.gameObjectToExport) {
// //         this.json = this.gameObjectToExport.toJSON();
// //     } else {
// //         console.error('gameObjectToExport is undefined');
// //     }
// //     console.log(this.json);
// // }

// function loadGameObjectFromJSON() {

//     if (this.json) {
//         const jsonString = JSON.stringify(this.json);
//         var loadedGeometry = JSON.parse(jsonString);
//         var loader = new THREE.ObjectLoader();

//         //this.outputGameObject = loader.parse(loadedGeometry);
//         //this.loadedMesh.position.x -= 50;
//     }
// }

</script>


