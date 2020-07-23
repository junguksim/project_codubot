Blockly.Blocks.rainbow_ready = {
    category: 'rainbow_module',
    init: function () {
        this.appendDummyInput()
            .appendField('Rainbow Module Begins');
        this.setColour(45);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        
    }
}
Blockly.JavaScript.rainbow_ready = function () {
    return "var RAINBOW_CW=0;var RAINBOW_CCW=1;var LED_CW=2;var LED_CCW=3;function rainbow_clear(){i2c.writeTo(0x0E,[0x02,1,(1)&0xFF])}function rainbow_single_led(dot,red,green,blue){i2c.writeTo(0x0E,[0x02,2,dot,red,green,blue,(2+dot+red+green+blue)&0xFF])}function rainbow_all_led(red,green,blue){i2c.writeTo(0x0E,[0x02,3,red,green,blue,(3+red+green+blue)&0xFF])}function rainbow_set_effect(effect_number,delay_ms){var number=((effect_number>3)?3:effect_number);number=((number<0)?0:number);var ms=((delay_ms>100)?100:delay_ms);ms=((ms<0)?0:ms);i2c.writeTo(0x0E,[0x02,4,number,ms,(4+number+ms)&0xFF])}\n"
}

Blockly.Blocks.rainbow_clear = {
    category : 'rainbow_module',
    init : function() {
        this.appendDummyInput()
            .appendField('Clear Rainbow ')
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    }
}

Blockly.JavaScript.rainbow_clear = function(block) {
    return `rainbow_clear();\n`;
}
function hexToRgb(hexType) {

    var hex = hexType.replace("#", "");
    var value = hex.match(/[a-f\d]/gi);
    console.log(hex);
    console.log(value);
    // 헥사값이 세자리일 경우, 여섯자리로. 
    if (value.length == 3) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];


    value = hex.match(/[a-f\d]{2}/gi);

    var r = parseInt(value[0], 16);
    var g = parseInt(value[1], 16);
    var b = parseInt(value[2], 16);

    return { r, g, b }
}
//let hexColor = "";
Blockly.Blocks.rainbow_single_led = {
    category : 'rainbow_module',
    init : function() {
        this.appendDummyInput()
            .appendField('Set LED ')
        this.appendValueInput('led')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('Color')
            .appendField(new Blockly.FieldColour(null, this.validate), 'COLOUR');
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        hexColor = newValue;
    }
}

Blockly.JavaScript.rainbow_single_led = function(block) {
    let led = Blockly.JavaScript.valueToCode(this, 'led', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    let hexColor = block.getFieldValue('COLOUR')
    let rgb = hexToRgb(hexColor);
    console.log(`hexColor = ${hexColor} rgb = ${rgb}`)
    let red = rgb.r;
    let green = rgb.g;
    let blue = rgb.b;
    return `rainbow_single_led(${led}, ${red}, ${green}, ${blue})\n`;
}

Blockly.Blocks.rainbow_single_led_by_rgb = {
    category : 'rainbow_module',
    init : function() {
        this.appendDummyInput()
            .appendField('Set LED ')
        this.appendValueInput('led')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('R')
        this.appendValueInput('R')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('G')
        this.appendValueInput('G')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('B')
        this.appendValueInput('B')
            .setCheck(["Number"])
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    }
}

Blockly.JavaScript.rainbow_single_led_by_rgb = function(block) {
    let led = Blockly.JavaScript.valueToCode(this, 'led', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    let R = Blockly.JavaScript.valueToCode(this, 'R', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    let G = Blockly.JavaScript.valueToCode(this, 'G', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    let B = Blockly.JavaScript.valueToCode(this, 'B', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `rainbow_single_led(${led}, ${R}, ${G}, ${B})\n`;
}

Blockly.Blocks.rainbow_all_led = {
    category : 'rainbow_module',
    init : function() {
        this.appendDummyInput()
            .appendField('Show all ')
        this.appendDummyInput()
            .appendField('Color')
            .appendField(new Blockly.FieldColour(null, this.validate), 'COLOUR');
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        hexColor = newValue;
    }
}

Blockly.JavaScript.rainbow_all_led = function(block) {
    console.log(`hexColor : ${hexColor}`)
    let rgb = hexToRgb(hexColor);
    
    let red = rgb.r;
    let green = rgb.g;
    let blue = rgb.b;
    return `rainbow_all_led(${red}, ${green}, ${blue})\n`;
}
let turnTypeValid = false;
Blockly.Blocks.rainbow_set_effect = {
    category : 'rainbow_module',
    init : function() {
        this.appendDummyInput()
            .appendField('Set Effect ')
            .appendField(new Blockly.FieldDropdown([
                ['Turn cw', 0],
                ['Turn ccw', 1],
                ['LED cw', 2],
                ['LED ccw', 3]
            ],this.validate), "turnType")
        this.appendDummyInput()
            .appendField(',delay')
        this.appendValueInput('delaySec')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('msec')
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        turnTypeValid = true;
    }
}

Blockly.JavaScript.rainbow_set_effect = function(block) {
    let delaySec = Blockly.JavaScript.valueToCode(this, 'delaySec', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    if(turnTypeValid === false) {
        type = 0;
    }
    else {
        type = block.getFieldValue("turnType")
        if(typeof(type) == "string") {
            type = 0;
        }
    }
    return `rainbow_set_effect(${type}, ${delaySec})\n`;
}