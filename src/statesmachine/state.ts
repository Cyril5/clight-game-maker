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

    private readonly gameObjectRequire : string = "require('../../../dist/src/gameObject.js')."+GameObject.name;
    private readonly mathfRequire = "require('../../../dist/src/math/mathf.js')."+Mathf.name;
    private readonly gameRequire = "require('../../../dist/src/game.js')."+Game.name;

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
        
  
          var requires = '';

          const classes = [Debug,Game,GameObject,Mathf];

          classes.forEach(cls => {
            if(this.code.includes(cls.getVarClassName())) {
              requires+= "const "+cls.getVarClassName()+" = require('"+cls.getDistClassFilePath()+"')."+cls.name+";\n";
            }
          });
          const code = requires+='\n'+this.code;

          console.log(code);
  
          // Generate JavaScript code and run it.
          (window as any).LoopTrap = 1000;
          Blockly.JavaScript.INFINITE_LOOP_TRAP ='if (--window.LoopTrap === 0) throw "Infinite loop.";\n';
      
          Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
          try {
            eval(code);
          } catch (e : any) {
            Debug.writeInConsole(this.name+"->"+e.message+" - line : ("+e.lineNumbers+")",'#ff0000');
            alert(e);
            console.error(e);
          }
        }
  }