<template>
    <div class="tabs">
        <button @click="setEditorMode('LEVEL')">Editeur de niveau</button>
        <button @click="setEditorMode('FSM_STATES')">Editeur d'états</button>
        <button id="startGameBtn" @click="startGame()">Start</button>
        <button id="stopGameBtn" disabled>Stop</button>
    </div>

    <div class="state-editor-tab" v-show="store.editorMode.value === 'FSM_STATES'">
        <StatesEditor />
    </div>

    <div class="level-editor-tab" v-show="store.editorMode.value === 'LEVEL'">
        <div class="container">

            <div id="objectsList">
                <h2>Objets</h2>
                <!-- <h2>SIZE : {{gameObjectsLstRef}}</h2> -->

                <!-- <h2 v-if="objARef">TEST : {{objARef.name}}</h2> -->

                <div v-for="[key, go] in gameObjectsLstRef">
                    <button v-if="go.parent.type === 'Scene'" @click="selectObject(go)">{{ go.name }} (ID:
                        {{ go.id }})</button>
                    <button class="child" v-for="child in go.children" @click="selectObject(child)">{{ child.name
                    }}</button>
                </div>

                <!-- <button v-if="objARef.value" @click="selectObjectA()">{{ objARef.value.name }}</button> -->
            </div>

            <div class="left">
                <button id="translateModeBtn" @click="setControlMode('Translate')">Pos</button>
                <button id="rotateModeBtn" @click="setControlMode('Rotate')">Rot</button>
                <button id="scaleModeBtn" @click="setControlMode('Scale')">Scale</button>
                <button id="localSpaceBtn" @click="setSpace('local')">Local</button>
                <button id="worldSpaceBtn" @click="setSpace('world')">Monde</button>


                <Renderer />

            </div>

            <div class="right">

                <PropertiesBar :transform="transformComponent" />

            </div>

        </div>
        <FSMEditor />

    </div>

    <div class="group">

        <div id="console" style="width: 100%; height: 200px; background-color: black;"></div>
        <button id="clearConsoleBtn">Effacer</button>
    </div>




</template>

<script lang="ts">

import { reactive, ref, inject } from 'vue';

import * as THREE from 'three';

import { GameObject } from '../../../engine/gameObject';
import { OrbitControls } from '../../../engine/jsm/controls/OrbitControls';
import { TransformControls } from '../../../engine/jsm/controls/TransformControls';

import Renderer from './Renderer.vue';
import PropertiesBar from './PropertiesBar.vue';
import FSMEditor from './FSMEditor.vue';
import StatesEditor from './StatesEditor.vue';
import { Debug } from '../../../engine/debug';
import { StateFile } from '../../../engine/statesmachine/stateFile';

let store: any;

enum EditorMode {
    Level = 'LEVEL',
    FSMStates = 'FSM_STATES',
    GameRunning = 'GAME_RUNNING'
}

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

let objARef;

// let objBRef;
let gameObjectsLstRef;

export default {

    name: 'Editor',
    components: {
        Renderer // obtenir l'instance de renderer
        ,
        PropertiesBar,
        FSMEditor,
        StatesEditor,
    },
    setup() {

        objARef = ref<GameObject>();
        gameObjectsLstRef = ref();

        console.log(objARef);

        store = inject('store');

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

        const selectObject = (gameObject: GameObject) => {

            if (gameObject != undefined) {
                store.selectedObj.value = gameObject;
                // store.currentFSM.value = store.selectedObj.value.finiteStateMachines[0];
                control.attach(gameObject);
            } else {
                alert("object not found");
            }
        }

        const startGame = () => {
            store.editorMode.value = "LEVEL";
            console.log("Game Started");
            Renderer.startGame();
        }

        const setEditorMode = (mode: string) => {
            store.editorMode.value = mode;
        }

        return {
            store,
            objARef,
            transformComponent,
            selectObject,
            setEditorMode,
            startGame,
            gameObjectsLstRef,
            editorMode: EditorMode,
        }
    },
    methods: {
        setObjARef(go: GameObject) {
            objARef.value = go;
        },
        getObjBRef() { return objBRef },

        addStateToList(stateFile: StateFile) { // Ajoute un state à la liste global des états
            store.editorRtv.states.push(stateFile);
        },

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

            const grid = new THREE.GridHelper(10, 20, 0x000000, 0x000000);
            // grid.material.opacity = 0.2;
            // grid.material.transparent = true;
            scene.add(grid);



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

        // A Améliorer
        setInterval(() => {
            gameObjectsLstRef.value = new Map(GameObject.gameObjects);
        }, 1000)

        window.addEventListener('error', (event) => {
            Debug.writeInConsole(event.type + ' ' + event.message, '#ff0000');
        });


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

<style lang="scss">
.tabs {
    width: 100%;
    text-align: center;

    button {
        background-color: green;
    }
}
</style>
