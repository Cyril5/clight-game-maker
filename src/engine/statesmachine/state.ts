import Blockly from 'blockly';

// IMPORTS pour l'execution en temps réel ne pas supprimer 
import { Debug } from '../../engine/debug';
import { GameObject } from '../../engine/gameObject';

import Editor from '@renderer/components/Editor.vue';

import { StateFile } from './stateFile';

import { Game } from '../game';
import { Mathf } from '../math/mathf';

import { FiniteStateMachine } from './fsm';


export class State {

  readonly fsm: FiniteStateMachine;
  //code: string = '';
  private gameObject: GameObject | undefined;
  name = 'Etat Vide';

  statefile: StateFile | undefined;

  workspaceBlocks: any;

  // local variables
  userVariables = {

  }


  constructor(fsm: FiniteStateMachine | undefined, stateFile: StateFile | undefined) {
    if (fsm) {
      this.fsm = fsm;
      this.gameObject = fsm.gameObject;
    }

    if (stateFile) {
      // L'état peut être non relié à un fichier
      this.statefile = stateFile;
      Editor.methods.addStateToList(this.statefile);
    }
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

    //if(this.statefile===undefined) // ne pas executé du code si il n'y a pas de statefile
    //return;

    // Clear all states callbacks
    this.onEnterState = () => { };
    this.onUpdateState = () => { };
    this.onExitState = () => { };

    // try {
    //   // Importation des classes en dev pour l'execution des codes en temps réel
    //   [GameObject, Mathf].forEach(cls => {
    //     if (typeof (cls) === 'undefined') {
    //       console.log('import ' + cls.name + ' class');
    //       setTimeout(cls.toString(), 0);
    //     }
    //   });
    // } catch (error) {
    //   alert("Erreur lors de l'importation d'une classe. \n" + error);
    // }


    console.log(this.statefile.outputCode);

    alert(this.statefile.outputCode);

    // Generate JavaScript code and run it.
    (window as any).LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap === 0) throw "Infinite loop.";\n';

    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      eval(this.statefile.outputCode);
    } catch (e: any) {
      Debug.writeInConsole(this.name + "->" + e.message + " - line : (" + e.lineNumbers + ")", '#ff0000');
      alert(e);
      console.error(e);
    }
  }

}