Blockly.Blocks.oled_ready = {
    category: 'oled_sensor',
    init: function () {
        this.appendDummyInput()
            .appendField('OLED Module Begins');
        this.setColour(45);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        
    }
}
Blockly.JavaScript.oled_ready = function () {
    return "var FACE_DEFAULT=0;var FACE_ANGRY=1;var FACE_BLINK=2;var FACE_CURIOUS=3;var FACE_SLEEPY=4;function oled_face(number){i2c.writeTo(0x0F,[0x02,1,number,(1+number)&0xFF]);}\n"
}


let oledValid = false;
Blockly.Blocks.oled_face = {
    category: 'oled_sensor',
    init: function () {
        this.appendDummyInput()
            .appendField('Draw Image')
            .appendField(new Blockly.FieldDropdown([
                ['DEFAULT', "0"],
                ['ANGRY', "1"],
                ['BLINK', "2"],
                ['CURIOUS', "3"],
                ['SLEEPY', "4"],
                ['HAPPY', "5"],
                ['SAD', "6"]
            ], this.validate), "oled_sensor")
        this.setColour(180);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.setInputsInline(true);
    },
    validate : function () {
        oledValid = true;
    }
}
Blockly.JavaScript.oled_face = function (block) {
    let oledVal ="0";
    if(oledValid == false) {
        oledVal = "0"
    }
    else {
        oledVal = block.getFieldValue("oled_sensor");
    }
    return `oled_face(${oledVal})`;
}