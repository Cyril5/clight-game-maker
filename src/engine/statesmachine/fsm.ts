
import {State} from './state';
import {GameObject} from '../gameObject';
import { Project } from '@renderer/project';

    export class FiniteStateMachine {
    
        name;
        enabled = true;
        states:Array<State> = [];
        
        private _currState:State | undefined;
        
        currWorkspaceBlocks: any; // STATE A (workspaces block)
    
        gameObject; // au gameObject à qui est relié le FSM
    
    
        constructor(name :string, gameObject : GameObject) {
            this.name = name;
            // INIT VARS (avant le new state)
            this.gameObject = gameObject;
            // this.currState.gameObject = this.gameObject;
        }

        addState(name:string):State {
            alert(Project.getAssetsDir());
            const newState = new State(this,Project.getStatesDir()+"/"+name+".json");
            this.states.push(newState);

            if(this.states.length == 1) {
                this.setState(newState);
            }
                
            return newState;
        }
    
        setState(state:State) {
            if(this._currState)
                this._currState.onExitState();
            this._currState = state;
            this._currState.onEnterState();
        }

        getBaseState() : State  {
            return this.states[0];
        }
    
        start() {
            // prepare callbacks
            this._currState.runCode();
    
            // execute la fonction d'entrée d'état
            this._currState.onEnterState();
            console.log('start fsm');
    
        }
    
        update() {
            if(this._currState == undefined) {
                console.error('currState is undefined');
                return;
    
            }
            this._currState._leaveStateChecks();
            this._currState.onUpdateState();
        }
    

        // showCode() {
        //     // Generate JavaScript code and display it.
        //     (Blockly.JavaScript as any).INFINITE_LOOP_TRAP = null;
        //     var code = (Blockly.JavaScript as any).workspaceToCode(demoWorkspace);
        //     alert(code);
        // }
    
    }


