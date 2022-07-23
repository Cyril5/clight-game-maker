//import DarkTheme from '../node_modules/@blockly/theme-dark/src/index.js';
import LusineBlocksDarkTheme from './blocks/themes/lusine-gm-dark'
import Blockly, { WorkspaceSvg } from 'blockly';

import {GameObject} from './gameObject';
import THREE from 'three';
import * as fs from 'fs';
import CodeMirror from 'codemirror';

export class Editor {

    demoWorkspace: any | undefined;
    codeEditor;

    selectedObject : GameObject | undefined;

    private addFSMBtn = document.getElementById('addFSMBtn');
    private componentsList = document.getElementById('componentsList');

    private static instance: Editor | undefined;

    static getInstance(): Editor | undefined {
        return this.instance;
    }

    private stateAJSONFile : string  = 'src/gameProjects/runTraffic/Assets/FSM States/StateA.json';

    playerCarGO: GameObject | undefined;

    constructor() {

        // @ts-ignore
        this.addFSMBtn.addEventListener('click', ()=>{
            // @ts-ignore
            this.selectedObject.addFSM(selectedObject.name+' AF');
            this.refreshFSMComponents();
        });

        // IMPORT TOOLBOX
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "src/blocks/toolbox.xml", false);
        ajax.send();
        document.body.innerHTML += ajax.responseText;

        // init singleton
        if (!Editor.instance)
            Editor.instance = this;

        const toolbox = document.getElementById('toolbox');

        console.log(toolbox);

        // var toolbox = {
        //     "kind": "flyoutToolbox",
        //     "contents": [
        //       {
        //         "kind": "block",
        //         "type": "controls_if"
        //       },
        //       {
        //         "kind": "block",
        //         "type": "controls_repeat_ext"
        //       },
        //       {
        //         "kind": "block",
        //         "type": "logic_compare"
        //       },
        //       {
        //         "kind": "block",
        //         "type": "math_number"
        //       },
        //       {
        //         "kind": "block",
        //         "type": "math_arithmetic"
        //       },
        //       {
        //         "kind": "block",
        //         "type": "text"
        //       },
        //       {
        //         "kind": "block",
        //         "type": "text_print"
        //       },
        //     ]
        //   }

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


        this.codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor') as HTMLTextAreaElement, {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'dracula'
        });




        const stateA_workspace = document.getElementById("stateA_workspace") as string | Element;
        this.demoWorkspace = Blockly.inject(stateA_workspace, options as any)

        this.demoWorkspace.addChangeListener(this.onChangeWorkspace);



        // Cacher la première catégorie quand on edite un FSM State
        const getToolbox : any = this.demoWorkspace.getToolbox();
        const fsmCategory = getToolbox.getToolboxItems()[0];
        fsmCategory.hide();

        this.openDemoWorkspace();
    }

    // met à jour la liste des fsm de l'objet séléctionné
    refreshFSMComponents() {
        this.selectedObject?.finiteStateMachines.forEach(fsm => {
            
        });
    }

    json: any;

    gameObjectToExport: GameObject | undefined;
    outputGameObject: GameObject | undefined;

    onChangeWorkspace(event: { type: string; }) {

        // @ts-ignore
        let workspaceCode = Blockly.JavaScript.workspaceToCode(Editor.getInstance().demoWorkspace);

        // @ts-ignore
        if (Editor.getInstance().playerCarGO)
        // @ts-ignore
            Editor.getInstance().playerCarGO.finiteStateMachines[0].getCurrState().code = workspaceCode;

        // document.getElementById('code-editor-test').value = workspaceCode;
        // @ts-ignore
        Editor.getInstance().codeEditor.setValue(workspaceCode);

        //console.log(event);

        if (event.type == Blockly.Events.BLOCK_MOVE) {
            // @ts-ignore
            Editor.getInstance().saveDemoWorkspace();
        }
    }

    openDemoWorkspace() {
        fs.readFile(this.stateAJSONFile, 'utf8', (err: any, data: any) => {
            if (err) {
                console.error(err);
                alert("Une erreur c'est produite pendant l'ouverture de StateA :\n\n" + err);
                return;
            }

            Blockly.serialization.workspaces.load(JSON.parse(data), this.demoWorkspace);
        });
    }

    saveDemoWorkspace() {

        const json = Blockly.serialization.workspaces.save(this.demoWorkspace);

        fs.writeFile(
            this.stateAJSONFile,
            JSON.stringify(json), (err: any) => {
                if (err) {
                    console.error(err);
                }
            }


        );

    }


    saveSceneToJSON(scene: any) {
        this.json = scene.toJSON();
    }

    saveGameObjectToJSON() {
        //this.json = JSON.stringify(gameObject);
        if (this.gameObjectToExport) {
            this.json = this.gameObjectToExport.toJSON();
        } else {
            console.error('gameObjectToExport is undefined');
        }
        console.log(this.json);
    }

    loadGameObjectFromJSON() {

        if (this.json) {
            const jsonString = JSON.stringify(this.json);
            var loadedGeometry = JSON.parse(jsonString);
            var loader = new THREE.ObjectLoader();

            //this.outputGameObject = loader.parse(loadedGeometry);
            //this.loadedMesh.position.x -= 50;
        }
    }



}
