import { LusineBlock } from "../lusineBlock.js";

class GameObjectTranslateForwardBlock extends LusineBlock {

    // const blockName = this.blockName;
    // const code = this.code;

    constructor() {
        const name = 'gameobject_translate_forward';
        super(name);

        Blockly.Blocks['gameobject_translate_forward'] = {
          init: function() {
            this.appendValueInput("OBJ")
                .setCheck("GameObject")
                .appendField("Déplacer l'objet");
            this.appendValueInput("DISTZ")
                .setCheck(null)
                .appendField("vers l'avant de");
            this.appendDummyInput()
                .appendField("m");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(260);
         this.setTooltip("Déplace l'objet sur l'axe Z dans l'espace local");
         this.setHelpUrl("");
          }
        };
        
        Blockly.JavaScript['gameobject_translate_forward'] = function(block) {
          var value_obj = Blockly.JavaScript.valueToCode(block, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC);
          var value_distz = Blockly.JavaScript.valueToCode(block, 'DISTZ', Blockly.JavaScript.ORDER_ATOMIC);
          // TODO: Assemble JavaScript into code variable.
          var code = value_obj+".translateZ("+value_distz+");\n";
          return code;
        };
    }
}
export {GameObjectTranslateForwardBlock};


