class Vector3dBlocks {

    constructor() {
        Blockly.Blocks['vector3'] = {
            init: function () {
                this.appendValueInput("X")
                    .setCheck("Number")
                    .appendField("Vecteur 3d")
                    .appendField("x");
                this.appendValueInput("Y")
                    .setCheck("Number")
                    .appendField("y");
                this.appendValueInput("Z")
                    .setCheck("Number")
                    .appendField("z");
                this.setInputsInline(true);
                this.setOutput(true, "Vector3D");
                this.setColour(230);
                this.setTooltip("Retourne un nouveau Vecteur");
                this.setHelpUrl("");
            }
        };

        Blockly.Blocks['vector3_get_x'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("x du Vecteur");
                this.appendValueInput("VECTOR")
                    .setCheck("Vector3D");
                this.setInputsInline(true);
                this.setOutput(true, "Number");
                this.setColour(230);
                this.setTooltip("composante x d'un vecteur");
                this.setHelpUrl("");
            }
        };

        Blockly.Blocks['vector3_get_y'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("y du Vecteur");
                this.appendValueInput("VECTOR")
                    .setCheck("Vector3D");
                this.setInputsInline(true);
                this.setOutput(true, "Number");
                this.setColour(230);
                this.setTooltip("composante y d'un vecteur");
                this.setHelpUrl("");
            }
        };

        Blockly.Blocks['vector3_get_z'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("z du Vecteur");
                this.appendValueInput("VECTOR")
                    .setCheck("Vector3D");
                this.setInputsInline(true);
                this.setOutput(true, "Number");
                this.setColour(230);
                this.setTooltip("composante z d'un vecteur");
                this.setHelpUrl("");
            }
        };

        Blockly.JavaScript['vector3'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC);
            var value_z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_ATOMIC);
            // TODO: Assemble JavaScript into code variable.
            var code = 'new Vector3D('+value_x+','+value_y+','+value_z+')';
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.JavaScript.ORDER_NONE];
          };
          
          Blockly.JavaScript['vector3_get_x'] = function(block) {
            var value_vector = Blockly.JavaScript.valueToCode(block, 'VECTOR', Blockly.JavaScript.ORDER_ATOMIC);
            // TODO: Assemble JavaScript into code variable.
            var code = value_vector+'.x';
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.JavaScript.ORDER_NONE];
          };
          
          Blockly.JavaScript['vector3_get_y'] = function(block) {
            var value_vector = Blockly.JavaScript.valueToCode(block, 'VECTOR', Blockly.JavaScript.ORDER_ATOMIC);
            // TODO: Assemble JavaScript into code variable.
            var code = value_vector+'.y';
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.JavaScript.ORDER_NONE];
          };
          
          Blockly.JavaScript['vector3_get_z'] = function(block) {
            var value_vector = Blockly.JavaScript.valueToCode(block, 'VECTOR', Blockly.JavaScript.ORDER_ATOMIC);
            // TODO: Assemble JavaScript into code variable.
            var code = value_vector+'.z';
            // TODO: Change ORDER_NONE to the correct strength.
            return [code, Blockly.JavaScript.ORDER_NONE];
          };
    }


}

export { Vector3dBlocks }
