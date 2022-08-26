<template>
    <h2>Editeur d'états</h2>
    <div style="display: flex; justify-content: center;">
        <p>Fichier : {{ store.statesEditorRtv.currState.filename }}</p>
    </div>

    <button @click="createState">Nouveau</button>
    <button id="saveStateABtn" @click="saveState">Enregistrer</button>
    <button>Enregistrer Sous</button>

    <div id="blocklyArea"></div>
    <div id="state_workspace"></div>

    <div class="container">
        <div class="code">

            <textarea id="code-editor" style="width:100%;height:480px;"></textarea>
        </div>

        <div class="states-list">
            <ul>
                <li>FSM States</li>
                <li v-for="state in store.editorRtv.states"><button>{{ state.getFileName() }}</button></li>
            </ul>

        </div>
    </div>

    <div id="wksp-toolbox"></div>

</template>

<script lang="ts">
import { inject } from 'vue';
import Blockly from 'blockly';
import '../../../engine/blocks/blocksDefs';


// //import DarkTheme from '../node_modules/@blockly/theme-dark/src/index.js';
import LusineBlocksDarkTheme from '../../../engine/blocks/themes/lusine-gm-dark'
import toolboxXml from '../assets/blocks/toolbox.xml?raw'; // ?raw to import as string

import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';
import { Project } from '@renderer/project';
import Editor from '@renderer/components/Editor.vue';
import { StateFile } from '../../../engine/statesmachine/stateFile';
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm';
import { load } from 'core/serialization/workspaces';

const fs = require('fs');

let store: any;
let workspaceBlocks;
let currStateFile;
let codeEditor: any;

export default {

    name: 'StatesEditor',
    components: {
        //Editor
    },
    setup() {
        store = inject('store');

        const saveState = () => {
            store.statesEditorRtv.currState.generateCode();
        }

        const createState = () => {
            console.log('creating state file');
            const filename = 'State' + Project.lastStateFileId;
            Project.createStateFile(filename);

            const stateFile = new StateFile(filename);

            Editor.methods.addStateToList(stateFile);

            loadState(stateFile);

        }

        return {
            store,
            saveState,
            createState,
        }
    },

    updateStateCode() {
        currStateFile = store.statesEditorRtv.stateFile;

        // 1 : rechercher tous les états (dans chaques fsm) qui ont le state file en cours d'enregistrement
        const finiteStateMachines = FiniteStateMachine.getAll();
        for (const fsm of finiteStateMachines) {
            for (const state of fsm) {
                if (state.stateFile == currState) {
                    state.code = Blockly.JavaScript.workspaceToCode(workspaceBlocks);
                }
            }
        }
    },
    loadState(stateFile: StateFile) {

        store.editorMode.value = 'FSM_STATES';

        store.statesEditorRtv.currState = stateFile;

        currStateFile = store.statesEditorRtv.currState;



        //TODO : vérifier si il y a déjà un state ouvert dans l'éditeur avant de remplacer 
        if (!store.statesEditorRtv.currState) {

        }

        fs.readFile(currStateFile.filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                alert("Une erreur c'est produite pendant l'ouverture de " + currStateFile + " :\n\n" + err);
                return;
            }

            Blockly.serialization.workspaces.load(JSON.parse(data), workspaceBlocks);
        });

    },
    mounted() {
        console.log("states editor mounted");
        codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor') as HTMLTextAreaElement, {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'dracula'
        });
        // NE pas mettre d'autres éléments html sur cet div 
        document.getElementById('wksp-toolbox').innerHTML += toolboxXml;

        const toolbox = document.getElementById('toolbox'); // récupère l'id toolbox du fichier xml

        // const toolboxTest = {
        //     "kind": "flyoutToolbox",
        //     "contents": [
        //         {
        //             "kind": "block",
        //             "type": "controls_if"
        //         },
        //         {
        //             "kind": "block",
        //             "type": "controls_repeat_ext"
        //         },
        //         {
        //             "kind": "block",
        //             "type": "logic_compare"
        //         },
        //         {
        //             "kind": "block",
        //             "type": "math_number"
        //         },
        //         {
        //             "kind": "block",
        //             "type": "math_arithmetic"
        //         },
        //         {
        //             "kind": "block",
        //             "type": "text"
        //         },
        //         {
        //             "kind": "block",
        //             "type": "text_print"
        //         },
        //     ]
        // }

        const options = {
            theme: LusineBlocksDarkTheme,
            toolbox: toolbox,
            grid: {
                spacing: 25,
                length: 3,
                colour: '#ccc',
                snap: true,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            collapse: true,
            comments: true,
            disable: true,
            maxBlocks: Infinity,
            trashcan: true,
            toolboxPosition: 'start',
            css: true,
            // media : 'https://blockly-demo.appspot.com/static/media/',
            rtl: false,
            scrollbars: true,
            oneBasedIndex: true
        };

        const onChangeWorkspace = (event: { type: string; }) => {

            let workspaceCode = Blockly.JavaScript.workspaceToCode(workspaceBlocks);

            codeEditor.setValue(workspaceCode);

            // AUTO SAVE
            // if (event.type == Blockly.Events.BLOCK_MOVE) {
            //     if (store.currentFSM.value.getBaseState().filename != '') {
            //         saveWorkspace();
            //     }
            // }
        }

        const blocklyArea = document.getElementById("blocklyArea");


        const state_workspace = document.getElementById("state_workspace") as string | Element;

        if (state_workspace) {
            workspaceBlocks = Blockly.inject(state_workspace, options as any)
            workspaceBlocks.addChangeListener(onChangeWorkspace);
        }

        const onResize = () => {
            // Compute the absolute coordinates and dimensions of blocklyArea.
            let element = blocklyArea;
            let x = 0;
            let y = 0;

            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element = element.offsetParent;
            } while (element);

            // Position blocklyDiv over blocklyArea.
            state_workspace.style.left = x + 'px';
            state_workspace.style.top = y + 'px';
            state_workspace.style.width = blocklyArea.offsetWidth + 'px';
            state_workspace.style.height = blocklyArea.offsetHeight + 'px';
            Blockly.svgResize(workspaceBlocks);
        };
        window.addEventListener('resize', onResize, false);
        onResize();
        Blockly.svgResize(workspaceBlocks);


        //Cacher la première catégorie quand on edite un FSM State
        const getToolbox: any = workspaceBlocks.getToolbox();
        const fsmCategory = getToolbox.getToolboxItems()[0];
        fsmCategory.hide();


    }
}
</script>

<style lang="scss">
#state_workspace {
    //position the blocklyDiv element over the blocklyArea element.
    position: absolute;
    left: 0px;
    top: 0px;
    // height: 80vh;
    // width: 100%;
}

#blocklyArea {
    height: 80vh;
}

.container {
    display: flex;

    .code {
        width: 75%;
    }
}
</style>