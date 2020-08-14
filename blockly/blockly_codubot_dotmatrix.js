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
    return "function set_brightness(brightness){i2c.writeTo(0x10,[0x02,1,brightness,(1+brightness)&0xFF])};function print_single_dot(dot,red,green,blue){i2c.writeTo(0x10,[0x02,2,dot,red,green,blue,(2+dot+red+green+blue)&0xFF])};function print_single_line(line,rgb_array){var sum_rgb_array=0;for(var i=0;i<7;i++){for(var j=0;j<3;j++){sum_rgb_array+=rgb_array[i][j]}}i2c.writeTo(0x10,[0x02,3,line,rgb_array,(3+line+sum_rgb_array)&0xFF])};function save_single_dot(dot,red,green,blue){i2c.writeTo(0x10,[0x02,4,dot,red,green,blue,(4+dot+red+green+blue)&0xFF])};function save_single_line(line,rgb_array){var sum_rgb_array=0;for(var i=0;i<7;i++){for(var j=0;j<3;j++){sum_rgb_array+=rgb_array[i][j]}}i2c.writeTo(0x10,[0x02,5,line,rgb_array,(5+line+sum_rgb_array)&0xFF])};function update_dot_matrix(){i2c.writeTo(0x10,[0x02,6,(6)&0xFF])};function print_every_line(rgb_array){for(var i=0;i<7;i++){save_single_line(i,[rgb_array[(i*7)+0],rgb_array[(i*7)+1],rgb_array[(i*7)+2],rgb_array[(i*7)+3],rgb_array[(i*7)+4],rgb_array[(i*7)+5],rgb_array[(i*7)+6]])}update_dot_matrix()};function clear_dot_matrix(){print_every_line([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]])};function set_string_color(rgb_array){i2c.writeTo(0x10,[0x02,7,[rgb_array[0],rgb_array[1],rgb_array[2]],(7+rgb_array[0]+rgb_array[1]+rgb_array[2])&0xFF])};function print_string(string_array){var ascii_array=[];var ascii_array_sum=0;var this_ascii=0;for(var i=0;i<((string_array.length>20)?20:string_array.length);i++){if((string_array[i].charCodeAt(0)>=32)&&(string_array[i].charCodeAt(0)<=126)){this_ascii=string_array[i].charCodeAt(0)}else{this_ascii=63}ascii_array.push(this_ascii);ascii_array_sum=ascii_array_sum+this_ascii}i2c.writeTo(0x10,[0x02,8,((string_array.length>20)?20:string_array.length),ascii_array,(8+((string_array.length>20)?20:string_array.length)+ascii_array_sum)&0xFF])};\n"
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
    return "clear_dot_matrix();\n";
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
    return `set_brightness(${brightness});\n`
}
function hexToRgb(hexType) {
    if(hexType == undefined) {
        return {r : 0, g : 0, b : 0}
    }
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
            .appendField(new Blockly.FieldColour(null, this.validate), 'single_led_color');
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
}

Blockly.JavaScript.draw_single_led = function (block) {
    let dot = Blockly.JavaScript.valueToCode(this, 'dot', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    let hexColor = block.getFieldValue("single_led_color");
    console.log(`hexColor : ${hexColor}`)
    if(hexColor == "") {
        hexColor = "000000";
    }
    let rgb = hexToRgb(hexColor);

    let red = rgb.r;
    let green = rgb.g;
    let blue = rgb.b;
    console.log(`dot is ${dot}, red = ${red} green = ${green} blue = ${blue}`)
    return `print_single_dot(${dot}, ${red}, ${green}, ${blue});\n`
}

let rgb_array_single = new Array(3);
Blockly.Blocks.print_string = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw Text');
        this.appendValueInput('str')
            .setCheck(["String"])
        this.appendDummyInput()
            .appendField('Color');
        this.appendDummyInput()
            .appendField(new Blockly.FieldColour(null, this.validate), 'print_string_color')
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
}
Blockly.JavaScript.print_string = function (block) {
    let str = Blockly.JavaScript.valueToCode(this, 'str', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    let hexColor = block.getFieldValue("print_string_color");
    let rgb = hexToRgb(hexColor);
    rgb_array_single = [rgb.r, rgb.b, rgb.b];
    let rgb_str = threeSplit(rgb_array_single.toString());
    return `set_string_color(${rgb_str});\nprint_string(${str});\n`;
}
// TODO : draw image
Blockly.Blocks.draw_image = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw Image');
        this.appendDummyInput()
            .appendField('Name : ')
            .appendField(new Blockly.FieldTextInput('led_0', this.validate),
            'imageName')
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    },
    validate : function(newValue) {
        getText(newValue).then(
            function (result) {
                colorTxt = result;
                console.log(`colorTxt in then : ${colorTxt}`)
            }
        )
    }
}
function getText(fileName) {
    return new Promise((resolve, reject)=>{
        resolve(fetch(`${fileName}.txt`)
            .then(function (response) {
                return response.text();
            }));
    })
}
let colorTxt = "";
// getText().then(function (result) {
//     colorTxt = result;
//     console.log(`colorTxt in then : ${colorTxt}`)
// })
Blockly.JavaScript.draw_image = async function (block) {
    // let imageName = Blockly.JavaScript.valueToCode(this, 'imageName', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';

    
    return `print_every_line(${colorTxt})`;
}
let rgb_array_total = new Array(7);
let rgbStr = "";
let rgb_array = new Array(7);
Blockly.Blocks.draw_single_line = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw Line');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['#0', '0'],
                ['#1', '1'],
                ['#2', '2'],
                ['#3', '3'],
                ['#4', '4'],
                ['#5', '5'],
                ['#6', '6'],
            ]), "whichLine")
        this.appendDummyInput()
            .appendField("Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_0')
            .appendField(new Blockly.FieldColour(null), 'line_color_1')
            .appendField(new Blockly.FieldColour(null), 'line_color_2')
            .appendField(new Blockly.FieldColour(null), 'line_color_3')
            .appendField(new Blockly.FieldColour(null), 'line_color_4')
            .appendField(new Blockly.FieldColour(null), 'line_color_5')
            .appendField(new Blockly.FieldColour(null), 'line_color_6')
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
}
function threeSplit(str) {
    str = str.split(',');
    let newArr = "";
    let str_ = "";
    for (var i = 0; i < str.length; i++) {
        if ((i + 1) % 3 == 0) {
            str_ += str[i];
            str_ = "[" + str_;
            if (i == str.length - 1) {
                str_ = str_ + "]";
            }
            else {
                str_ = str_ + "],";
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
Blockly.JavaScript.draw_single_line = function (block) {
    let line = block.getFieldValue("whichLine");
    if(line == undefined) line = 0;
    console.log(`line = ${line}`)
    for(var i = 0 ; i < 7 ; i++) {
        let hex = block.getFieldValue(`line_color_${i}`);
        if(hex == "") {
            hex = "000000";
        }
        let rgb = hexToRgb(hex);
        rgb_array[i] = [rgb.r, rgb.g, rgb.b];
    }
    rgb_array_total[line] = rgb_array;
    rgb_str = rgb_array_total[line].toString();
    rgb_str = threeSplit(rgb_str);
    return `print_single_line(${line}, [${rgb_str}]);\n`;
}

Blockly.Blocks.draw_every_line = {
    category: 'Dot Matrix',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw Every Line');
        this.appendDummyInput()
            .appendField("1 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_0')
            .appendField(new Blockly.FieldColour(null), 'line_color_1')
            .appendField(new Blockly.FieldColour(null), 'line_color_2')
            .appendField(new Blockly.FieldColour(null), 'line_color_3')
            .appendField(new Blockly.FieldColour(null), 'line_color_4')
            .appendField(new Blockly.FieldColour(null), 'line_color_5')
            .appendField(new Blockly.FieldColour(null), 'line_color_6')
        this.appendDummyInput()
            .appendField("2 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_7')
            .appendField(new Blockly.FieldColour(null), 'line_color_8')
            .appendField(new Blockly.FieldColour(null), 'line_color_9')
            .appendField(new Blockly.FieldColour(null), 'line_color_10')
            .appendField(new Blockly.FieldColour(null), 'line_color_11')
            .appendField(new Blockly.FieldColour(null), 'line_color_12')
            .appendField(new Blockly.FieldColour(null), 'line_color_13')
        this.appendDummyInput()
            .appendField("3 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_14')
            .appendField(new Blockly.FieldColour(null), 'line_color_15')
            .appendField(new Blockly.FieldColour(null), 'line_color_16')
            .appendField(new Blockly.FieldColour(null), 'line_color_17')
            .appendField(new Blockly.FieldColour(null), 'line_color_18')
            .appendField(new Blockly.FieldColour(null), 'line_color_19')
            .appendField(new Blockly.FieldColour(null), 'line_color_20')
        this.appendDummyInput()
            .appendField("4 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_21')
            .appendField(new Blockly.FieldColour(null), 'line_color_22')
            .appendField(new Blockly.FieldColour(null), 'line_color_23')
            .appendField(new Blockly.FieldColour(null), 'line_color_24')
            .appendField(new Blockly.FieldColour(null), 'line_color_25')
            .appendField(new Blockly.FieldColour(null), 'line_color_26')
            .appendField(new Blockly.FieldColour(null), 'line_color_27')
        this.appendDummyInput()
            .appendField("5 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_28')
            .appendField(new Blockly.FieldColour(null), 'line_color_29')
            .appendField(new Blockly.FieldColour(null), 'line_color_30')
            .appendField(new Blockly.FieldColour(null), 'line_color_31')
            .appendField(new Blockly.FieldColour(null), 'line_color_32')
            .appendField(new Blockly.FieldColour(null), 'line_color_33')
            .appendField(new Blockly.FieldColour(null), 'line_color_34')
        this.appendDummyInput()
            .appendField("6 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_35')
            .appendField(new Blockly.FieldColour(null), 'line_color_36')
            .appendField(new Blockly.FieldColour(null), 'line_color_37')
            .appendField(new Blockly.FieldColour(null), 'line_color_38')
            .appendField(new Blockly.FieldColour(null), 'line_color_39')
            .appendField(new Blockly.FieldColour(null), 'line_color_40')
            .appendField(new Blockly.FieldColour(null), 'line_color_41')
        this.appendDummyInput()
            .appendField("7 Line Color : ")
            .appendField(new Blockly.FieldColour(null), 'line_color_42')
            .appendField(new Blockly.FieldColour(null), 'line_color_43')
            .appendField(new Blockly.FieldColour(null), 'line_color_44')
            .appendField(new Blockly.FieldColour(null), 'line_color_45')
            .appendField(new Blockly.FieldColour(null), 'line_color_46')
            .appendField(new Blockly.FieldColour(null), 'line_color_47')
            .appendField(new Blockly.FieldColour(null), 'line_color_48')
        this.setColour(10);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}
let rgb_total = [];
Blockly.JavaScript.draw_every_line = function (block) {
    if(rgb_total.length!==0) rgb_total=[];
    for(var i = 0 ; i < 49 ; i++) {
        let hex = block.getFieldValue(`line_color_${i}`);
        if(hex == "") {
            hex = "000000";
        }
        let rgb = hexToRgb(hex);
        rgb_total.push(`[${rgb.r}, ${rgb.g}, ${rgb.b}]`);
    };
    return `clear_dot_matrix();\nprint_every_line([${rgb_total}]);\n`;
}