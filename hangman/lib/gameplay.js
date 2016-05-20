var StateManager = require("./statemanager.js").StateManager;
var Words        = require("./words.js").Words;

var maxGuesses = 8;

// intended to be a singleton
function GamePlay() {
    this.state = new StateManager();
    this.words = new Words();
    this.words.initialize(null);
    this.workingWord = "";
    this.guessesRemaining = 0;

    this.startGamePlay = function(client, session, start) {
	this.state.initializeSession(client, session, start);
	this.words.initialize(this.state.getStateArray());
	if (this.state.atBeginning()) {
	    this.startNewWord(client);
	}
    };

    this.startNewWord = function(client) {
	var newWorkingWord = this.words.getNewWord();
        this.guessesRemaining = maxGuesses;
	this.state.logStartNewWord(client, newWorkingWord, this.workingWord);
	this.workingWord = newWorkingWord;

	// emit events to client, updating progress display and remaining guesses
	this.emitDisplayProgress(client);
	this.emitSetNumGuesses(client);
    };

    this.makeGuess = function(client, letter) {

	letter = letter.toUpperCase(); // force to upper case

	var letterFound = this.words.guessLetter(letter);
	this.state.logMakeGuess(client, letter, letterFound);
        if (letterFound) {
	    // emit event to update progress display
	    this.emitDisplayProgress(client);
	    if (this.words.hasSolvedWord()) {
		this.emitShowAlert(client, "You've guessed the word!");
		this.state.logSolved(client, this.workingWord);
		this.startNewWord(client);
	    }
	}
	else {
            // reduce the number of guesses remaining
	    --this.guessesRemaining;

	    // emit event to update remaining guesses
	    this.emitSetNumGuesses(client);

	    if (this.guessesRemaining <= 0) {
		this.emitShowAlert(client, "All out of guesses! The word was: " + this.workingWord);
		this.state.logOutOfGuesses(client, this.workingWord);
		this.startNewWord(client);
	    }
	    else {
                this.emitShowAlert(client, "The letter " + letter + " is not in the word. You have " +
		      this.guessesRemaining + " guesses left.");
	    }
	}
    };

    this.undo = function(client) {

	var lastState = this.state.undo(client);
	console.log("undoing lastState: " + lastState.action);

	switch (lastState.action) {
	    case "newword":
		// add word back to dictionary
		this.words.restoreWord(lastState.data1, lastState.data2);
		this.workingWord = this.words.currentWord;
		
		// emit display-progress event
		this.emitDisplayProgress(client);

	    case "outofguesses":
	    case "solved":
		// also undo the change immediately before it since this is not a user-change
		this.undo(client);
		break;

	    case "guess":
		// if our last guess was incorrect, increase the guesses remaining
		if (!this.words.unguessLetter(lastState.data1, lastState.data2)) {
		    ++this.guessesRemaining;
		    // emit set-num-guesses event
		    this.emitSetNumGuesses(client);
		}
		else { // update the display
		    this.emitDisplayProgress(client);
		}
		break;
	}
    };

    this.emitDisplayProgress = function(client) {
	if (client) {
	    console.log("progress-display: " + this.words.getProgressDisplay());
	    client.emit('display-progress', { progress: this.words.getProgressDisplay() });
	}
    };

    this.emitSetNumGuesses = function(client) {
	if (client) {
	    client.emit('set-num-guesses', 
                { numGuesses: "Remaining guesses: " + this.guessesRemaining });
	}
    };

    this.emitShowAlert = function(client, msg) {
	if (client) {
	    client.emit('show-alert', { message: msg } );
	}
    };
}

exports.GamePlay = GamePlay;