var StateManager = require("./statemanager.js").StateManager;
var Words        = require("./words.js").Words;

var maxGuesses = 8;

// intended to be a singleton
function GamePlay() {
    this.client = null;
    this.state = new StateManager();
    this.words = new Words();
    this.words.initialize(null);
    this.workingWord = "";
    this.guessesRemaining = 0;

    this.startGamePlay = function(client, session, start) {
        this.client = client;
	this.state.initializeSession(client, session, start);
	this.words.initialize(this.state.getStateArray());
	if (this.state.atBeginning()) {
	    this.startNewWord();
	}
    };

    this.startNewWord = function() {
	var newWorkingWord = this.words.getNewWord();
        this.guessesRemaining = maxGuesses;
	this.state.logStartNewWord(newWorkingWord, this.workingWord);
	this.workingWord = newWorkingWord;

	// emit events to client, updating progress display and remaining guesses
	this.emitDisplayProgress();
	this.emitSetNumGuesses();
    };

    this.makeGuess = function(letter) {

	letter = letter.toUpper(); // force to upper case

	var letterFound = this.words.guessLetter(letter);
	state.logMakeGuess(letter, letterFound);
        if (letterFound) {
	    if (this.words.hasSolvedWord()) {
		alert("You've guessed the word!");
		state.logSolved(this.workingWord);
		this.startNewWord();
	    }
	    else {
	        // emit event to update progress display
		this.emitDisplayProgress();
	    }
	}
	else {
	    --this.guessesRemaining;
	    if (this.guessesRemaining <= 0) {
		alert("All out of guesses! The word was: " + this.workingWord);
		state.logOutOfGuesses(this.workingWord);
		this.startNewWord();
	    }
	    else {
                alert("The letter " + letter + " is not in the word. You have " +
		      this.guessesRemaining + " left.");
	        // emit event to update remaining guesses
		this.emitSetNumGuesses();
	    }
	}
    };

    this.undo = function() {

	var lastState = this.state.undo();

	switch (lastState.action) {
	    case "newword":
		// add word back to dictionary
		this.words.restoreWord(lastState.data1, lastState.data2);
		this.workingWord = lastState.data2;
		
		// emit display-progress event
		this.emitDisplayProgress();

	    case "outofguesses":
	    case "solved":
		// also undo the change immediately before it since this is not a user-change
		this.undo();
		break;

	    case "guess":
		// if our last guess was incorrect, increase the guesses remaining
		if (!this.words.unguessLetter(lastState.data1, lastState.data2)) {
		    ++guessesRemaining;
		    // emit set-num-guesses event
		    this.emitSetNumGuesses();
		}
		break;
	}
    };

    this.emitDisplayProgress = function() {
	if (this.client) {
	    this.client.emit('display-progress', this.words.getProgressDisplay());
	}
    };

    this.emitSetNumGuesses = function() {
	if (this.client) {
	    this.client.emit('set-num-guesses', this.guessesRemaining);
	}
    };
}

exports.GamePlay = GamePlay;