var MAGIC_CALLBACK_CODE = "function(){NEXT_BLOCKS}";

Blockly.Blocks.coduBot_init = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('CoduBot Init');
        this.setColour(0);
        this.setNextStatement(true);
    }
}
Blockly.JavaScript.coduBot_init = function () {

 return "var i2c=new I2C();i2c.setup({scl:D27,sda:D26,bitrate:100000});var FORWARD=0;var BACKWARD=1;var LEFT=2;var RIGHT=3;var LEFT_MOTOR=0;var RIGHT_MOTOR=1;var CLOCKWISE=0;var COUNTER_CLOCKWISE=1;var ir_adc=[0,0,0,0,0];var DIST_TO_ANGLE=33.645;var ROBOT_ANGLE_TO_WHEEL_ANGLE=3;function robot_move_dist(dir,vel,dist_cm){if((dir==FORWARD)||(dir==BACKWARD))i2c.writeTo(0x01,[0x02,4,dir,vel,Math.round(dist_cm*DIST_TO_ANGLE)>>8,Math.round(dist_cm*DIST_TO_ANGLE)&0x00FF,(4+dir+vel+(Math.round(dist_cm*33.645)>>8)+(Math.round(dist_cm*33.645)&0x00FF))&0xFF])}function robot_turn(dir,vel,angle,time){if((dir==LEFT)||(dir==RIGHT))i2c.writeTo(0x01,[0x02,4,dir,vel,(angle*ROBOT_ANGLE_TO_WHEEL_ANGLE)>>8,(angle*ROBOT_ANGLE_TO_WHEEL_ANGLE)&0x00FF,(4+dir+vel+((angle*ROBOT_ANGLE_TO_WHEEL_ANGLE)>>8)+((angle*ROBOT_ANGLE_TO_WHEEL_ANGLE)&0x00FF))&0xFF]);wait_mgmt(time*1000);robot_stop()}function robot_move_angle(dir,vel,angle,time){i2c.writeTo(0x01,[0x02,4,dir,vel,angle>>8,angle&0x00FF,(4+dir+vel+(angle>>8)+(angle&0x00FF))&0xFF]);wait_mgmt(time*1000);robot_stop()}function basic_mgmt(){var t=getTime()}function wait_mgmt(p){var t=getTime()+p/1000;while(getTime()<t)basic_mgmt()}function robot_stop(){i2c.writeTo(0x01,[0x02,5,(5)&0xFF])}function motor_move(motor,dir,vel,angle){i2c.writeTo(0x01,[0x02,2,motor,vel,angle>>8,angle&0x00FF,(2+motor+vel+(angle>>8)+(angle&0x00FF))&0xFF])}function motor_stop(motor){i2c.writeTo(0x01,[0x02,3,motor,(3+motor)&0xFF])}function robot_turn_square(time,count){for(var i=0;i<count*4;i++){robot_move_angle(0,0,0,time);robot_turn(2,0,90,time)}};var ir_adc_loop=setInterval(function(){i2c.writeTo(0x01,[1,10]);i2c.writeTo(0x01,[14]);var ir_i2c=i2c.readFrom(0x01,10);ir_adc=[((ir_i2c[0]*256)+ir_i2c[1]),((ir_i2c[2]*256)+ir_i2c[3]),((ir_i2c[4]*256)+ir_i2c[5]),((ir_i2c[6]*256)+ir_i2c[7]),((ir_i2c[8]*256)+ir_i2c[9])]},10);function robot_move_till_fall(){setInterval(function(){print(ir_adc[2]);robot_move_angle(1,0,0,1);if(ir_adc[2]>500){robot_stop();clearInterval()}},10)}function robot_move_cross(time){robot_move_angle(0,0,0,time);robot_turn(2,0,0,1);robot_move_angle(0,0,0,time);robot_move_angle(1,0,0,time*2);robot_move_angle(0,0,0,time);robot_turn(3,0,0,1);robot_move_angle(0,0,0,time);robot_move_angle(1,0,0,time*2)}function line_trace(){var ir_adc=[];var ir_adc_loop=setInterval(function(){i2c.writeTo(0x01,[1,10]);i2c.writeTo(0x01,[14]);var ir_i2c=i2c.readFrom(0x01,10);ir_adc=[((ir_i2c[0]*256)+ir_i2c[1]),((ir_i2c[2]*256)+ir_i2c[3]),((ir_i2c[4]*256)+ir_i2c[5]),((ir_i2c[6]*256)+ir_i2c[7]),((ir_i2c[8]*256)+ir_i2c[9])];console.log('s0: ',ir_adc);if(ir_adc[2]>400){robot_move_angle_no_time(1,0,0)}else{robot_stop()}},200)}function robot_move_angle_no_time(dir,vel,angle){i2c.writeTo(0x01,[0x02,4,dir,vel,angle>>8,angle&0x00FF,(4+dir+vel+(angle>>8)+(angle&0x00FF))&0xFF])}\n"

}

Blockly.Blocks.robot_move_angle = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('로봇 각도로 움직이기');
        this.appendValueInput('dir')
            .setCheck(['Number'])
            .appendField('방향');
        this.appendValueInput('vel')
            .setCheck(['Number'])
            .appendField('속도');
        this.appendValueInput('angle')
            .setCheck(['Number'])
            .appendField('각도');
        this.appendValueInput('time')
            .setCheck(['Number'])
            .appendField('시간');
        this.setColour(150);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.robot_move_angle = function () {
    var dir = Blockly.JavaScript.valueToCode(this, 'dir', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var vel = Blockly.JavaScript.valueToCode(this, 'vel', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var angle = Blockly.JavaScript.valueToCode(this, 'angle', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var time = Blockly.JavaScript.valueToCode(this, 'time', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `robot_move_angle(${dir}, ${vel}, ${angle}, ${time})\n`
}

Blockly.Blocks.robot_turn = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('로봇 회전하기');
        this.appendValueInput('dir')
            .setCheck(['Number'])
            .appendField('방향');
        this.appendValueInput('vel')
            .setCheck(['Number'])
            .appendField('속도');
        this.appendValueInput('angle')
            .setCheck(['Number'])
            .appendField('각도');
        this.appendValueInput('time')
            .setCheck(['Number'])
            .appendField('시간');
        this.setColour(150);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.robot_turn = function () {
    var dir = Blockly.JavaScript.valueToCode(this, 'dir', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var vel = Blockly.JavaScript.valueToCode(this, 'vel', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var angle = Blockly.JavaScript.valueToCode(this, 'angle', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var time = Blockly.JavaScript.valueToCode(this, 'time', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `robot_turn(${dir}, ${vel}, ${angle}, ${time})`;
}

Blockly.Blocks.robot_stop = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('로봇 멈추기');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(270);
    }
}

Blockly.JavaScript.robot_stop = function () {
    return `robot_stop()`;
}

Blockly.Blocks.robot_move_dist = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('입력받은 거리만큼 로봇 움직이기');
        this.appendValueInput('dir')
            .setCheck(['Number'])
            .appendField('방향');
        this.appendValueInput('vel')
            .setCheck(['Number'])
            .appendField('속도');
        this.appendValueInput('dist_cm')
            .setCheck(['Number'])
            .appendField('거리');
        this.setColour(150);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.robot_move_dist = function () {
    var dir = Blockly.JavaScript.valueToCode(this, 'dir', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var vel = Blockly.JavaScript.valueToCode(this, 'vel', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var dist_cm = Blockly.JavaScript.valueToCode(this, 'dist_cm', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `robot_move_dist(${dir}, ${vel}, ${dist_cm})`
}

Blockly.Blocks.motor_move = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('모터 움직이기');
        this.appendValueInput('motor')
            .setCheck(['Number'])
            .appendField('움직일 모터');
        this.appendValueInput('vel')
            .setCheck(['Number'])
            .appendField('속도');
        this.appendValueInput('angle')
            .setCheck(['Number'])
            .appendField('각도');
        this.setColour(150);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.motor_move = function () {
    var motor = Blockly.JavaScript.valueToCode(this, 'motor', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var vel = Blockly.JavaScript.valueToCode(this, 'vel', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var angle = Blockly.JavaScript.valueToCode(this, 'angle', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `motor_move(${motor}, ${vel}, ${angle})`
}

Blockly.Blocks.motor_stop = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('모터 멈추기');
        this.appendValueInput('motor')
            .setCheck(['Number'])
            .appendField('멈출 모터');
        this.setColour(270);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.motor_stop = function () {
    var motor = Blockly.JavaScript.valueToCode(this, 'motor', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `motor_stop(${motor})`
}


Blockly.Blocks.robot_turn_square = {
    category: 'CoduBot',
    init: function () {
        this.appendDummyInput()
            .appendField('로봇 한바퀴 돌리기');
        this.appendValueInput('time')
            .setCheck(['Number'])
            .appendField('구동 시간');
        this.appendValueInput('count')
            .setCheck(['Number'])
            .appendField('회전 횟수');
        this.setColour(270);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}
Blockly.JavaScript.robot_turn_square = function () {
    var time = Blockly.JavaScript.valueToCode(this, 'time', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    var count = Blockly.JavaScript.valueToCode(this, 'count', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `robot_turn_square(${time}, ${count});`
}

Blockly.Blocks.robot_move_till_fall = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('떨어지기 전까지 로봇 움직이기')
        this.setColour(270);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.robot_move_till_fall = function() {
    return `robot_move_till_fall();`
}

Blockly.Blocks.robot_move_cross = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('로봇 십자모양으로 움직이기')
        this.appendValueInput('time')
            .setCheck(['Number'])
            .appendField('구동 시간');
        this.setColour(270);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.robot_move_cross = function () {
    var time = Blockly.JavaScript.valueToCode(this, 'time', Blockly.JavaScript.ORDER_ASSIGNMENT) || '""';
    return `robot_move_cross(${time})`
}

Blockly.Blocks.line_trace = {
    category : 'CoduBot',
    init : function() {
        this.appendDummyInput()
            .appendField('라인 트레이싱')
        this.setColour(270);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
}

Blockly.JavaScript.line_trace = function () {
    return `line_trace()\n;`
}