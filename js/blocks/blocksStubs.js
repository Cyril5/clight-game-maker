
const mathfClass = 'Mathf';
const currState = 'this';
const dir = '../';
const MATHF_CLASS_IMPORT = [mathfClass,dir+'math/mathf.js'];



Blockly.JavaScript['fsm_init'] = function(block) {
  var statements_init = Blockly.JavaScript.statementToCode(block, 'INIT');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['fsm_start'] = function(block) {
  var statements_start = Blockly.JavaScript.statementToCode(block, 'START');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};


// S'execute depuis un FSM
Blockly.JavaScript['fsm_update'] = function(block) {
  var statements_update = Blockly.JavaScript.statementToCode(block, 'UPDATE');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};


Blockly.JavaScript['state_onupdatestate'] = function(block) {
  var statements_updatestate = Blockly.JavaScript.statementToCode(block, 'UPDATESTATE');
  // TODO: Assemble JavaScript into code variable.
  var code = currState+".onUpdateState = () => {\n" +statements_updatestate+ "}\n";
  return code;
};

Blockly.JavaScript['state_onenterstate'] = function(block) {
  var statements_enterstate = Blockly.JavaScript.statementToCode(block, 'ENTERSTATE');
  // TODO: Assemble JavaScript into code variable.
  var code = currState+".onEnterState = () => {\n" +statements_enterstate+ "}\n";
  return code;
};

Blockly.JavaScript['state_onexitstate'] = function(block) {
  var statements_onexitstate = Blockly.JavaScript.statementToCode(block, 'ONEXITSTATE');
  // TODO: Assemble JavaScript into code variable.
  var code = currState+".onExitState = () => {\n" +statements_onexitstate+ "}\n";
  return code;
};

Blockly.JavaScript['state_leave_state_checks'] = function(block) {
  var statements__leave_state_checks = Blockly.JavaScript.statementToCode(block, '_LEAVE_STATE_CHECKS');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};



Blockly.JavaScript['gameobject_this'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'this.gameObject';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['gameobject_find_by_id'] = function(block) {
  var value_id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'GameObject.findById('+value_id+')';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['compare_distance_objects'] = function(block) {
  var value_obja = Blockly.JavaScript.valueToCode(block, 'OBJA', Blockly.JavaScript.ORDER_ATOMIC);
  var value_objb = Blockly.JavaScript.valueToCode(block, 'OBJB', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = value_obja.position.distanceTo(value_objb);
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// S'execute depuis un STATE
Blockly.JavaScript['translate_z_self'] = function(block) {
  var number_zdist = block.getFieldValue('ZDISTANCE');
  // TODO: Assemble JavaScript into code variable.
  var code = "this.gameObject.translateZ("+number_zdist+");\n";

  return code;
};



