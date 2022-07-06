import { LusineBlock } from "../lusineBlock.js";

const mathfClass = 'Mathf';

class GameObjectRotateYBlock extends LusineBlock {

    // const blockName = this.blockName;
    // const code = this.code;

    constructor() {
        const name = 'gameObject_rotatey';
        super(name);

        Blockly.Blocks[this.name] = {
            init: function () {
              this.appendDummyInput().appendField("Tourner cet objet de")
              .appendField(new Blockly.FieldAngle(90), "YDEG")
              .appendField("sur l'axe Y");
          
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
              this.setColour(260);
              this.setTooltip("");
              this.setHelpUrl("");
            }
          };
        
        Blockly.JavaScript[this.name] = function(block) {
          var angle_ydeg = block.getFieldValue('YDEG');
          // TODO: Assemble JavaScript into code variable.
          this.code = "this.gameObject.rotateY("+mathfClass+".degToRad("+angle_ydeg+"));\n";
          return this.code;
        };
    }
}
export {GameObjectRotateYBlock};


