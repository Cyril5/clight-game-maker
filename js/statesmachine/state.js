// IMPORTS (ne pas supprimer à cause de l'execution du code en temps réel)
import Mathf from '../math/mathf.js';

export default class State {

  // private variables states
    fsm;
    code;
    gameObject;

    // local variables
    userVariables = {
      
    }
    

    constructor(fsm) {
        this.fsm = fsm;
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

        console.log(this);

        // Generate JavaScript code and run it.
        window.LoopTrap = 1000;
        Blockly.JavaScript.INFINITE_LOOP_TRAP ='if (--window.LoopTrap === 0) throw "Infinite loop.";\n';
    
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
          eval(this.code);
        } catch (e) {
          alert(e);
        }
      }


}