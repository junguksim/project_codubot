Blockly.Blocks.RIGHT_MOTOR = {
    category : 'CoduBot_Variables',
    init : function () {
        this.appendDummyInput()
            .appendField('오른쪽 모터')
        this.setOutput(true, "Number")
        this.setColour(200);
    }
}
Blockly.JavaScript.RIGHT_MOTOR = function () {
    return '1';
}

Blockly.Blocks.LEFT_MOTOR = {
    category : 'CoduBot_Variables',
    init : function () {
        this.appendDummyInput()
            .appendField('왼쪽 모터')
        this.setOutput(true, "Number")
        this.setColour(200);
    }
}
Blockly.JavaScript.LEFT_MOTOR = function () {
    return '0';
}

Blockly.Blocks.FORWARD = {
    category : 'CoduBot_Variables',
    init : function () {
        this.appendDummyInput()
            .appendField('앞으로')
        this.setOutput(true, "Number")
        this.setColour(270);
    }
}
Blockly.JavaScript.FORWARD = function () {
    return '0';
}

Blockly.Blocks.BACKWARD = {
    category : 'CoduBot_Variables',
    init : function () {
        this.appendDummyInput()
            .appendField('뒤로')
        this.setOutput(true, "Number")
        this.setColour(270);
    }
}
Blockly.JavaScript.BACKWARD = function () {
    return '1';
}

Blockly.Blocks.LEFT = {
    category : 'CoduBot_Variables',
    init : function () {
        this.appendDummyInput()
            .appendField('왼쪽으로')
        this.setOutput(true, "Number")
        this.setColour(270);
    }
}
Blockly.JavaScript.LEFT = function () {
    return '2';
}

Blockly.Blocks.RIGHT = {
    category : 'CoduBot_Variables',
    init : function () {
        this.appendDummyInput()
            .appendField('오른쪽으로')
        this.setOutput(true, "Number")
        this.setColour(270);
    }
}
Blockly.JavaScript.RIGHT = function () {
    return '3';
}