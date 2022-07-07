import { GameObjectRotateYBlock } from "./gameObject/gameobject_rotate_y_block.js";
import { GameObjectSetPosNumbersBlock } from "./gameObject/gameobject_setpos_numbers.js";
import { GameObjectSetRotationNumbersBlock } from "./gameObject/gameobject_setrot_numbers.js";
import { GameObjectTranslateForwardBlock } from "./gameObject/gameobject_translate_forward_block.js";


const GO_SETPOS_NUMBERS_BLOCK = new GameObjectSetPosNumbersBlock();
const GO_TRANSLATE_FORWARD_BLOCK = new GameObjectTranslateForwardBlock();
const GO_ROTATE_Y_BLOCK = new GameObjectRotateYBlock();
const GO_SETROT_NUMBERS_BLOCK = new GameObjectSetRotationNumbersBlock();

var ajax = new XMLHttpRequest();
ajax.open("GET", "js/blocks/toolbox.xml", false);
ajax.send();
document.body.innerHTML += ajax.responseText;


Blockly.Blocks['fsm_init'] = {
  init: function() {
    this.appendStatementInput("INIT")
        .setCheck(null)
        .appendField("A L'initialisation");
    this.setColour(120);
 this.setTooltip("Appelé avant le start lors de l'initilisation de la FSM");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['fsm_start'] = {
  init: function() {
    this.appendStatementInput("START")
        .setCheck(null)
        .appendField("Lorsque le jeu démarre");
    this.setColour(120);
 this.setTooltip("Start Event");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['fsm_update'] = {
  init: function() {
    this.appendStatementInput("UPDATE")
        .setCheck(null)
        .appendField("Toujours");
    this.setColour(120);
 this.setTooltip("Evenement : Boucle de la state machine (Ne boucle plus quand la state machine est  désactivée)");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['state_onupdatestate'] = {
  init: function () {
    this.appendStatementInput("UPDATESTATE")
      .setCheck(null)
      .appendField("Toujours dans cet état");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['state_onenterstate'] = {
  init: function () {
    this.appendStatementInput("ENTERSTATE")
      .setCheck(null)
      .appendField("Lorsqu'on rentre dans cet état");
    this.setColour(120);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['state_onexitstate'] = {
  init: function() {
    this.appendStatementInput("ONEXITSTATE")
        .setCheck(null)
        .appendField("Lorqu'on quitte l'état");
    this.setColour(120);
 this.setTooltip("Est appelé au moment l'état de la FSM va changer");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['state_leave_state_checks'] = {
  init: function() {
    this.appendStatementInput("_LEAVE_STATE_CHECKS")
        .setCheck(null)
        .appendField("_leaveStateChecks");
    this.setColour(345);
 this.setTooltip("NE PAS SUPPRIMER ! Cette fonction permet de v0érifier toutes les conditions pour sortir ou non de l'état vers une transition. Contient une série de if");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['state_exit'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Sortir vers l'état :");
    this.appendValueInput("STATE")
        .setCheck("STATE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(345);
 this.setTooltip("NE PAS SUPPRIMER !");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['gameobject_this'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Mon Objet");
    this.setInputsInline(true);
    this.setOutput(true, "GameObject");
    this.setColour(230);
 this.setTooltip("L'objet attaché au FSM");
 this.setHelpUrl("");
  }
};


Blockly.Blocks['gameobject_find_by_id'] = {
  init: function() {
    this.appendValueInput("ID")
        .setCheck("Number")
        .appendField("l'objet avec l'ID :");
    this.setInputsInline(true);
    this.setOutput(true, "GameObject");
    this.setColour(230);
 this.setTooltip("Cherche et retourne l'objet ayant un ID");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['compare_distance_objects'] = {
  init: function() {
    this.appendValueInput("OBJA")
        .setCheck("GameObject")
        .appendField("Distance entre");
    this.appendValueInput("OBJB")
        .setCheck("GameObject")
        .appendField("et");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("Retourne la distance entre deux objets");
 this.setHelpUrl("");
  }
};