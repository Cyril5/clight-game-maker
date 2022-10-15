<template>

    <ObjectsViewer/>

    <div class="tabs">
        <button @click="openProject()" v-if="store.editorMode.value!='GAME_RUNNING'">
            <font-awesome-icon icon="fa-solid fa-folder-open" /> Ouvrir
        </button>

        <button @click="setEditorMode('LEVEL')" v-if="store.editorMode.value!='GAME_RUNNING'">
            <font-awesome-icon icon="fa-solid fa-chess-knight" /> Editeur de niveau
        </button>
        <button @click="setEditorMode('FSM_STATES')" v-if="store.editorMode.value!='GAME_RUNNING'">Editeur
            d'états</button>
        <button id="startGameBtn" @click="startGame()" v-if="store.editorMode.value!='GAME_RUNNING'">
            <font-awesome-icon icon="fa-solid fa-play" />
        </button>
        <button id="stopGameBtn" @click="stopGame()" v-if="store.editorMode.value=='GAME_RUNNING'">
            <font-awesome-icon icon="fa-solid fa-stop" />
        </button>
    </div>

    <div class="state-editor-tab" v-show="store.editorMode.value === 'FSM_STATES'">
        <StatesEditor />
    </div>

    <div class="level-editor-tab"
        v-show="store.editorMode.value === 'LEVEL' || store.editorMode.value === 'GAME_RUNNING'">
        <div class="container">

            <div id="objectsList" v-if="store.editorMode.value!='GAME_RUNNING'">
                <ObjectsList />
            </div>

            <div class="left">
                <button id="translateModeBtn" @click="setControlMode('Translate')">
                    <font-awesome-icon icon="fa-solid fa-up-down-left-right" />
                </button>
                <button id="rotateModeBtn" @click="setControlMode('Rotate')">
                    <font-awesome-icon icon="fa-solid fa-rotate" />
                </button>
                <button id="scaleModeBtn" @click="setControlMode('Scale')">
                    <font-awesome-icon icon="fa-solid fa-maximize" />
                </button>
                <button id="localSpaceBtn" @click="setSpace('local')">Local</button>
                <button id="worldSpaceBtn" @click="setSpace('world')">Monde
                    <font-awesome-icon icon="fa-solid fa-earth-europe" />
                </button>


                <Renderer />

            </div>

            <div class="right" v-show="store.editorMode.value!='GAME_RUNNING'">

                <PropertiesBar />

            </div>

        </div>
        <FSMEditor v-show="store.editorMode.value!='GAME_RUNNING'"/>

    </div>

    <div class="group">

        <div id="console" style="width: 100%; height: 200px; background-color: black;"></div>
        <button id="clearConsoleBtn">Effacer</button>
    </div>




</template>

<script lang="ts">


import { inject } from 'vue';

import * as THREE from 'three';

import { GameObject } from '../../../engine/gameObject';
import { OrbitControls } from '@engine/jsm/controls/OrbitControls';
import { TransformControls } from '@engine/jsm/controls/TransformControls';
import { Debug } from '@engine/debug';
import { StateFile } from '@engine/statesmachine/stateFile';
import IPCRenderersEditor from '@renderer/ipc-renderers-editor';

import Renderer from './Renderer.vue';
import PropertiesBar from './PropertiesBar.vue';
import FSMEditor from './FSMEditor.vue';
import StatesEditor from './StatesEditor.vue';
import ObjectsList from './ObjectsList.vue';
import { RendererManager } from '@renderer/rendererManager';
import ObjectsViewer from './ObjectsViewer.vue';
import { Game } from '@engine/game';


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

let gameObjectsLstRef;

export default {

    name: 'Editor',
    components: {
    Renderer // obtenir l'instance de renderer
    ,
    PropertiesBar,
    FSMEditor,
    StatesEditor,
    ObjectsList,
    ObjectsViewer
},
    setup() {

        const { ipcRenderer } = require('electron');


        store = inject('store');

        console.log("setup editor");


        // const selectObject = (gameObject: GameObject) => {

        //     this.methods.selectObject(gameObject);
        // }

        const startGame = () => {
            store.editorMode.value = "GAME_RUNNING";
            console.log("Game Started");
            Renderer.startGame();
        }

        const stopGame = () => {
            store.editorMode.value = "LEVEL";
            console.log("Game Stoped");
            Renderer.stopGame();
        }

        const setEditorMode = (mode: string) => {
            store.editorMode.value = mode;
        }

        const openProject = ()=>{
            ipcRenderer.invoke('openProject');
        }

        new IPCRenderersEditor();



        return {
            store,
            setEditorMode,
            startGame,
            stopGame,
            gameObjectsLstRef,
            editorMode: EditorMode,
            openProject
        }
    },
    methods: {
        // selectObject(uuid:string) {
        //     this.selectObject(GameObject.gameObjects.get(uuid))
        // },
        selectObject(gameObject: GameObject |undefined) {
            if (gameObject) {
                store.editorRtv.selectedObj = gameObject;
                // store.currentFSM.value = store.editorRtv.selectedObj.finiteStateMachines[0];
                control.attach(gameObject.transform);
            } else {
                alert("object not found");
            }
        },
        addStateToList(stateFile: StateFile) { // Ajoute un state à la liste global des états
            store.editorRtv.states.set(stateFile.getFileName(), stateFile);
        },
        setParentToObject(source: GameObject, parent: GameObject) {
            source.transform.parent = parent.transform;
        },
        initEditor() {

            const renderer = RendererManager.getInstance().renderer;
            const camera = RendererManager.getInstance().camera;
            const scene = RendererManager.getInstance().scene;

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

            control.name = "LGM_CONTROL";

            control.setSize(1.5);
            control.setSpace(Space.Local);

            control.setScaleSnap(0.01);
            scene.add(control);

            const grid = new THREE.GridHelper(10, 20, 0x000000, 0x000000);
            // grid.material.opacity = 0.2;
            // grid.material.transparent = true;
            grid.name = "LGM_GRID";
            scene.add(grid);

            Game.getInstance();



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

    #stopGameBtn {
        background-color: red;
    }

    button {
        background-color: green;
    }
}
</style>
