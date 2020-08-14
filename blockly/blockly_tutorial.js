Blockly.Blocks.go_forward_and_backward = {
    category: 'tutorial',
    "message0": "move forward and backward",
    "previousStatement": true,
    "nextStatement": true,
    "colour": 230,
    "extensions": ["controls_whileUntil_tooltip"],
}

Blockly.JavaScript.go_forward_and_backward = function (block) {
    return `robot_move_dist(0, codubot_velocity, 5, true);\nrobot_move_dist(1, codubot_velocity, 5, true);\n`
}