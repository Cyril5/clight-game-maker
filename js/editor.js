//import DarkTheme from '../node_modules/@blockly/theme-dark/src/index.js';
import LusineBlocksDarkTheme from './blocks/themes/lusine-gm-dark/index.js'

class Editor {

    demoWorkspace;
    codeEditor;

    static instance;

    playerCarGO;

    constructor() {

        // IMPORT TOOLBOX
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "js/blocks/toolbox.xml", false);
        ajax.send();
        document.body.innerHTML += ajax.responseText;

        // init singleton
        if(!Editor.instance)
            Editor.instance = this;

        const options = {
            theme: LusineBlocksDarkTheme,
            toolbox: toolbox,
            grid: {
                spacing: 25,
                length: 3,
                colour: '#ccc',
                snap: true,
            },
            zoom : {
                controls : true, 
                wheel : true, 
                startScale : 1, 
                maxScale : 3, 
                minScale : 0.3, 
                scaleSpeed : 1.2
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


        this.codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'dracula'
        });

        this.demoWorkspace = Blockly.inject(document.getElementById("stateA_workspace"), options);




        this.demoWorkspace.addChangeListener(this.onChangeWorkspace);



        // Cacher la première catégorie quand on edite un FSM State
        const fsmCategory = this.demoWorkspace.getToolbox().getToolboxItems()[0];
        fsmCategory.hide();

        this.openDemoWorkspace();
    }

    json;

    gameObjectToExport;
    outputGameObject;

    onChangeWorkspace(event) {

        let workspaceCode = Blockly.JavaScript.workspaceToCode(Editor.instance.demoWorkspace);

        Editor.instance.playerCarGO.finiteStateMachines[0].currState.code = workspaceCode;

        // document.getElementById('code-editor-test').value = workspaceCode;
        Editor.instance.codeEditor.setValue(workspaceCode);

        //console.log(event);

        if (event.type == Blockly.Events.BLOCK_MOVE) {
            Editor.instance.saveDemoWorkspace();
        }
    }

    openDemoWorkspace() {
        fs.readFile('js/tests/gameProjects/runTraffic/Assets/FSM States/stateA.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              alert("Une erreur c'est produite pendant l'ouverture de StateA :\n\n"+err);
              return;
            }
            console.log(data);
            Blockly.serialization.workspaces.load(JSON.parse(data),this.demoWorkspace);
          });
    }

    saveDemoWorkspace() {

        const json = Blockly.serialization.workspaces.save(this.demoWorkspace);

        fs.writeFile(
            'js/tests/gameProjects/runTraffic/Assets/FSM States/stateA.json', 
            JSON.stringify(json), err=> {
                if(err) {
                    console.log(err);
                }
            }


        );

    }


    saveSceneToJSON(scene) {
        this.json = scene.toJSON();
    }

    saveGameObjectToJSON() {
        //this.json = JSON.stringify(gameObject);
        this.json = this.gameObjectToExport.toJSON();
        console.log(this.json);
    }

    loadGameObjectFromJSON() {

        if (this.json) {
            const jsonString = JSON.stringify(this.json);
            var loadedGeometry = JSON.parse(jsonString);
            var loader = new THREE.ObjectLoader();

            this.outputGameObject = loader.parse(loadedGeometry);
            //this.loadedMesh.position.x -= 50;
        }
    }



}
export { Editor }