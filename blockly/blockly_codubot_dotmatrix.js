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
 return "var i2c=new I2C();i2c.setup({scl:D27,sda:D26,bitrate:400000});function set_brightness(brightness){i2c.writeTo(0x07,[0x02,1,brightness,(1+brightness)&0xFF])}function print_single_dot(dot,red,green,blue){i2c.writeTo(0x07,[0x02,2,dot,red,green,blue,(2+dot+red+green+blue)&0xFF])}function print_single_line(rgb_array){console.log('===========rgb_array================')console.log(rgb_array);var line=rgb_array[0];var sum_rgb_array=0;for(var i=0;i<7;i++){sum_rgb_array=(sum_rgb_array+rgb_array[i].reduce((a,b)=>a+b))&0xFF}i2c.writeTo(0x07,[0x02,3,line,rgb_array,(3+line+sum_rgb_array)&0xFF])}\n"
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
let rgb_array = new Array(8);
let rgbStr = "";
let color = new Array(3);
Blockly.Blocks.draw_single_line = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw Line');
        this.appendValueInput('line')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField("Color : ")
            .appendField(new Blockly.FieldColour(null, this.validate0), 'COLOUR')
            .appendField(new Blockly.FieldColour(null, this.validate1), 'COLOUR')
            .appendField(new Blockly.FieldColour(null, this.validate2), 'COLOUR')
            .appendField(new Blockly.FieldColour(null, this.validate3), 'COLOUR')
            .appendField(new Blockly.FieldColour(null, this.validate4), 'COLOUR')
            .appendField(new Blockly.FieldColour(null, this.validate5), 'COLOUR')
            .appendField(new Blockly.FieldColour(null, this.validate6), 'COLOUR')
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    },
    validate0 : function(newValue0) {
        let rgb = hexToRgb(newValue0);
        //rgb_array[1] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
        console.log(rgb_array)
    },
    validate1 : function(newValue1) {
        let rgb = hexToRgb(newValue1);
        //rgb_array[2] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate2 : function(newValue2) {
        let rgb = hexToRgb(newValue2);
        //rgb_array[3] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate3 : function(newValue3) {
        let rgb = hexToRgb(newValue3);
        //rgb_array[4] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate4 : function(newValue4) {
        let rgb = hexToRgb(newValue4);
        //rgb_array[5] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate5 : function(newValue5) {
        let rgb = hexToRgb(newValue5);
        //rgb_array[6] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate6 : function(newValue6) {
        let rgb = hexToRgb(newValue6);
        //rgb_array[7] = [rgb.r, rgb.g, rgb.b];
        rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
}

Blockly.JavaScript.draw_single_line = function() {
    let line = Blockly.JavaScript.valueToCode(this, 'line', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    console.log(`line is ${line}`);
    //rgb_array[0] = line;
    rgbStr+=line;
    return `console.log(${rgbStr.toString()})\n;print_single_line(${rgbStr.toString()})\n`
}