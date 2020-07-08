var move_queue = [];
var move_stopped = true;
var move_waitted = false;
var move_job_number = 0;
var curr_callback_id;
var move_curr_job;
var move_start_time;
var checked = 'checked'
var unchecked = 'unchecked'
var i2c = new I2C(); i2c.setup({ scl: D27, sda: D26, bitrate: 100000 }); var FORWARD = 0; var BACKWARD = 1; var LEFT = 2; var RIGHT = 3; 
var LEFT_MOTOR = 0; var RIGHT_MOTOR = 1; var CLOCKWISE = 0; var COUNTER_CLOCKWISE = 1; var ir_adc = [0, 0, 0, 0, 0]; var DIST_TO_ANGLE = 33.645; var ROBOT_ANGLE_TO_WHEEL_ANGLE = 3;
function next_move_check() {
    if (move_queue.length > 0) {
        start_move_queue();
    } else {
        move_stopped = true;
    }
}
function after_move_end() {
    move_curr_job.c(); next_move_check();
}
function start_move_queue() {
    move_curr_job = move_queue.shift(); move_curr_job.f(); curr_callback_id = setTimeout(after_move_end, move_curr_job.t); move_stopped = false; move_start_time = Date.now();
}
function add_move_queue(ff, tt, cc) {
    move_queue.push({ f: ff, t: tt, c: cc, n: move_job_number++ }); if (move_stopped) { start_move_queue(); }
}
function cancel_curr_move() {
    if (move_stopped) { return; } robot_stop(); clearTimeout(curr_callback_id); next_move_check();
}
function cancel_last_move() {
    if (move_stopped) { return; }
    if (move_queue.length > 1) { move_queue.pop(); }
    else { cancel_curr_move(); }
}
function cancel_all_move() {
    if (move_stopped) { return; }
    robot_stop();
    clearTimeout(curr_callback_id); move_stopped = true; move_queue = [];
}
function move_wait() {
    if (move_stopped || move_waitted) { return; }
    robot_stop(); clearTimeout(curr_callback_id);
    var r_time = Date.now() - move_start_time;
    if (r_time < move_curr_job.t) { move_curr_job.t = r_time; }
    move_waitted = true;
}
function move_resume() {
    if (move_waitted) { 
        curr_callback_id = setTimeout(after_move_end, move_curr_job.t); move_curr_job.f(); move_start_time = Date.now(); move_waitted = false; 
    }
}

function robot_move_dist(dir, vel, dist_cm) {
    if ((dir == FORWARD) || (dir == BACKWARD))
        i2c.writeTo(0x01, [0x02, 4, dir, vel, Math.round(dist_cm * DIST_TO_ANGLE) >> 8, Math.round(dist_cm * DIST_TO_ANGLE) & 0x00FF, (4 + dir + vel + (Math.round(dist_cm * 33.645) >> 8) + (Math.round(dist_cm * 33.645) & 0x00FF)) & 0xFF]);
}
function robot_turn(dir, vel, angle, time) {
    add_move_queue(function () {
        if ((dir == LEFT) || (dir == RIGHT))
            i2c.writeTo(0x01, [0x02, 4, dir, vel, (angle * ROBOT_ANGLE_TO_WHEEL_ANGLE) >> 8, (angle * ROBOT_ANGLE_TO_WHEEL_ANGLE) & 0x00FF, (4 + dir + vel + ((angle * ROBOT_ANGLE_TO_WHEEL_ANGLE) >> 8) + ((angle * ROBOT_ANGLE_TO_WHEEL_ANGLE) & 0x00FF)) & 0xFF])
    }, 1000 * time, robot_stop);
}
function robot_move_angle(dir, vel, angle, time) { 
    add_move_queue(function () { 
        i2c.writeTo(0x01, [0x02, 4, dir, vel, angle >> 8, angle & 0x00FF, (4 + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF]) }, time * 1000, robot_stop) 
}
function robot_stop() { i2c.writeTo(0x01, [0x02, 5, (5) & 0xFF]) }
function motor_move(motor, dir, vel, angle, wait) {
    if( wait==true) {
        i2c.writeTo(0x01, [1,1]);
        i2c.writeTo(0x01, [(motor==LEFT_MOTOR? 12:13)]);
        while(i2c.readFrom(0x01,1)!=0){};
    }
    i2c.writeTo(0x01, [0x02, (motor == LEFT_MOTOR ? 1 : 2), dir, vel, angle >> 8, angle & 0x00FF, ((motor == LEFT_MOTOR ? 1 : 2) + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF]);
    if( wait==true) {
        i2c.writeTo(0x01, [1,1]);
        i2c.writeTo(0x01, [(motor==LEFT_MOTOR? 12:13)]);
        while(i2c.readFrom(0x01,1)!=1){};
    }
}
function motor_stop(motor) { i2c.writeTo(0x01, [0x02, 3, motor, (3 + motor) & 0xFF]) }; 
function robot_turn_square(time, count) { for (var i = 0; i < count * 4; i++) { 
    robot_move_angle(0, 0, 0, time); robot_turn(2, 0, 90, 1) } }; var ir_adc_loop = setInterval(function () { i2c.writeTo(0x01, [1, 10]); i2c.writeTo(0x01, [14]); var ir_i2c = i2c.readFrom(0x01, 10); ir_adc = [((ir_i2c[0] * 256) + ir_i2c[1]), ((ir_i2c[2] * 256) + ir_i2c[3]), ((ir_i2c[4] * 256) + ir_i2c[5]), ((ir_i2c[6] * 256) + ir_i2c[7]), ((ir_i2c[8] * 256) + ir_i2c[9])] }, 10); function robot_move_till_fall() { setInterval(function () { print(ir_adc[2]); robot_move_angle(1, 0, 0); if (ir_adc[2] > 500) { robot_stop(); clearInterval() } }, 5) } function robot_move_cross(time) { robot_move_angle(0, 0, 0, time); robot_turn(2, 0, 0, time); robot_move_angle(0, 0, 0, time); robot_move_angle(1, 0, 0, time * 2); robot_move_angle(0, 0, 0, time); robot_turn(3, 0, 0, time); robot_move_angle(0, 0, 0, time); robot_move_angle(1, 0, 0, time * 2)
};

function led_matrix(checkedStr) {
    checkedStr = checkedStr.toString();
    print(checkedStr)
    var checkedArr = checkedStr.split(',');
    for(var i = 0 ; i < checkedArr.length ; i++) {
        if(checkedArr[i] == 'unchecked') {
            continue;
        }
        i2c.writeTo(0x07, [0x02, 2, i, 255, 0, 0, (2 + i + 255 + 0 +  0) & 0xFF]);
    }
    
}

// index

function robot_move_angle_no_time(dir, vel, angle) { 
    i2c.writeTo(0x01, [0x02, 4, dir, vel, angle >> 8, angle & 0x00FF, (4 + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF])
}



//* dotmatrix

var i2c = new I2C(); i2c.setup({ scl: D27, sda: D26, bitrate: 400000 });
function set_brightness(brightness) {
    i2c.writeTo(0x10, [0x02, 1, brightness, (1 + brightness) & 0xFF]);
  }
  
  function print_single_dot(dot, red, green, blue) {
    i2c.writeTo(0x10, [0x02, 2, dot, red, green, blue, (2 + dot + red + green + blue) & 0xFF]);
  }
  
  function print_single_line(rgb_array) {
    console.log('===========rgbStr================')
    console.log(rgb_array);
    var line = rgb_array[0];
    var sum_rgb_array = 0;
    for(var i = 0 ; i < 7 ; i++) {
        sum_rgb_array = (sum_rgb_array + rgb_array[i].reduce((a, b)=>a+b)) & 0xFF;
    }
    i2c.writeTo(0x10, [0x02, 3, line, rgb_array, (3 + line + sum_rgb_array) & 0xFF]);
  }
  
//   function save_single_dot(dot, red, green, blue) {
//     i2c.writeTo(0x07, [0x02, 4, dot, red, green, blue, (4 + dot + red + green + blue) & 0xFF]);
//   }
  
//   function save_single_line(line, rgb_array) {
//     var sum_rgb_array = 0;
//     for(var i = 0 ; i < 7 ; i++)
//       sum_rgb_array = (sum_rgb_array + rgb_array[i].reduce((acc, cur) => acc + cur, 0)) & 0xFF;
//     i2c.writeTo(0x10, [0x02, 5, line, rgb_array, (5 + line + sum_rgb_array) & 0xFF]);
//   }
  
//   function updata_dot_matrix() {
//     i2c.writeTo(0x10, [0x02, 6, (6) & 0xFF]);
//   }
  
//   function print_every_line(rgb_array) {
//     for(var i = 0 ; i < 7 ; i++)
//       save_single_line(i, [rgb_array[(i * 7) + 0], rgb_array[(i * 7) + 1], rgb_array[(i * 7) + 2], rgb_array[(i * 7) + 3], rgb_array[(i * 7) + 4], rgb_array[(i * 7) + 5], rgb_array[(i * 7) + 6]]);
//     updata_dot_matrix();
//   }
  
//   function clear_dot_matrix() {
//     print_every_line([[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
//                       [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
//                       [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
//                       [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
//                       [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
//                       [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
//                       [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]);
//   }

// * 0605 기본 모듈
var i2c = new I2C();
i2c.setup({scl: D27, sda: D26, bitrate: 400000});

var ir_adc = [0, 0, 0, 0, 0];

var ir_adc_loop = setInterval(function() {
  i2c.writeTo(0x0A, [1, 10]); i2c.writeTo(0x0A, [14]); var ir_i2c = i2c.readFrom(0x0A, 10);
  ir_adc = [((ir_i2c[0] * 256) + ir_i2c[1]), // 적외선 센서 #1 (A0, PF7, ADC7) ADC값 환산
        ((ir_i2c[2] * 256) + ir_i2c [3]), // 적외선 센서 #2 (A1, PF6, ADC6) ADC값 환산
        ((ir_i2c[4] * 256) + ir_i2c [5]), // 적외선 센서 #3 (A2, PF5, ADC5) ADC값 환산
        ((ir_i2c[6] * 256) + ir_i2c [7]), // 적외선 센서 #4 (A3, PF4, ADC4) ADC값 환산
        ((ir_i2c[8] * 256) + ir_i2c [9])]; // 적외선 센서 #5 (A4, PF1, ADC1) ADC값 환산
}, 10);

var FORWARD = 0; var BACKWARD = 1; var LEFT = 2; var RIGHT = 3;
var DIST_TO_ANGLE = 34.716; // 1 cm = 34.716 deg, // 10.37 cm = 360 deg
var ROBOT_ANGLE_TO_WHEEL_ANGLE = 2.242; // Robot 360 deg = Wheel 2.242 * 360 deg 
var codubot_velocity = 50;

function robot_move_dist(dir, vel, dist_cm, wait) {
  var wheel_angle = Math.round(dist_cm * DIST_TO_ANGLE);
  if ((dir == FORWARD) || (dir == BACKWARD)) {
    if(wait == true) {
        i2c.writeTo(0x0A, [1, 1]);  
        i2c.writeTo(0x0A, [12]); 
        while (i2c.readFrom(0x0A, 1) != 0) {}; 
        i2c.writeTo(0x0A, [13]); 
        while (i2c.readFrom(0x0A, 1) != 0) {};
    }
    i2c.writeTo(0x0A, [0x02, 4, dir, vel, wheel_angle >> 8, wheel_angle & 0x00FF, (4 + dir + vel + (wheel_angle >> 8) + (wheel_angle & 0x00FF)) & 0xFF]);
    if(wait == true) {
        i2c.writeTo(0x0A, [1, 1]); 
        i2c.writeTo(0x0A, [12]); 
        while (i2c.readFrom(0x0A, 1) != 1) {}; 
        i2c.writeTo(0x0A, [13]); 
        while (i2c.readFrom(0x0A, 1) != 1) {};
    }
  }
}

function robot_turn(dir, vel, angle, wait) {
  var wheel_angle = Math.round(angle * ROBOT_ANGLE_TO_WHEEL_ANGLE);
  if ((dir == LEFT) || (dir == RIGHT)) {
    if(wait == true) {
        i2c.writeTo(0x0A, [1, 1]);  i2c.writeTo(0x0A, [12]); 
        while (i2c.readFrom(0x0A, 1) != 0) {}; i2c.writeTo(0x0A, [13]); 
        while (i2c.readFrom(0x0A, 1) != 0) {};}
    i2c.writeTo(0x0A, [0x02, 4, dir, vel, wheel_angle >> 8, wheel_angle & 0x00FF, (4 + dir + vel + (wheel_angle >> 8) + (wheel_angle & 0x00FF)) & 0xFF]);
    if(wait == true) {
        i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [12]); 
        while (i2c.readFrom(0x0A, 1) != 1){}; i2c.writeTo(0x0A, [13]); 
        while (i2c.readFrom(0x0A, 1) != 1){};}
  }
}

function robot_move_angle(dir, vel, angle, wait) {
  if(wait == true) {
      i2c.writeTo(0x0A, [1, 1]);  i2c.writeTo(0x0A, [12]);
       while (i2c.readFrom(0x0A, 1) != 0) {}; i2c.writeTo(0x0A, [13]); 
       while (i2c.readFrom(0x0A, 1) != 0) {};}
  i2c.writeTo(0x0A, [0x02, 4, dir, vel, angle >> 8, angle & 0x00FF, (4 + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF]);
  if(wait == true) {
      i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [12]); 
      while (i2c.readFrom(0x0A, 1) != 1) {}; i2c.writeTo(0x0A, [13]); 
      while (i2c.readFrom(0x0A, 1) != 1) {};}
}

function robot_stop() {
  i2c.writeTo(0x0A, [0x02, 5, (5) & 0xFF]);
}

var LEFT_MOTOR = 0; var RIGHT_MOTOR = 1;
var CLOCKWISE = 0; var COUNTER_CLOCKWISE = 1;

function motor_move (motor, dir, vel, angle, wait) {
  if(wait == true) {
      i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [(motor == LEFT_MOTOR ? 12 : 13)]); 
      while (i2c.readFrom(0x0A, 1) != 0) {};}
  i2c.writeTo(0x0A, [0x02, (motor == LEFT_MOTOR ? 1 : 2), dir, vel, angle >> 8, angle & 0x00FF, ((motor == LEFT_MOTOR ? 1 : 2) + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF]);
  if(wait == true) {
      i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [(motor == LEFT_MOTOR ? 12 : 13)]); 
      while (i2c.readFrom(0x0A, 1) != 1) {};}
}

function motor_stop(motor) {
  i2c.writeTo(0x0A, [0x02, 3, motor, (3 + motor) & 0xFF]);
}

function get_ir_adc(idx) {
    return ir_adc[idx];
}

//* 거리모듈
var dist_slave_id = 0; 
var dist_16 = [0, 0, 0];
var dist_loop = setInterval(function() {
  var dist_8 = i2c.readFrom(0x0B, 8);
  dist_slave_id = dist_8[0];
  dist_16 = [((dist_8[2] * 256) + dist_8[3]), 
        ((dist_8[4] * 256) + dist_8 [5]), 
        ((dist_8[6] * 256) + dist_8 [7])];
}, 10);

function get_distance(idx) {
    return dist_16[idx];
}

//* OLED 모듈
var FACE_DEFAULT = 0;
var FACE_ANGRY = 1; var FACE_BLINK = 2;
var FACE_CURIOUS = 3; var FACE_SLEEPY = 4


function oled_face(number) {
  i2c.writeTo(0x0F, [0x02, 1, number, (1 + number) & 0xFF]);
}

//* 보이스 모듈
// i2c.writeTo(0x0D, [1, 1]);
// i2c.writeTo(0x0D, [15]);
var temp_mp3 = i2c.readFrom(0x0D, 1);
var max_number_mp3 = temp_mp3[0];

function play_sound(number) {
  i2c.writeTo(0x0D, [0x02, 80, Math.min(Math.max(parseInt(number), 1), max_number_mp3), (80 + Math.min(Math.max(parseInt(number), 1), max_number_mp3)) & 0xFF]);
}

function stop_sound() {
  i2c.writeTo(0x0D, [0x02, 83, (83) & 0xFF]);
}

function change_volume_by_ratio(ratio) {
  ratio = Math.min(Math.max(parseInt(Math.round(0.3 * ratio)), 0), 30);
  i2c.writeTo(0x0D, [1, 1]);
  i2c.writeTo(0x0D, [14]);
  var current_volume = i2c.readFrom(0x0D, 1);
  var number = ratio - current_volume;
  for(var i = 0 ; i < Math.abs(number) ; i++)
  {
    if(number > 0)
      i2c.writeTo(0x0D, [0x02, 85, (85) & 0xFF]);
    else if(number < 0)
      i2c.writeTo(0x0D, [0x02, 68, (68) & 0xFF]);
  }
};

function change_volume_by_number(number) {
  number = Math.min(Math.max(parseInt(number), -30), 30);
  for(var i = 0 ; i < Math.abs(number) ; i++)
  {
    if(number > 0)
      i2c.writeTo(0x0D, [0x02, 85, (85) & 0xFF]);
    else if(number < 0)
      i2c.writeTo(0x0D, [0x02, 68, (68) & 0xFF]);
  }
};