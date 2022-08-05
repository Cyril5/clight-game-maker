<template>


    <div class="container">

        <div id="objectsList">
            <h2>Objets</h2>
            <button id="selectObjABtn" v-if="objARef" v-on:click="selectObjectA()">{{ objARef.name }} (ID:
                {{ objARef.id }}})</button>
            <div class="child" v-if="objBRef">
                <button id="selectObjBBtn" v-on:click="selectObjectB()">{{ objBRef.name }} (ID: {{ objBRef.id
                }})</button>
            </div>
        </div>

        <div class="left">
            <button id="translateModeBtn" v-on:click="setControlMode('Translate')">Pos</button>
            <button id="rotateModeBtn" v-on:click="setControlMode('Rotate')">Rot</button>
            <button id="scaleModeBtn" v-on:click="setControlMode('Scale')">Scale</button>
            <button id="localSpaceBtn" v-on:click="setSpace('local')">Local</button>
            <button id="worldSpaceBtn" v-on:click="setSpace('world')">Monde</button>
            <button id="startGameBtn" v-on:click="startGame()">Start</button>
            <button id="stopGameBtn" disabled>Stop</button>

            <Renderer />

        </div>

        <div class="right">

            <PropertiesBar v-if="selectedObjRtv" :obj="selectedObjRtv" :transform="transformComponent" />

        </div>

    </div>
    <FSMEditor v-if="fsmComponent.fsm" :fsm="fsmComponent.fsm"/>



</template>

<script lang="ts">

import { reactive, ref } from 'vue';

import * as THREE from 'three';

import GameObject from '../../../engine/gameObject';
import { OrbitControls } from '../../../engine/jsm/controls/OrbitControls';
import { TransformControls } from '../../../engine/jsm/controls/TransformControls';
import * as fs from 'fs';

import { Car } from '../gameProjects/runTraffic/Assets/Prefabs/car';

import Renderer from './Renderer.vue';
import PropertiesBar from './PropertiesBar.vue';
import FSMEditor from './FSMEditor.vue';
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm';

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
let codeEditor: any;
// let demoWorkspace: any;

export default {

    name: 'Editor',
    components: {
        Renderer // obtenir l'instance de renderer
        ,
        PropertiesBar,
        FSMEditor
    },

    setup() {
        console.log("setup editor");

        //return { count, controlRef, selectedObjectState }
        // const transformRtv = reactive({
        //     position: new THREE.Vector3,
        // })
        let transformComponent = reactive({
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Vector3(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
        });

        let fsmComponent = reactive({
            fsm: null
        })

        let selectedObjRtv = ref(null);


        return { selectedObjRtv, transformComponent,fsmComponent }
    },
    data() {
        return {
            objARef: ref(null),
            objBRef: ref(null),
        }
    },
    methods: {
        initEditor() {

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
            control.addEventListener('objectChange', (event: any) => {

                switch (control.mode) {
                    case ControlMode.Translate:
                        this.transformComponent.position.copy(selectedObject.position);
                        break;

                    case ControlMode.Rotate:
                        this.transformComponent.rotation.copy(selectedObject.rotation);
                        break;
                    case ControlMode.Scale:
                        this.transformComponent.scale.copy(selectedObject.scale);
                        break;
                }

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

            this.objARef = playerCarGO;
            this.objBRef = car;

            this.selectObject(playerCarGO);


            // }
            // else {
            //     console.error('workspace id not found');
            // }




        },
        startGame() {
            selectedObject.saveTransform();

            for (const go of GameObject.gameObjects) {
                const value = go[1]; // map value
                //if(value.length > 0) {
                console.log(value.finiteStateMachines);

                for(const fsm of value.finiteStateMachines) {
                    console.log(fsm);
                    if (fsm.enabled) {
                        fsm.start();
                        console.log(fsm.getCurrState().code);
                    }
                }
            }

            // GameObject.gameObjects.forEach(element => {
            //     console.log(element.finiteStateMachines);
            // });

            // Engine.clock.start();
            // Engine.gameIsRunning = true;
        },
        selectObjectA() {
            // for (const entry of GameObject.gameObjects) {

            //     console.log(entry);
            // }
            this.selectObject(GameObject.getById(161));
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
                this.selectedObjRtv = selectedObject;
                this.fsmComponent.fsm = selectedObject.finiteStateMachines[0];
                control.attach(gameObject);
            } else {
                alert("object not found");
            }
        }
    },
    mounted() {
        console.log("Editor mounted");
        this.initEditor();
    },
    getSelectedObject() {
        return selectedObject;
    }

}

// var stateAJSONFile: string = 'src/gameProjects/runTraffic/Assets/FSM States/StateA.json';




// var json: any;

// var gameObjectToExport: GameObject | undefined;
// var outputGameObject: GameObject | undefined;






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


