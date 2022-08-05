<template>
    <div id="fsm">

        <div class="group" style="display: flex; justify-content: center;">
            <h3 id="fsm-name" style="color: #fff;">{{ fsm.gameObject.name }}->{{ fsm.name }}-></h3>
            <select name="fsm-states" id="fsm-states">
                    <option value="stateA">State A</option>
                </select>
        </div>
                    <div style="display: flex; justify-content: center;">
            <p>Fichier : Assets/FSM States/stateA.json</p>
            <button id="changeStateFileBtn">Changer</button>
        </div>


        <button v-on:click="addState">Ajouter Etat</button>
        <button id="saveStateABtn">Enregistrer</button>
        <button>Enregistrer Sous</button>



        <div style="display:flex;">

            <div id="stateA_workspace" style="width:50%;height:480px;"></div>

            <div class="group">
                <textarea id="code-editor"></textarea>
                <div id="console" style="width: 100%; height: 200px; background-color: black;"></div>
                <button id="clearConsoleBtn">Effacer</button>
            </div>

        </div>

        <button v-on:click="executeCmd">Executer Commande</button>
    </div>
</template>

<script lang="ts">
import Editor from './Editor.vue';
import Blockly from 'blockly';
import '../../../engine/blocks/blocksDefs';
// import 'blockly/blockly_compressed.js';
// import 'blockly/blocks_compressed.js';

// //import DarkTheme from '../node_modules/@blockly/theme-dark/src/index.js';
import LusineBlocksDarkTheme from '../../../engine/blocks/themes/lusine-gm-dark'

import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';
import GameObject from '../../../engine/gameObject';
import { FiniteStateMachine } from '../../../engine/statesmachine/fsm';

let codeEditor: any;
let demoWorkspace: any;

export default {

    name: 'FSMEditor',
    components: {
    },

    setup() {


    },
    data() {
        return {
        }
    },
    methods: {
        addState() {
            console.log("ajout d'un etat");
            // this.fsm.addState();
        },
        executeCmd() {
            const g = GameObject.getById(161);
            g.finiteStateMachines[0].getCurrState().code = "let test = require('./test_require.js');";
            // g.finiteStateMachines[0].getCurrState().code += "\n\nconsole.log(GameObject.getById(161));";
            alert(g.finiteStateMachines[0].getCurrState().code);
            g.finiteStateMachines[0].getCurrState().runCode();
        }
    },
    props: {
        fsm: null,
    },
    mounted() {

        //IMPORT TOOLBOX
        const ajax = new XMLHttpRequest();
        ajax.open("GET", "src/assets/blocks/toolbox.xml", false);
        ajax.send();
        //document.body.innerHTML += ajax.responseText;
        document.getElementById('fsm').innerHTML += ajax.responseText;

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

        const stateA_workspace = document.getElementById("stateA_workspace") as string | Element;
        if (stateA_workspace) {
            demoWorkspace = Blockly.inject(stateA_workspace, options as any)
            demoWorkspace.addChangeListener(onChangeWorkspace);
        }

        //Cacher la première catégorie quand on edite un FSM State
        const getToolbox: any = demoWorkspace.getToolbox();
        const fsmCategory = getToolbox.getToolboxItems()[0];
        fsmCategory.hide();

        codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor') as HTMLTextAreaElement, {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'dracula'
        });
    },


}

function onChangeWorkspace(event: { type: string; }) {

    // @ts-ignore
    let workspaceCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    // // @ts-ignore
    // if (Editor.getInstance().playerCarGO)
    //     // @ts-ignore

    Editor.getSelectedObject().finiteStateMachines[0].getCurrState().code = workspaceCode;

    codeEditor.setValue(workspaceCode);

    //console.log(event);

    if (event.type == Blockly.Events.BLOCK_MOVE) {
        // @ts-ignore
        //Editor.getInstance().saveDemoWorkspace();
    }
}



</script>