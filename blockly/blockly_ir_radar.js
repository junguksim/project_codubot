Blockly.Blocks.ir_radar_ready = {
    category: 'ir_radar',
    init: function () {
        this.appendDummyInput()
            .appendField('Ir Radar Begins');
        this.setColour(250);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
    }
}
Blockly.JavaScript.ir_radar_ready = function () {
    return "var IR_RADAR_LEFT=0;var IR_RADAR_MIDDLE=1;var IR_RADAR_RIGHT=2;function join_team(team){i2c.writeTo(0x0C,[0x02,(team+65),(team+65)&0xFF])}var ir_radar=[0,0,0,0,0,0,0,0,0];var ir_radar_loop=setInterval(function(){i2c.writeTo(0x0C,[1,15]);i2c.writeTo(0x0C,[12]);var ir_radar_array=i2c.readFrom(0x0C,15);ir_radar=[ir_radar_array[0],ir_radar_array[1],((ir_radar_array[2]*256)+ir_radar_array[3]),((ir_radar_array[4]*256)+ir_radar_array[5]),((ir_radar_array[6]*256)+ir_radar_array[7]),((ir_radar_array[8]*256)+ir_radar_array[9]),((ir_radar_array[10]*256)+ir_radar_array[11]),((ir_radar_array[12]*256)+ir_radar_array[13]),ir_radar_array[14]]},10);\n"
}

let teamValid = false;
Blockly.Blocks.join_team = {
    category: 'ir_radar',
    init: function () {
        this.appendDummyInput()
            .appendField('Set Team')
            .appendField(new Blockly.FieldDropdown([
                ['RED', "0"],
                ['BLUE', "1"],
            ], this.validate), "team_dropdown")
        this.setColour(250);
        this.setInputsInline(true);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
    },
    validate: function () {
        teamValid = true;
    }
}
Blockly.JavaScript.join_team = function (block) {
    let teamVal = "0";
    if (teamValid == false) {
        teamVal = "0"
    }
    else {
        teamVal = block.getFieldValue("team_dropdown")
    }
    return `join_team(${teamVal});\n`;
}

let teamValid_ = false;
let sensorValid = false;
Blockly.Blocks.get_radar = {
    category: 'ir_radar',
    init: function () {
        this.appendDummyInput()
            .appendField('Get Radar, team ')
            .appendField(new Blockly.FieldDropdown([
                ['RED', "0"],
                ['BLUE', "1"],
            ], this.validate), "team_dropdown_")
        this.appendDummyInput()
            .appendField(', Sensor ')
            .appendField(new Blockly.FieldDropdown([
                ['LEFT', "2"],
                ['CENTER', "1"],
                ['RIGHT', "0"]
            ], this.validate_sensor), "sensor_dropdown")
        this.setColour(250);
        this.setOutput(true, 'Number')
        this.setInputsInline(true);
    },
    validate: function () {
        teamValid_ = true;
    },
    validate_sensor: function () {
        sensorValid = true;
    }
}
Blockly.JavaScript.get_radar= function (block) {
    let teamVal_ = "0";
    let sensorVal = "0"
    teamVal_ = false ? "0" : block.getFieldValue("team_dropdown_");
    sensorValid = false ? "0" : block.getFieldValue("sensor_dropdown");
    return [`ir_radar[${teamVal_*3} + ${sensorVal} + 2]`, Blockly.JavaScript.ORDER_ATOMIC];
}
