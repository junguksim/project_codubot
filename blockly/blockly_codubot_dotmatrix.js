Blockly.Blocks.dot_matrix_ready = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Dot Matrix Ready');
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.dot_matrix_ready = function () {
 return "var i2c=new I2C();i2c.setup({scl:D27,sda:D26,bitrate:400000});function set_brightness(brightness){i2c.writeTo(0x10,[0x02,1,brightness,(1+brightness)&0xFF])}function print_single_dot(dot,red,green,blue){i2c.writeTo(0x07,[0x02,2,dot,red,green,blue,(2+dot+red+green+blue)&0xFF])}\n"
}

Blockly.Blocks.clear_screen = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Clear Screen');
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.clear_screen = function () {
    return "clean_dot_matrix();\n";
}

Blockly.Blocks.set_brightness = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Set Brightness to');
        this.appendValueInput('brightness')
            .setCheck(["Number"])
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
}

Blockly.JavaScript.set_brightness = function () {
    let brightness = Blockly.JavaScript.valueToCode(this, 'brightness', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `set_brightness(${brightness})`
}
Blockly.Blocks['led_matrix'] = {
    category : "Dot Matrix",
    init : function() {
        
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.led_matrix = function (block) {
    let checkedStr = ""
    for(var i = 0 ; i < 49; i++) {
        let val = block.getFieldValue(`cb${i}`)
        if(val === 'TRUE') {
            val='checked,'
        }
        else {
            val='unchecked,'
        }
        checkedStr+=val;
    }
    return `led_matrix(${checkedStr})`;
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
  let hexColor = "";
Blockly.Blocks.draw_single_led = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw LED');
        this.appendValueInput('dot')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField("Color : ")
            .appendField(new Blockly.FieldColour(null, this.validate), 'COLOUR');
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    },
    validate : function(newValue) {
        hexColor = newValue;
    }
}

Blockly.JavaScript.draw_single_led = function () {
    let dot = Blockly.JavaScript.valueToCode(this, 'dot', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    console.log(`hexColor : ${hexColor}`)
    let rgb = hexToRgb(hexColor);
    
    let red = rgb.r;
    let green = rgb.g;
    let blue = rgb.b;
    console.log(`dot is ${dot}, red = ${red} green = ${green} blue = ${blue}`)
    return `print_single_dot(${dot}, ${red}, ${green}, ${blue});\n`
}
