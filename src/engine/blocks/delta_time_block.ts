import { LusineBlock } from "./lusineBlock.js";

import Blockly from 'blockly';
import { Game } from "../game.js";

export class DeltaTimeBlock {

    constructor() {
        const name = 'delta_time';
        const code = Game.getVarClassName()+'.deltaTime';

        Blockly.Blocks[name] = {
            init: function() {
              this.appendDummyInput()
                  .appendField("temps delta");
              this.setOutput(true, "Number");
              this.setColour(330);
           this.setTooltip("Le temps qui s’est écoulé depuis la dernière image (frame)");
           this.setHelpUrl("");
            }
        };

        Blockly.JavaScript[name] = function(/** @type {any} */ block: any) {

            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.JavaScript.ORDER_NONE];
        };
    }
}