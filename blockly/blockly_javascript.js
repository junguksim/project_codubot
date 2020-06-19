
Blockly.Blocks.javascript_code = {
  category: 'Javascript',
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextArea("// Enter JavaScript Statements Here"), "CODE");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_JS_TOOLTIP);
  }
};

Blockly.Blocks.jsexpression = {
  category: 'Javascript',
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('"A JavaScript "+"Expression"'), "EXPR");
    this.setOutput(true, 'String');
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_JSEXPR_TOOLTIP);
  }
};

Blockly.JavaScript.javascript_code = function () {
  var code = JSON.stringify(this.getFieldValue("CODE"));
  return "eval(" + code + ");\n";
};
Blockly.JavaScript.jsexpression = function () {
  var code = this.getFieldValue("EXPR");
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Blocks.console_log = {
  category: 'Javascript',
  init: function () {
    this.appendDummyInput()
      .appendField('Log ')
    this.appendValueInput('code')
      .setCheck(["Number"])
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
  }
}

Blockly.JavaScript.console_log = function () {
  let code = Blockly.JavaScript.valueToCode(this, 'code', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
  return `console.log(${code})`;
}