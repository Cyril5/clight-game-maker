import { LusineBlock } from "./lusineBlock.js";

class DeltaTimeBlock extends LusineBlock {

    constructor() {
        const name = 'delta_time';
        super(name);

        Blockly.Blocks['delta_time'] = {
            init: function() {
              this.appendDummyInput()
                  .appendField("temps delta");
              this.setOutput(true, "Number");
              this.setColour(330);
           this.setTooltip("Le temps qui s’est écoulé depuis la dernière image (frame)");
           this.setHelpUrl("");
            }
        };

        Blockly.JavaScript['delta_time'] = function(block) {
            // TODO: Assemble JavaScript into code variable.
            var code = 'Game.deltaTime';
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.JavaScript.ORDER_NONE];
        };
    }
}
 export {DeltaTimeBlock};