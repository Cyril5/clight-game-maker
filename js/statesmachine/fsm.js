import State from "./state.js";


// Finite State Machine
export default class FiniteStateMachine {

    name;
    enabled = true;

    currWorkspaceBlocks; // STATE A (workspaces block)

    gameObject; // au gameObject à qui est relié le FSM


    constructor(name, gameObject) {
        this.name = name;
        this.currState = new State();

        // INIT VARS
        this.gameObject = gameObject;
        this.currState.fsm = this;
        this.currState.gameObject = this.gameObject;
        console.log(this);
    }

    setState(state) {
        this.currState.onExitState();
        this.currState = state;
        this.currState.onEnterState();
    }

    start() {
        // prepare callbacks
        this.currState.runCode();

        // execute la fonction d'entrée d'état
        this.currState.onEnterState();
        console.log('start fsm');

    }

    update() {
        if(this.currState == undefined) {
            console.error('currState is undefined');
            return;

        }
        this.currState._leaveStateChecks();
        this.currState.onUpdateState();
    }




    showCode() {
        // Generate JavaScript code and display it.
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);
        alert(code);
      }

}