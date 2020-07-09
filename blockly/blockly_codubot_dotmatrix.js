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
 return "function set_brightness(brightness){i2c.writeTo(0x10,[0x02,1,brightness,(1+brightness)&0xFF])}function print_single_dot(dot,red,green,blue){i2c.writeTo(0x10,[0x02,2,dot,red,green,blue,(2+dot+red+green+blue)&0xFF])}function print_single_line(line,rgb_array){var sum_rgb_array=0;for(var i=0;i<7;i++){let sum=rgb_array[i].reduce((a,b)=>a+b,0);console.log(sum)sum_rgb_array=(sum_rgb_array+sum)&0xFF}i2c.writeTo(0x10,[0x02,3,line,rgb_array,(3+line+sum_rgb_array)&0xFF])}function save_single_dot(dot,red,green,blue){i2c.writeTo(0x10,[0x02,4,dot,red,green,blue,(4+dot+red+green+blue)&0xFF])}function save_single_line(line,rgb_array){var sum_rgb_array=0;for(var i=0;i<7;i++){let sum=rgb_array[i].reduce((a,b)=>a+b,0);console.log(sum)sum_rgb_array=(sum_rgb_array+sum)&0xFF}i2c.writeTo(0x10,[0x02,5,line,rgb_array,(5+line+sum_rgb_array)&0xFF])}function update_dot_matrix(){i2c.writeTo(0x10,[0x02,6,(6)&0xFF])}function print_every_line(rgb_array){for(var i=0;i<7;i++){save_single_line(i,[rgb_array[(i*7)+0],rgb_array[(i*7)+1],rgb_array[(i*7)+2],rgb_array[(i*7)+3],rgb_array[(i*7)+4],rgb_array[(i*7)+5],rgb_array[(i*7)+6]])}update_dot_matrix()}function clear_dot_matrix(){print_every_line([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]])}function set_string_color(rgb_array){i2c.writeTo(0x10,[0x02,7,[rgb_array[0],rgb_array[1],rgb_array[2]],(7+rgb_array[0]+rgb_array[1]+rgb_array[2])&0xFF])}function print_string(string_array){var ascii_array=[];var ascii_array_sum=0;var this_ascii=0;for(var i=0;i<((string_array.length>20)?20:string_array.length);i++){if((string_array[i].charCodeAt(0)>=32)&&(string_array[i].charCodeAt(0)<=126))this_ascii=string_array[i].charCodeAt(0);else this_ascii=63;ascii_array.push(this_ascii);ascii_array_sum=ascii_array_sum+this_ascii}i2c.writeTo(0x10,[0x02,8,((string_array.length>20)?20:string_array.length),ascii_array,(8+((string_array.length>20)?20:string_array.length)+ascii_array_sum)&0xFF])}\n"
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
// Blockly.Blocks['led_matrix'] = {
//     category : "Dot Matrix",
//     init : function() {
        
//         this.setColour(10);
//         this.setPreviousStatement(true);
//         this.setNextStatement(true);
//     }
// }

// Blockly.JavaScript.led_matrix = function (block) {
//     let checkedStr = ""
//     for(var i = 0 ; i < 49; i++) {
//         let val = block.getFieldValue(`cb${i}`)
//         if(val === 'TRUE') {
//             val='checked,'
//         }
//         else {
//             val='unchecked,'
//         }
//         checkedStr+=val;
//     }
//     return `led_matrix(${checkedStr})`;
// }
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
let rgb_array = new Array(7);
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
        rgb_array[0] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate1 : function(newValue1) {
        let rgb = hexToRgb(newValue1);
        rgb_array[1] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate2 : function(newValue2) {
        let rgb = hexToRgb(newValue2);
        rgb_array[2] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate3 : function(newValue3) {
        let rgb = hexToRgb(newValue3);
        rgb_array[3] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate4 : function(newValue4) {
        let rgb = hexToRgb(newValue4);
        rgb_array[4] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate5 : function(newValue5) {
        let rgb = hexToRgb(newValue5);
        rgb_array[5] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
    validate6 : function(newValue6) {
        let rgb = hexToRgb(newValue6);
        rgb_array[6] = [rgb.r, rgb.g, rgb.b];
        //rgbStr += (rgb.r+" "+rgb.g+" "+rgb.b+" ")
    },
}
function threeSplit(str) {
    str = str.split(',');
    let newArr ="";
    let str_ = "";
    for(var i = 0 ; i < str.length; i++) {
        if((i+1) % 3 == 0) {
            str_ += str[i];
            str_ = "["+str_;
            if(i == str.length-1) {
                str_ = str_ + "]";
            }
            else {
                str_ = str_+"],";
               
            }
            newArr += str_;
            str_ = "";
            continue;

        }
        str_ += str[i];
        str_ += ",";
    }
    console.log(newArr);
    return newArr;
}
Blockly.JavaScript.draw_single_line = function() {
    let line = Blockly.JavaScript.valueToCode(this, 'line', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    //console.log(`line is ${line}`);
    //rgbStr+=line;
    rgb_str = rgb_array.toString();
    console.log("before split : " + rgb_str);
    rgb_str = threeSplit(rgb_str);
    console.log(rgb_str)
    return `print_single_line(${line}, [${rgb_str}])`;
}