var config  = require('../config.json');
var express = require('express');
var router  = express.Router();
var lib = require('../lib.js');

function generateStartTaunt(gameId) {
  var idParts = gameId.split('-');
  return "Time for a " + idParts[idParts.length - 1] + "-nado!";
}

var lastDirection = null;

function State(width, height) {
  this.width = width;
  this.height = height;
  this.state = "alive";
  this.score = 100;
  this.coords = [];
}

var state = null;

// Get the state of the snake
router.get(config.routes.state, function (req, res) {
  // Do something here to calculate the returned state

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: config.snake.head_url,
    taunt: config.snake.taunt.state,
    state: state.state || "unknown",
    coords: state.coords || [],
    score: state.score || 0
  };

  return res.json(data);
});

// Start
router.post(config.routes.start, function (req, res) {
  // Do something here to start the game
  // Hint: do something with the incoming game_id? ;)
  console.log('Game ID:', req.body.game_id);

  state = new State(req.body.width, req.body.height);

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: config.snake.head_url,
    taunt: generateStartTaunt(req.body.game_id)
  };

  return res.json(data);
});


// Move
router.post(config.routes.move, function (req, res) {
  // Do something here to generate your move
  //console.log('req.body=', req.body);
  var ourLocation = lib.getOurHeadLocation(req.body.snakes);
  console.log('ourLocation=', ourLocation);
  
  var foodLocation = lib.findClosestFood(ourLocation, req.body.food);
  console.log('foodLocation=', foodLocation);

  var move = lib.nextMove(ourLocation, foodLocation, req.body.snakes, req.body.board, lastDirection);
  console.log('move=' + move);
  
  lastDirection = move;
  // Response data
  var data = {
    move: move, //'up', // one of: ["up", "down", "left", "right"]
    taunt: ''
  };

  return res.json(data);
});

// End the session
router.post(config.routes.end, function (req, res) {
  // Do something here to end your snake's session

  // We don't need a response so just send back a 200
  res.status(200);
  res.end();
  return;
});


module.exports = router;
