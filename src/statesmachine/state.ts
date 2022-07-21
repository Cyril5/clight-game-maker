// IMPORTS (ne pas supprimer à cause de l'execution du code en temps réel)
// import Mathf from '../../js/math/mathf.js';
// import { Game } from '../../js/game.js';
// import { Debug } from '../../js/debug.js';

import Blockly from 'blockly';
import { Debug } from '../debug';
import { Game } from '../game';
import {GameObject} from '../gameObject';
import { Mathf } from '../math/mathf';

import {FiniteStateMachine} from './fsm';


  export class State {

    private readonly kebabRequire = "require('../../../dist/src/kebab.js').Kebab";
    private readonly gameObjectRequire : string = "require('../../../dist/src/gameObject.js').GameObject";
    private readonly debugRequire : string = "require('../../../dist/src/debug.js')";
    private readonly mathfRequire = "require('../../../dist/src/math/mathf.js')";
    private readonly gameRequire = "require('../../../dist/src/game.js')";

      readonly fsm : FiniteStateMachine;
      code : string = '';
      private gameObject : GameObject | undefined;
      name = 'StateA';
  
      // local variables
      userVariables = {
        
      }
      
  
      constructor(fsm : FiniteStateMachine) {
          this.fsm = fsm;
          this.gameObject = fsm.gameObject;
      }
  
      onEnterState() {
  
      }
  
      onUpdateState() {
          
      }
  
      onExitState() {
  
      }
  
      _leaveStateChecks() {
        // Callback : qui peut contenir que des if else if vers des actions de sorties vers des transitions
        // Du code est généré automatiquement quand l'utilisateur ajoute une transitions vers un autre état.
      }
  
  
      runCode() { // run state code
        
  
          var totalCode = "var __Kebab = "+this.kebabRequire+";\n"+
          "var "+GameObject.getVarClassName()+" = "+ this.gameObjectRequire+";\n"+
          "var __req_mathf ="+this.mathfRequire+";\n"+
          "var __req_game = "+this.gameRequire+";\n"+
          "\n\n"+this.code;

          // totalCode = totalCode.replaceAll(Debug.name,'__req_debug.'+Debug.name)
          // .replaceAll(Mathf.name,'__req_mathf.'+Mathf.name)
          // .replaceAll(Game.name,'__req_game.'+Game.name)
          
          console.log(totalCode);
  
          // Generate JavaScript code and run it.
          (window as any).LoopTrap = 1000;
          Blockly.JavaScript.INFINITE_LOOP_TRAP ='if (--window.LoopTrap === 0) throw "Infinite loop.";\n';
      
          Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
          try {
            eval(totalCode+'console.log( __Kebab.eat()  )');
          } catch (e : any) {
            Debug.writeInConsole(this.name+"->"+e.message+" - line : ("+e.lineNumbers+")",'#ff0000');
            alert(e);
            console.error(e);
          }
        }
  }