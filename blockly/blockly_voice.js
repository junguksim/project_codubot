Blockly.Blocks.voice_ready = {
    category: 'voice_module',
    init: function () {
        this.appendDummyInput()
            .appendField('Voice Module Begins');
        this.setColour(45);
        this.setNextStatement(true);
        this.setPreviousStatement(true);

    }
}
Blockly.JavaScript.voice_ready = function () {
    return "i2c.writeTo(0x0D,[1,1]);i2c.writeTo(0x0D,[15]);var temp_mp3=i2c.readFrom(0x0D,1);var max_number_mp3=temp_mp3[0];function play_sound(number){i2c.writeTo(0x0D,[0x02,80,Math.min(Math.max(parseInt(number),1),max_number_mp3),(80+Math.min(Math.max(parseInt(number),1),max_number_mp3))&0xFF])}function stop_sound(){i2c.writeTo(0x0D,[0x02,83,(83)&0xFF])}function change_volume_by_ratio(ratio){ratio=Math.min(Math.max(parseInt(Math.round(0.3*ratio)),0),30);i2c.writeTo(0x0D,[1,1]);i2c.writeTo(0x0D,[14]);var current_volume=i2c.readFrom(0x0D,1);var number=ratio-current_volume;for(var i=0;i<Math.abs(number);i++){if(number>0)i2c.writeTo(0x0D,[0x02,85,(85)&0xFF]);else if(number<0)i2c.writeTo(0x0D,[0x02,68,(68)&0xFF])}}function change_volume_by_number(number){number=Math.min(Math.max(parseInt(number),-30),30);for(var i=0;i<Math.abs(number);i++){if(number>0)i2c.writeTo(0x0D,[0x02,85,(85)&0xFF]);else if(number<0)i2c.writeTo(0x0D,[0x02,68,(68)&0xFF])}}\n"
}

function makeDropDownArray(count, start) {
    var start_ = 0;
    if (start !== undefined) {
        start_ = start;
    }
    let arr = [];
    for (var i = start_; i <= count; i++) {
        let arr_ = new Array(2);
        arr_.fill(i.toString());
        arr.push(arr_);
        arr_ = [];
    }
    return arr;
}
let voiceValid = false;
let play_sound_arr = makeDropDownArray(28);
let untilDoneValid = false;
play_sound_arr.splice(0, 1);
Blockly.Blocks.play_sound = {
    category: 'voice_module',
    init: function () {
        this.appendDummyInput()
            .appendField('Play Sound')
            .appendField(new Blockly.FieldDropdown(play_sound_arr, this.validate), "sound_num")
            .appendField('Until done?')
            .appendField(new Blockly.FieldCheckbox(false, this.validate2), 'untilDone');
        this.setColour(180);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.setInputsInline(true);
    },
    validate: function () {
        voiceValid = true;
    },
    validate2: function (newValue) {
        untilDoneValid = true;
    }
}
Blockly.JavaScript.play_sound = function (block) {
    let soundVal = "0";
    if (voiceValid == false) {
        soundVal = "0"
    }
    else {
        soundVal = block.getFieldValue("sound_num");
    }
    untilDoneValid = block.getFieldValue("untilDone");
    if (untilDoneValid == true) {
        return `play_sound(${soundVal});\n
            i2c.writeTo(0x0D, [1, 1]);\n
            i2c.writeTo(0x0D, [12]); while(i2c.readFrom(0x0D, 1) == 0);\n
            while(i2c.readFrom(0x0D, 1) == 1);\n`
    }
    else {
        return `play_sound(${soundVal});\n`;
    }
}

Blockly.Blocks.stop_sound = {
    category: 'voice_module',
    init: function () {
        this.appendDummyInput()
            .appendField('Stop sound');
        this.setColour(180);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.stop_sound = function () {
    return "stop_sound();\n"
}

let changeRatioValid = false;
Blockly.Blocks.change_volume_by_ratio = {
    category: 'voice_module',
    init: function () {
        this.appendDummyInput()
            .appendField('Set Volume ')
            .appendField(new Blockly.FieldDropdown(makeDropDownArray(100), this.validate), "change_ratio_num")
        this.appendDummyInput()
            .appendField('%');
        this.setColour(180);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    },
    validate: function () {
        changeRatioValid = true;
    }
}

Blockly.JavaScript.change_volume_by_ratio = function (block) {
    let changeVal = "0";
    if (changeRatioValid == false) {
        changeVal = "0"
    }
    else {
        changeVal = block.getFieldValue("change_ratio_num");
    }
    console.log(changeVal)
    return `change_volume_by_ratio(${changeVal});\n`;
}

let changeNumValid = false;
Blockly.Blocks.change_volume_by_number = {
    category: 'voice_module',
    init: function () {
        this.appendDummyInput()
            .appendField('Change volume by ')
            .appendField(new Blockly.FieldDropdown(makeDropDownArray(30, -30), this.validate), "change_by_num")
        this.setColour(180);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    },
    validate: function () {
        changeNumValid = true;
    }
}

Blockly.JavaScript.change_volume_by_number = function (block) {
    let changeVal = "0";
    if (changeNumValid == false) {
        changeVal = "0"
    }
    else {
        changeVal = block.getFieldValue("change_by_num");
    }
    return `change_volume_by_number(${changeVal});\n`;
}