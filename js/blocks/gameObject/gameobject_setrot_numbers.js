import Mathf from "../../math/mathf.js";
import { LusineBlock } from "../lusineBlock.js";

class GameObjectSetRotationNumbersBlock extends LusineBlock {

  // const blockName = this.blockName;
  // const code = this.code;

  constructor() {
    const name = 'gameobject_setrotation_numbers';
    super(name);

    Blockly.Blocks[name] = {
      init: function() {
        this.appendValueInput("OBJ")
            .setCheck("GameObject")
            .appendField("Fixer la rotation de");
        this.appendValueInput("DEGX")
            .setCheck("Number")
            .appendField("x");
        this.appendValueInput("DEGY")
            .setCheck("Number")
            .appendField("y");
        this.appendValueInput("DEGZ")
            .setCheck("Number")
            .appendField("z");
        this.appendDummyInput()
            .appendField("dans l'espace")
            .appendField(new Blockly.FieldDropdown([["Local","LOCAL"], ["",""]]), "SPACE");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
     this.setTooltip("Fixer la rotation en degrés de l'objet");
     this.setHelpUrl("");
      }
    };

    Blockly.JavaScript[name] = function (block) {
      var value_obj = Blockly.JavaScript.valueToCode(block, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC);
      var value_degx = Blockly.JavaScript.valueToCode(block, 'DEGX', Blockly.JavaScript.ORDER_ATOMIC);
      var value_degy = Blockly.JavaScript.valueToCode(block, 'DEGY', Blockly.JavaScript.ORDER_ATOMIC);
      var value_degz = Blockly.JavaScript.valueToCode(block, 'DEGZ', Blockly.JavaScript.ORDER_ATOMIC);
      var dropdown_space = block.getFieldValue('SPACE');
      // TODO: Assemble JavaScript into code variable.

      //const euler = new THREE.Euler(Mathf.degToRad(value_degx),Mathf.degToRad(value_degy),Mathf.degToRad(value_degz));

      const eulerX = 'Mathf.degToRad(' +value_degx+ ')';
      const eulerY = 'Mathf.degToRad('+value_degy+')';
      const eulerZ = 'Mathf.degToRad('+value_degz+')';

      var code = value_obj+'.rotation.set('+eulerX+','+eulerY+','+eulerZ+');\n';
      return code;
    };
  }
}
export { GameObjectSetRotationNumbersBlock };


