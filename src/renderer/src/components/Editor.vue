<template>


    <div class="container">

        <div id="objectsList">
            <h2>Objets</h2>
            <button id="selectObjABtn" v-if="objARef" @click="selectObjectA()">{{ objARef.name }} (ID:
                {{ objARef.id }}})</button>
            <div class="child" v-if="objBRef">
                <button id="selectObjBBtn" @click="selectObjectB()">{{ objBRef.name }} (ID: {{ objBRef.id
                }})</button>
            </div>
        </div>

        <div class="left">
            <button id="translateModeBtn" @click="setControlMode('Translate')">Pos</button>
            <button id="rotateModeBtn" @click="setControlMode('Rotate')">Rot</button>
            <button id="scaleModeBtn" @click="setControlMode('Scale')">Scale</button>
            <button id="localSpaceBtn" @click="setSpace('local')">Local</button>
            <button id="worldSpaceBtn" @click="setSpace('world')">Monde</button>
            <button id="startGameBtn" @click="startGame()">Start</button>
            <button id="stopGameBtn" disabled>Stop</button>

            <Renderer />

        </div>

        <div class="right">

            <PropertiesBar  :transform="transformComponent"/>

        </div>

    </div>
    <FSMEditor />



</template>

<script lang="ts">

import { reactive, ref, inject } from 'vue';

import * as THREE from 'three';

import GameObject from '../../../engine/gameObject';
import { OrbitControls } from '../../../engine/jsm/controls/OrbitControls';
import { TransformControls } from '../../../engine/jsm/controls/TransformControls';

import { Car } from '../gameProjects/runTraffic/Assets/Prefabs/car';

import Renderer from './Renderer.vue';
import PropertiesBar from './PropertiesBar.vue';
import FSMEditor from './FSMEditor.vue';


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


export default {

    name: 'Editor',
    components: {
        Renderer // obtenir l'instance de renderer
        ,
        PropertiesBar,
        FSMEditor
    },

    setup() {

        const store : any = inject('store');


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

        const selectObject = (gameObject: GameObject)=> {

            if (gameObject != undefined) {
                console.log(store);
                store.selectedObj.value = gameObject;
                // store.currentFSM.value = store.selectedObj.value.finiteStateMachines[0];
                control.attach(gameObject);
            } else {
                alert("object not found");
            }
        }

        return { 
            store,
            transformComponent, 
            selectObject,
        }
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
                        this.transformComponent.position.copy(store.selectedObj.value.position);
                        break;

                    case ControlMode.Rotate:
                        this.transformComponent.rotation.copy(store.selectedObj.value.rotation);
                        break;
                    case ControlMode.Scale:
                        this.transformComponent.scale.copy(store.selectedObj.value.scale);
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
            playerCarGO.finiteStateMachines[0].getCurrState().filename = 'src/renderer/src/gameProjects/runTraffic/Assets/FSM States/stateA.json';

            scene.add(car);

            car.scale.set(0.025, 0.025, 0.025);

            playerCarGO.attach(car);

            scene.add(playerCarGO);

            this.objARef = playerCarGO;
            this.objBRef = car;

            this.selectObject(playerCarGO);

        },
        startGame() { 
            Renderer.startGame();
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

    },
    mounted() {
        console.log("Editor mounted");
        this.initEditor();
    },


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


