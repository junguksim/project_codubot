Blockly.Blocks.codubot_ready = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('codubot Ready');
        this.setColour(45);
        this.setNextStatement(true);
        
    }
}
Blockly.JavaScript.codubot_ready = function () {
    return "var i2c=new I2C();i2c.setup({scl:D27,sda:D26,bitrate:400000});var ir_adc=[0,0,0,0,0];var ir_adc_loop=setInterval(function(){i2c.writeTo(0x0A,[1,10]);i2c.writeTo(0x0A,[14]);var ir_i2c=i2c.readFrom(0x0A,10);ir_adc=[((ir_i2c[0]*256)+ir_i2c[1]),((ir_i2c[2]*256)+ir_i2c[3]),((ir_i2c[4]*256)+ir_i2c[5]),((ir_i2c[6]*256)+ir_i2c[7]),((ir_i2c[8]*256)+ir_i2c[9])]},10);var FORWARD=0;var BACKWARD=1;var LEFT=2;var RIGHT=3;var DIST_TO_ANGLE=33.52;var ROBOT_ANGLE_TO_WHEEL_ANGLE=2.242;var codubot_velocity=50;function robot_move_dist(dir,vel,dist_cm,wait){var wheel_angle=Math.round(dist_cm*DIST_TO_ANGLE);if((dir==FORWARD)||(dir==BACKWARD)){if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[12]);while(i2c.readFrom(0x0A,1)!=0);i2c.writeTo(0x0A,[13]);while(i2c.readFrom(0x0A,1)!=0)}i2c.writeTo(0x0A,[0x02,4,dir,vel,wheel_angle>>8,wheel_angle&0x00FF,(4+dir+vel+(wheel_angle>>8)+(wheel_angle&0x00FF))&0xFF]);if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[12]);while(i2c.readFrom(0x0A,1)!=1);i2c.writeTo(0x0A,[13]);while(i2c.readFrom(0x0A,1)!=1)}}}function robot_turn(dir,vel,angle,wait){var wheel_angle=Math.round(angle*ROBOT_ANGLE_TO_WHEEL_ANGLE);if((dir==LEFT)||(dir==RIGHT)){if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[12]);while(i2c.readFrom(0x0A,1)!=0);i2c.writeTo(0x0A,[13]);while(i2c.readFrom(0x0A,1)!=0)}i2c.writeTo(0x0A,[0x02,4,dir,vel,wheel_angle>>8,wheel_angle&0x00FF,(4+dir+vel+(wheel_angle>>8)+(wheel_angle&0x00FF))&0xFF]);if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[12]);while(i2c.readFrom(0x0A,1)!=1);i2c.writeTo(0x0A,[13]);while(i2c.readFrom(0x0A,1)!=1)}}}function robot_move_angle(dir,vel,angle,wait){if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[12]);while(i2c.readFrom(0x0A,1)!=0);i2c.writeTo(0x0A,[13]);while(i2c.readFrom(0x0A,1)!=0)}i2c.writeTo(0x0A,[0x02,4,dir,vel,angle>>8,angle&0x00FF,(4+dir+vel+(angle>>8)+(angle&0x00FF))&0xFF]);if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[12]);while(i2c.readFrom(0x0A,1)!=1);i2c.writeTo(0x0A,[13]);while(i2c.readFrom(0x0A,1)!=1)}}function robot_stop(){i2c.writeTo(0x0A,[0x02,5,(5)&0xFF])}var LEFT_MOTOR=0;var RIGHT_MOTOR=1;var CLOCKWISE=0;var COUNTER_CLOCKWISE=1;function motor_move(motor,dir,vel,angle,wait){if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[(motor==LEFT_MOTOR?12:13)]);while(i2c.readFrom(0x0A,1)!=0)}i2c.writeTo(0x0A,[0x02,(motor==LEFT_MOTOR?1:2),dir,vel,angle>>8,angle&0x00FF,((motor==LEFT_MOTOR?1:2)+dir+vel+(angle>>8)+(angle&0x00FF))&0xFF]);if(wait==true&&angle!=0){i2c.writeTo(0x0A,[1,1]);i2c.writeTo(0x0A,[(motor==LEFT_MOTOR?12:13)]);while(i2c.readFrom(0x0A,1)!=1)}}function motor_stop(motor){i2c.writeTo(0x0A,[0x02,3,motor,(3+motor)&0xFF])}\n"
}

Blockly.Blocks.set_velocity = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('Set Velocity ');
        this.appendValueInput('velocity')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('% ');
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    }
}

Blockly.JavaScript.set_velocity = function () {
    let velocity = Blockly.JavaScript.valueToCode(this, 'velocity', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `codubot_velocity = ${velocity}\n`;
}
let distValid = false;
Blockly.Blocks.robot_move_dist = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('Move ')
            .appendField(new Blockly.FieldDropdown([
                ['Forward', 0],
                ['Backward', 1]
            ], this.validate), "distDir")
        this.appendDummyInput()
            .appendField('to ')
        this.appendValueInput('dist_cm')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('cm')
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        distValid = true;
    }
}

Blockly.JavaScript.robot_move_dist = function(block) {
    let dist_cm = Blockly.JavaScript.valueToCode(this, 'dist_cm', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    if(distValid === false) {
        dir = 0;
    }
    else {
        dir = block.getFieldValue("distDir")
        console.log("typeof : " + typeof(dir))
        console.log(`dir : ${dir}\n====================\n`);
        if(typeof(dir) != "number") {
            dir = 0;
        }
    }
    return `robot_move_dist(${dir}, codubot_velocity, ${dist_cm}, true)\n`;
}
let turnValid = false;
Blockly.Blocks.robot_turn = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('Turn ')
            .appendField(new Blockly.FieldDropdown([
                ['Left', 0],
                ['Right', 1]
            ],this.validate), "turnDir")
        this.appendDummyInput()
            .appendField('to ')
        this.appendValueInput('angle')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('deg')
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        turnValid = true;
    }
}

Blockly.JavaScript.robot_turn = function(block) {
    let angle = Blockly.JavaScript.valueToCode(this, 'angle', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    if(turnValid === false) {
        dir = 2;
    }
    else {
        dir = block.getFieldValue("turnDir")
        if(typeof(dir) != "number") {
            dir = 2;
        }
        if(dir == 0) {
            dir = 2;
        }
        if(dir == 1) {
            dir = 3;
        }
    }
    return `robot_turn(${dir}, codubot_velocity, ${angle}, true);\n`;
}
let motorTurnValid = false;
let motorValid = false;
Blockly.Blocks.motor_move_by_angle = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('Turn ')
            .appendField(new Blockly.FieldDropdown([
                ['Left motor', 0],
                ['Right motor', 1]
            ],this.validate), "turnMotor")
        this.appendDummyInput()
            .appendField('to')
        this.appendValueInput('angle')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('deg')
            .appendField(new Blockly.FieldDropdown([
                ['CW', 0],
                ['CCW', 1]
            ],this.validateDir), "motorTurnDir")
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        motorValid = true;
    },
    validateDir : function(newValue2) {
        motorTurnValid = true;
    }
}

Blockly.JavaScript.motor_move_by_angle = function(block) {
    let angle = Blockly.JavaScript.valueToCode(this, 'angle', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    if(motorValid === false) {
        motor = 0;
    }
    else {
        motor = block.getFieldValue("turnMotor")
    }
    if(motorTurnValid === false) {
        dir = 0;
    }
    else {
        dir = block.getFieldValue("motorTurnDir")
    }
    console.log(`motor : ${motor}, dir : ${dir}\n===================================\n`);
    console.log(`typeof motor : ${typeof(motor)}, typeof dir : ${typeof(dir)}\n`);
    return `motor_move(${motor}, ${dir}, codubot_velocity, ${angle}, true)\n`;
}

let motorTurnValid_ = false;
let motorValid_ = false;
Blockly.Blocks.motor_move_by_vel = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('Turn ')
            .appendField(new Blockly.FieldDropdown([
                ['Left motor', 0],
                ['Right motor', 1]
            ],this.validate), "turnMotor_")
        this.appendDummyInput()
            .appendField(',velocity')
        this.appendValueInput('vel')
            .setCheck(["Number"])
        this.appendDummyInput()
            .appendField('%')
            .appendField(new Blockly.FieldDropdown([
                ['CW', 0],
                ['CCW', 1]
            ],this.validateDir), "motorTurnDir_")
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        motorValid_ = true;
    },
    validateDir : function(newValue2) {
        motorTurnValid_ = true;
    }
}

Blockly.JavaScript.motor_move_by_vel = function(block) {
    let vel = Blockly.JavaScript.valueToCode(this, 'vel', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    if(motorValid_ === false) {
        motor_ = 0;
    }
    else {
        motor_ = block.getFieldValue("turnMotor_")
    }
    if(motorTurnValid_ === false) {
        dir_ = 0;
    }
    else {
        dir_ = block.getFieldValue("motorTurnDir_")
    }
    return `motor_move(${motor_}, ${dir_}, ${vel}, 0, false)\n`;
}

let motorValid__ = false;
Blockly.Blocks.motor_stop = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('Stop ')
            .appendField(new Blockly.FieldDropdown([
                ['Left', 0],
                ['Right', 1]
            ],this.validate), "stopMotor")
        this.appendDummyInput()
            .appendField('motor')
        this.setColour(200);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
    },
    validate : function(newValue) {
        motorValid__ = true;
    }
}

Blockly.JavaScript.motor_stop = function(block) {
    if(motorValid__ === false) {
        motor__ = 0;
    }
    else {
        motor__ = block.getFieldValue("stopMotor")
        if(typeof(motor__) != "number") {
            motor = 0;
        }
    }
    return `motor_stop(${motor__})\n`;
}


Blockly.Blocks.robot_stop = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('Stop');
        this.setColour(200);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}
Blockly.JavaScript.robot_stop = function () {
    return "robot_stop();\n"
}
let irValid = false;
Blockly.Blocks.ir_sensor = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('GET IR Sensor')
            .appendField(new Blockly.FieldDropdown([
                ['#1', "0"],
                ['#2', "1"],
                ['#3', "2"],
                ['#4', "3"],
                ['#5', "4"]
            ], this.validate), "ir_sensor")
        this.setColour(180);
        this.setOutput(true, 'Number')
        this.setInputsInline(true);
    },
    validate : function () {
        irValid = true;
    }
}
Blockly.JavaScript.ir_sensor = function (block) {
    let irVal ="0";
    if(irValid == false) {
        irVal = "0"
    }
    else {
        irVal = block.getFieldValue("ir_sensor");
    }
    return [`get_ir_adc(${irVal})`, Blockly.JavaScript.ORDER_ATOMIC];
}