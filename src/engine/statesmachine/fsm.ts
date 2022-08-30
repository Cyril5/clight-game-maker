
import {State} from './state';
import {GameObject} from '../gameObject';
import Utils from '../utils';
import { StateFile } from './stateFile';

    export class FiniteStateMachine {
    
        private static allInstances : Array<FiniteStateMachine> = [];

        name;
        enabled = true;
        states:Array<State> = [];

        static getAll() {
            return FiniteStateMachine.allInstances;
        }
        
        private _currState:State | undefined;
        
        gameObject; // le gameObject relié au FSM
    
    
        constructor(name :string, gameObject : GameObject) {
            this.name = name;
            // INIT VARS (avant le new state)
            this.gameObject = gameObject;
            // this.currState.gameObject = this.gameObject;
            this.addState();
            FiniteStateMachine.allInstances.push(this);
        }

        delete() {
            Utils.removeElementInArray(this,FiniteStateMachine.allInstances);
        }

        addState(name:string='Nouvel Etat',statefile: StateFile | undefined):State {

            const newState = new State(this,statefile);
            newState.name = name;

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

        removeState(state:State) {
            
            Utils.removeElementInArray(state,this.states);
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
    
    }


