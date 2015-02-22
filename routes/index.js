var config  = require('../config.json');
var express = require('express');
var router  = express.Router();
var lib = require('../lib.js');

var lastDirection = null;

// Get the state of the snake
router.get(config.routes.state, function (req, res) {
  // Do something here to calculate the returned state

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: config.snake.head_url,
    taunt: config.snake.taunt.state,
    state: "alive",
    coords: [],
    score: 0
  };

  return res.json(data);
});

// Start
router.post(config.routes.start, function (req, res) {
  console.log('Game ID:', req.body.game_id);

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: (process.env.HEAD_IMAGE_URL || config.snake.head_url),
    taunt: lib.generateStartTaunt(req.body.game_id)
  };

  return res.json(data);
});


// Move
router.post(config.routes.move, function (req, res) {

  var ourLocation = lib.getOurHeadLocation(req.body.snakes);
  console.log('ourLocation=', ourLocation);
  
  var foodLocation = lib.findClosestFood(ourLocation, req.body.food);
  console.log('foodLocation=', foodLocation);

  var move = lib.nextMove(ourLocation, foodLocation, req.body.snakes, req.body.board, lastDirection);
  console.log('move=' + move);
  
  lastDirection = move;

  taunt = '';
  if (move == lib.oppositeDirection(lastDirection)) {
    taunt = "I'd rather kill myself than feed you.";
  }

  // Response data
  var data = {
    move: move, // one of: ["up", "down", "left", "right"]
    taunt: taunt
  };

  return res.json(data);
});

// End the session
router.post(config.routes.end, function (req, res) {
  lastDirection = null;

  // We don't need a response so just send back a 200
  res.status(200);
  res.end();
  return;
});


module.exports = router;
