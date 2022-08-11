<template>

    <div id="fsm-editor" v-if="store.currentFSM.value"> 
        <div class="group" style="display: flex; justify-content: center;">
            <h3 id="fsm-name" style="color: #fff;">{{ store.currentFSM.value.gameObject.name }}->{{store.currentFSM.value.name}}-></h3>
            <select name="fsm-states" id="fsm-states">
                <option value="stateA">State A</option>
            </select>
        </div>
    
        <div style="display: flex; justify-content: center;">
            <label for="avatar">Fichier de l'état :</label>
            <input type="file" id="changeStateFileBtn" @change="setStateFile" accept="application/json">
            <p>Fichier : {{ store.currentFSM.value.getCurrState().filename }}</p>
        </div>
        <!-- <button @click="executeCmd">Executer Commande</button> -->

    </div>
        <button @click="addState">Ajouter Etat</button>
        <button id="saveStateABtn" @click="saveState">Enregistrer</button>
        <button>Enregistrer Sous</button>

    <!-- Doit être déjà crée même si le fsm est null -->
    <div class="div" style="display:flex">
        <div id="state_workspace" style="width:50%;height:480px;"></div>
        <div id="wksp-toolbox"></div>
        <div class="group">
            <textarea id="code-editor"></textarea>
            <div id="console" style="width: 100%; height: 200px; background-color: black;"></div>
            <button id="clearConsoleBtn">Effacer</button>
        </div>
    </div>




</template>

<script lang="ts">
import { inject } from 'vue';
import Blockly from 'blockly';
import '../../../engine/blocks/blocksDefs';

// //import DarkTheme from '../node_modules/@blockly/theme-dark/src/index.js';
import LusineBlocksDarkTheme from '../../../engine/blocks/themes/lusine-gm-dark'

import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';

import {GameObject} from '../../../engine/gameObject';

import toolboxXml from '../assets/blocks/toolbox.xml?raw'; // ?raw to import as string

// import { Debug } from '../../../engine/debug';


let store;
let codeEditor: any;
const fs = require('fs');
let demoWorkspace : any;

export default {

    name: 'FSMEditor',
    components: {
    },

    setup() {
        store = inject('store');


        const addState = () => {
            console.log("ajout d'un etat");
            // this.fsm.addState();
        };

        const saveState = () => {
            if (store.currentFSM.value.getCurrState().filename == '') {

            }
        };

        const setStateFile = (event) => {
            console.log(event.target.value);
        }

        const executeJSCode = (code:string) => {
            setTimeout(code,0);
        }


        const executeCmd = () => {

            console.log(store.currentFSM.value);

            const g = GameObject.getById(161);
            //g.finiteStateMachines[0].getCurrState().code = "let test = require('test_require.js');";
            // g.finiteStateMachines[0].getCurrState().code += "\n\nconsole.log(GameObject.getById(161));";
            //alert(g.finiteStateMachines[0].getCurrState().code);
            //g.finiteStateMachines[0].getCurrState().runCode();

                // eval("alert(GameObject)"); // works
            console.log(store.currentFSM.value.getCurrState().runCode());

        };


        return {
            store,
            addState,
            saveState,
            setStateFile,
            executeCmd,
        }

    },
loadState(){

    if(!store) {
        alert("store is undefined \n Veuillez recommencer l'opération");
        return;
    }

    demoWorkspace.clear();
    if (store.currentFSM.value.getCurrState().filename != '') {
        fs.readFile(store.currentFSM.value.getCurrState().filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                alert("Une erreur c'est produite pendant l'ouverture de StateA :\n\n" + err);
                return;
            }

            Blockly.serialization.workspaces.load(JSON.parse(data), demoWorkspace);
        });
    }
},
    mounted() {
        // All Components are ready

        console.log('fsm editor mounted');

        //IMPORT TOOLBOX
        // const ajax = new XMLHttpRequest();
        // ajax.open("GET", "./assets/blocks/toolbox.xml", false);
        // ajax.send();

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

        const state_workspace = document.getElementById("state_workspace") as string | Element;

        const saveWorkspace = () => {
            const json = Blockly.serialization.workspaces.save(store.workspaceState.value);

            fs.writeFile(
                store.currentFSM.value.filename, JSON.stringify(json), err => {
                    if (err) {
                        alert("Une erreur c'est produite pendant la sauvegarde de StateA :\n\n" + err);
                        console.log(err);
                    }
                }
            );
        };

        const onChangeWorkspace = (event: { type: string; }) => {

            let workspaceCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

            store.currentFSM.value.getCurrState().code = workspaceCode;

            codeEditor.setValue(workspaceCode);

            if (event.type == Blockly.Events.BLOCK_MOVE) {
                if (store.currentFSM.value.getCurrState().filename != '') {
                    //saveWorkspace();
                }
            }
        }


        if (state_workspace) {
            demoWorkspace = Blockly.inject(state_workspace, options as any)
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



    }
}





</script>