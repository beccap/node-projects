var StateManager = require("./lib/state.js").StateManager;
var State        = require("./lib/state.js").State;
var Words        = require("./lib/words.js").Words;

// intended to be a singleton
function GamePlay(app, io) {
    this.app = app;
    this.io = io;
    this.state = new StateManager();
    this.words = new Words();
    this.words.initialize(null);
}

exports.GamePlay = GamePlay;