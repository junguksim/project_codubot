

// index

function robot_move_angle_no_time(dir, vel, angle) { 
    i2c.writeTo(0x01, [0x02, 4, dir, vel, angle >> 8, angle & 0x00FF, (4 + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF])
}

//* dotmatrix

function set_brightness(brightness) {
  i2c.writeTo(0x10, [0x02, 1, brightness, (1 + brightness) & 0xFF]);
};

function print_single_dot(dot, red, green, blue) {
  i2c.writeTo(0x10, [0x02, 2, dot, red, green, blue, (2 + dot + red + green + blue) & 0xFF]);
};

function print_single_line(line, rgb_array) {
  var sum_rgb_array = 0;
  for(var i = 0 ; i < 7 ; i++) {
    for(var j = 0 ; j < 3; j++) {
      sum_rgb_array += rgb_array[i][j];
    }
  }
  i2c.writeTo(0x10, [0x02, 3, line, rgb_array, (3 + line + sum_rgb_array) & 0xFF]);
};

function save_single_dot(dot, red, green, blue) {
  i2c.writeTo(0x10, [0x02, 4, dot, red, green, blue, (4 + dot + red + green + blue) & 0xFF]);
};

function save_single_line(line, rgb_array) {
  var sum_rgb_array = 0;
  for(var i = 0 ; i < 7 ; i++) {
    for(var j = 0 ; j < 3; j++) {
      sum_rgb_array += rgb_array[i][j];
    }
  }
  i2c.writeTo(0x10, [0x02, 5, line, rgb_array, (5 + line + sum_rgb_array) & 0xFF]);
};

function update_dot_matrix() {
  i2c.writeTo(0x10, [0x02, 6, (6) & 0xFF]);
};

function print_every_line(rgb_array) {
  for(var i = 0 ; i < 7 ; i++) {
    save_single_line(i, [rgb_array[(i * 7) + 0], rgb_array[(i * 7) + 1], rgb_array[(i * 7) + 2], rgb_array[(i * 7) + 3], rgb_array[(i * 7) + 4], rgb_array[(i * 7) + 5], rgb_array[(i * 7) + 6]]);
  }
  update_dot_matrix();
};

function clear_dot_matrix() {
  print_every_line([[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                    [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                    [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                    [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                    [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                    [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
                    [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]);
};

function set_string_color(rgb_array) {
  i2c.writeTo(0x10, [0x02, 7, [rgb_array[0], rgb_array[1], rgb_array[2]], (7 + rgb_array[0] + rgb_array[1] + rgb_array[2]) & 0xFF]);
};

function print_string(string_array) {
  var ascii_array = [];
  var ascii_array_sum = 0;
  var this_ascii = 0;
  for(var i = 0 ; i < ((string_array.length > 20) ? 20 : string_array.length) ; i++) {
    if((string_array[i].charCodeAt(0) >= 32) && (string_array[i].charCodeAt(0) <= 126)) {
      this_ascii = string_array[i].charCodeAt(0);
    }
    else {
      this_ascii = 63; // "?"
    }
    ascii_array.push(this_ascii);
    ascii_array_sum = ascii_array_sum + this_ascii;
  }
  i2c.writeTo(0x10, [0x02, 8, ((string_array.length > 20) ? 20 : string_array.length), ascii_array, (8 + ((string_array.length > 20) ? 20 : string_array.length) + ascii_array_sum) & 0xFF]);
};

//* default
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
var forward_acc = 0; // 단위 m/s^2
var yaw_gyro = 0; // 단위 deg/sec

var imu_loop = setInterval(function() {
  i2c.writeTo(0x0A, [1, 12]); i2c.writeTo(0x0A, [24]); var imu_array = i2c.readFrom(0x0A, 12);
  forward_acc = ((imu_array[2] * 256) + imu_array [3]);
  forward_acc = ((forward_acc <= 32767) ? forward_acc : (-65536 + forward_acc));
  forward_acc = forward_acc * (9.81 / 4096); // 단위 m/s^2
  // + 전진 가속, - 후진 가속
  yaw_gyro = ((imu_array[10] * 256) + imu_array [11]);
  yaw_gyro = ((yaw_gyro <= 32767) ? yaw_gyro : (-65536 + yaw_gyro));
  yaw_gyro = yaw_gyro * (2000 / 32768); // 단위 deg/sec
  // + 시계방향 회전, - 반시계방향 회전
}, 10);


var FORWARD = 0; var BACKWARD = 1; var LEFT = 2; var RIGHT = 3;
var DIST_TO_ANGLE = 33.216; // 1 cm = 33.216 deg, // 10.84 cm = 360 deg
var ROBOT_ANGLE_TO_WHEEL_ANGLE = 2.1086; // Robot 360 deg = Wheel 3.651 * 360 deg 
var codubot_velocity = 50;

function robot_move_dist(dir, vel, dist_cm, wait) {
  var wheel_angle = Math.round(dist_cm * DIST_TO_ANGLE);
  if ((dir == FORWARD) || (dir == BACKWARD)) {
    if(wait == true && wheel_angle != 0) {i2c.writeTo(0x0A, [1, 1]);  i2c.writeTo(0x0A, [12]); while (i2c.readFrom(0x0A, 1) != 0) {}; i2c.writeTo(0x0A, [13]); while (i2c.readFrom(0x0A, 1) != 0) {};}
    i2c.writeTo(0x0A, [0x02, 4, dir, vel, wheel_angle >> 8, wheel_angle & 0x00FF, (4 + dir + vel + (wheel_angle >> 8) + (wheel_angle & 0x00FF)) & 0xFF]);
    if(wait == true && wheel_angle != 0) {i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [12]); while (i2c.readFrom(0x0A, 1) != 1) {}; i2c.writeTo(0x0A, [13]); while (i2c.readFrom(0x0A, 1) != 1) {};}
  }
}

function robot_turn(dir, vel, angle, wait) {
  var wheel_angle = Math.round(angle * ROBOT_ANGLE_TO_WHEEL_ANGLE);
  if ((dir == LEFT) || (dir == RIGHT)) {
    if(wait == true && angle != 0) {i2c.writeTo(0x0A, [1, 1]);  i2c.writeTo(0x0A, [12]); while (i2c.readFrom(0x0A, 1) != 0) {}; i2c.writeTo(0x0A, [13]); while (i2c.readFrom(0x0A, 1) != 0) {};}
    i2c.writeTo(0x0A, [0x02, 4, dir, vel, wheel_angle >> 8, wheel_angle & 0x00FF, (4 + dir + vel + (wheel_angle >> 8) + (wheel_angle & 0x00FF)) & 0xFF]);
    if(wait == true && angle != 0) {i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [12]); while (i2c.readFrom(0x0A, 1) != 1) {}; i2c.writeTo(0x0A, [13]); while (i2c.readFrom(0x0A, 1) != 1) {};}
  }
}

// function robot_move_angle(dir, vel, angle, wait) {
//   if(wait == true && angle != 0) {i2c.writeTo(0x0A, [1, 1]);  i2c.writeTo(0x0A, [12]); while (i2c.readFrom(0x0A, 1) != 0) {}; i2c.writeTo(0x0A, [13]); while (i2c.readFrom(0x0A, 1) != 0) {};}
//   i2c.writeTo(0x0A, [0x02, 4, dir, vel, angle >> 8, angle & 0x00FF, (4 + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF]);
//   if(wait == true && angle != 0) {i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [12]); while (i2c.readFrom(0x0A, 1) != 1) {}; i2c.writeTo(0x0A, [13]); while (i2c.readFrom(0x0A, 1) != 1) {};}
// }

function robot_stop() {
  i2c.writeTo(0x0A, [0x02, 5, (5) & 0xFF]);
}

var LEFT_MOTOR = 0; var RIGHT_MOTOR = 1;
var CLOCKWISE = 0; var COUNTER_CLOCKWISE = 1;

function motor_move (motor, dir, vel, angle, wait) {
  if(wait == true && angle != 0) {i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [(motor == LEFT_MOTOR ? 12 : 13)]); while (i2c.readFrom(0x0A, 1) != 0) {};}
  i2c.writeTo(0x0A, [0x02, (motor == LEFT_MOTOR ? 1 : 2), dir, vel, angle >> 8, angle & 0x00FF, ((motor == LEFT_MOTOR ? 1 : 2) + dir + vel + (angle >> 8) + (angle & 0x00FF)) & 0xFF]);
  if(wait == true && angle != 0) {i2c.writeTo(0x0A, [1, 1]); i2c.writeTo(0x0A, [(motor == LEFT_MOTOR ? 12 : 13)]); while (i2c.readFrom(0x0A, 1) != 1) {};}
}


function motor_stop(motor) {
  i2c.writeTo(0x0A, [0x02, 3, motor, (3 + motor) & 0xFF]);
}

function buzzer_timeout(tone_freq, time_ms) {
  analogWrite(19, 0.5, {freq : tone_freq});
  setTimeout(function () {
  analogWrite(19, 0, {freq: tone_freq});
  }, time_ms);
}
robot_stop();

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
i2c.writeTo(0x0D, [1, 1]);
i2c.writeTo(0x0D, [15]);
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

function play_until_done(number) {
  play_sound(number); 
  i2c.writeTo(0x0D, [1, 1]);  i2c.writeTo(0x0D, [12]); 
  while(i2c.readFrom(0x0D, 1) == 0) {}; 
  while(i2c.readFrom(0x0D, 1) == 1) {};
}

// * 레인보우
var RAINBOW_CW = 0;
var RAINBOW_CCW = 1;
var LED_CW = 2;
var LED_CCW = 3;

function rainbow_clear() {
  i2c.writeTo(0x0E, [0x02, 1, (1) & 0xFF]);
}

function rainbow_single_led(dot, red, green, blue) {
  i2c.writeTo(0x0E, [0x02, 2, dot, red, green, blue, (2  + dot + red + green +  blue) & 0xFF]);
}

function rainbow_all_led(red, green, blue) {
  i2c.writeTo(0x0E, [0x02, 3, red, green, blue, (3 + red + green + blue) & 0xFF]);
}

function rainbow_set_effect(effect_number, delay_ms) {
  var number = ((effect_number > 3) ? 3 : effect_number);
  number = ((number < 0) ? 0 : number);
  var ms = ((delay_ms > 100) ? 100 : delay_ms);
  ms = ((ms < 0) ? 0 : ms);
  i2c.writeTo(0x0E, [0x02, 4, number, ms, (4 + number + ms) & 0xFF]);
}


// * IR Raidar
var RED_TEAM = 0; // 600 hz
var BLUE_TEAM = 1; // 900 hz
var IR_RADAR_LEFT = 2; // 왼쪽 센서
var IR_RADAR_MIDDLE = 1; // 가운데 센서
var IR_RADAR_RIGHT = 0; // 오른쪽 센서

function join_team(team) {
  i2c.writeTo(0x0C, [0x02, (team + 65), (team + 65) & 0xFF]);
}

var ir_radar = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var ir_radar_loop = setInterval(function() {
  i2c.writeTo(0x0C, [1, 15]); i2c.writeTo(0x0C, [12]); var ir_radar_array = i2c.readFrom(0x0C, 15);
  ir_radar = [ir_radar_array[0],
              ir_radar_array[1],
              ((ir_radar_array[2] * 256) + ir_radar_array[3]), //  왼쪽 A팀(600Hz) 센서값
        ((ir_radar_array[4] * 256) + ir_radar_array [5]), // 가운데 A팀(600Hz) 센서값
        ((ir_radar_array[6] * 256) + ir_radar_array [7]), // 오른쪽 A팀(600Hz) 센서값
        ((ir_radar_array[8] * 256) + ir_radar_array [9]), // 왼쪽 B팀(900Hz) 센서값
              ((ir_radar_array[10] * 256) + ir_radar_array [11]), // 가운데 B팀(900Hz) 센서값
        ((ir_radar_array[12] * 256) + ir_radar_array [13]), // 오른쪽 B팀(900Hz) 센서값
              ir_radar_array[14]]; // 현재 팀 0 = RED, 1 = BLUE, 2 = 무소속
}, 10);