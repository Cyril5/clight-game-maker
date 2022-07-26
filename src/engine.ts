import * as THREE from 'three';
import Stats from './jsm/libs/stats.module';

console.log("Engine ts !");

var gameIsRunning = false;

const stats = Stats();







// function animate(timestamp: any): void {

//     requestAnimationFrame(animate);

//     stats.update();
//     render();

//     if (gameIsRunning) {
//         // Game.deltaTime = this.clock.getDelta();
//         this.gameLoop();
//     }
// }




export default class Engine {

    private static instance: Engine;

    private clock = new THREE.Clock(false);
    private gameIsRunning = false;


    static getInstance(): Engine {
        console.log("init engine");
        if (this.instance===undefined)
            return this.instance = new Engine();

        return this.instance;
    }



    initEngine() {
        // if(document.getElementById('renderer') === null) {
        //     console.error('renderer dom not found')
        // }
        // const rendererDom = document.getElementById('renderer');

        // if(rendererDom) {
        //     rendererDom.appendChild(stats.dom);
        //     rendererDom.appendChild(renderer.domElement);
        // }else{
        //     console.error('renderer dom id not found');
        //     return;
        // }

        // animate(undefined);

    }

    updateRender() {
        //render();
    }

    gameLoop() {

        // if (go.finiteStateMachines[0].enabled)
        //     go.finiteStateMachines[0].runCode(demoWorkspace2);

        // @ts-ignore
        editor.playerCarGO.finiteStateMachines[0].update();
    }



    executeCommand() {

        try {
            // @ts-ignore
            eval(document.getElementById("command").value)
        } catch (error) {
            alert(error);
        }
    }


    // Button start game
    startGame() {

        console.log("Game started !");
        // @ts-ignore
        startGameBtn.disabled = true;
        // @ts-ignore
        stopGameBtn.disabled = false;
        // @ts-ignore
        fsmEditor.style.display = 'none';
        // @ts-ignore
        objectsList.style.display = 'none';

        //editor.gameObjectToExport = editor.playerCarGO;


        // editor.saveGameObjectToJSON();
        // @ts-ignore
        editor.playerCarGO.saveTransform();

        //go.finiteStateMachines[0].currState.onUpateStateWorkSpace = demoWorkspace2;
        // @ts-ignore
        if (editor.playerCarGO.finiteStateMachines[0].enabled) {
            // @ts-ignore
            editor.playerCarGO.finiteStateMachines[0].start();
        }


        this.clock.start();
        this.gameIsRunning = true;

        // TEST
        //setTimeout(stopGame,3000);

    }

    stopGame() {

        console.log("game stoped !");
        // @ts-ignore
        stopGameBtn.disabled = true;

        this.clock.stop();
        // Game.deltaTime = 0;

        this.gameIsRunning = false;
        //scene.remove(car);
        //editor.loadGameObjectFromJSON();

        // @ts-ignore
        editor.playerCarGO.resetTransform(); // remettre l'objet comme il était avant le début du jeu

        // @ts-ignore
        startGameBtn.disabled = false;
        // @ts-ignore
        fsmEditor.style.display = 'block';
        // @ts-ignore
        objectsList.style.display = 'block';

    }



    constructor() {

        console.log("Welcome to Lusine GM engine !");

        const OBJA_ID = 161;
        const OBJB_ID = 164;

        const fsmEditor = document.getElementById("fsm");
        const objectsList = document.getElementById('objectsList');
        const startGameBtn = document.getElementById('startGameBtn');
        const stopGameBtn = document.getElementById('stopGameBtn');






        // @ts-ignore
        //document.getElementById('selectObjABtn').addEventListener("click", () => { selectObject(GameObject.getById(OBJA_ID)) });
        // @ts-ignore
        //document.getElementById('selectObjBBtn').addEventListener("click", () => { selectObject(GameObject.getById(OBJB_ID)) });

        // @ts-ignore
        //document.getElementById('translateModeBtn').addEventListener("click", () => { control.setMode(ControlMode.Translate) });
        // @ts-ignore
        //document.getElementById('rotateModeBtn').addEventListener("click", () => { control.setMode(ControlMode.Rotate) });
        // @ts-ignore
        //document.getElementById('scaleModeBtn').addEventListener("click", () => { control.setMode(ControlMode.Scale) });
        // @ts-ignore
        //document.getElementById('localSpaceBtn').addEventListener("click", () => { control.setSpace(Space.Local) });
        // @ts-ignore
        //document.getElementById('worldSpaceBtn').addEventListener("click", () => { control.setSpace(Space.World) });

        //document.getElementById('executeCommandBtn').addEventListener("click", executeCommand);
        // @ts-ignore
        //document.getElementById('startGameBtn').addEventListener("click", startGame);
        // @ts-ignore
        //document.getElementById('stopGameBtn').addEventListener("click", stopGame);
        // @ts-ignore
        //document.getElementById('saveStateABtn').addEventListener('click', (event) => { editor.saveDemoWorkspace(); });
        // @ts-ignore
        // document.getElementById('clearConsoleBtn').addEventListener('click', (event) => {
        //     // @ts-ignore
        //     document.getElementById('console').innerHTML = "";
        // });





    }




}



