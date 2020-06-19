Blockly.Blocks.distance_sensor_start = {
    category: 'Distance Sensor',
    init: function () {
        this.appendDummyInput()
            .appendField('Distance sensor Begins');
        this.setColour(45);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
    }
}

Blockly.JavaScript.distance_sensor_start = function() {
    return `var dist_slave_id=0;var dist_16=[0,0,0];var dist_loop=setInterval(function(){var dist_8=i2c.readFrom(0x0B,8);dist_slave_id=dist_8[0];dist_16=[((dist_8[2]*256)+dist_8[3]),((dist_8[4]*256)+dist_8[5]),((dist_8[6]*256)+dist_8[7])]},10);function get_distance(idx){return dist_16[idx]}\n`;
}
let distanceValid = false;
Blockly.Blocks.get_distance = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('GET Distance')
            .appendField(new Blockly.FieldDropdown([
                ['LEFT', "0"],
                ['CENTER', "2"],
                ['RIGHT', "1"]
            ], this.validate), "distance_sensor")
        this.setColour(180);
        this.setOutput(true, 'Number')
        this.setInputsInline(true);
    },
    validate : function () {
        distanceValid = true;
    }
}
Blockly.JavaScript.get_distance = function (block) {
    let disVal ="0";
    if(distanceValid == false) {
        disVal = "0"
    }
    else {
        disVal = block.getFieldValue("distance_sensor");
    }
    console.log("disVal : " + disVal)
    return [`get_distance(${disVal})`, Blockly.JavaScript.ORDER_ATOMIC];
}