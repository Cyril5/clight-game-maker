import Mathf from "../../math/mathf.js";
import { LusineBlock } from "../lusineBlock.js";

class GameObjectRotateYBlock extends LusineBlock {

    // const blockName = this.blockName;
    // const code = this.code;

    constructor() {
        const name = 'gameObject_rotatey';
        super(name);

        Blockly.Blocks['gameobject_rotatey'] = {
          init: function() {
            this.appendValueInput("OBJ")
                .setCheck("GameObject")
                .appendField("Pivoter l'objet");
            this.appendValueInput("DEGY")
                .setCheck(null)
                .appendField("sur l'axe Y de");
            this.appendDummyInput()
                .appendField("degrés");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(260);
         this.setTooltip("Pivote l'objet sur l'axe Y dans l'espace local");
         this.setHelpUrl("");
          }
        };
        
        Blockly.JavaScript['gameobject_rotatey'] = function(block) {
          var value_obj = Blockly.JavaScript.valueToCode(block, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC);
          var value_degy = Blockly.JavaScript.valueToCode(block, 'DEGY', Blockly.JavaScript.ORDER_ATOMIC);
          // TODO: Assemble JavaScript into code variable.
          var yrad = 'Mathf.degToRad('+value_degy+')';
          var code = value_obj+".rotateY("+yrad+");\n";
          return code;
        };
    }
}
export {GameObjectRotateYBlock};


