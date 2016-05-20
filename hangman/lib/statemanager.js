var State = require('./state.js').State; // import State prototype

// intended to be a singleton
function StateManager() {

    this.sessionArray = []; // this will allow for multiple state sessions
    this.sessionArray.push([]);
    this.session = 0;
    this.client = null;

    this.logMakeGuess = function(letter, isCorrect) {
	addState(this, "guess", letter, isCorrect);
    };

    this.logStartNewWord = function(word, oldWord) {
	addState(this, "newword", word, oldWord);
    };

    this.logOutOfGuesses = function(word) {
	addState(this, "outofguesses", word);
    };

    this.logSolved = function(word) {
	addState(this, "solved", word);
    };

    this.initializeSession = function(client, session, start) {
	this.client = client;
	this.session = session || 0;

	var stateArray = this.sessionArray[session];
	if (!stateArray) {
	    console.log("ERROR: bad session in initializeSession: " + session);
	    return false;
	}

	// start a new session by making a copy of the state array, ending with the saved start
	var newStateArray = stateArray.slice(0, start + 1);
	this.sessionArray.push(newStateArray);
	session = this.sessionArray.length - 1;

	// emit an event to update URL
	this.emitUpdateQuery();

	return true;
    };

    // update the state on undo
    this.undo = function() {
	return removeState(this);
    };

    // are we at the beginning?
    this.atBeginning = function() {
	return (this.session == 0 && this.sessionArray[0].length == 0);
    }

    // getter for state-array
    this.getStateArray = function() {
	return (this.session < this.sessionArray.length)? this.sessionArray[this.session] : null;
    }

    // creates a query string representing our current state
    this.createStateQuery = function() {
	return "?session=" + this.session + 
               "&start=" + this.sessionArray[this.session].length - 1;
    }

    this.emitUpdateQuery = function() {
	if (this.client) {
	    this.client.emit('update-query', this.createStateQuery());
	}
    }
}

// private functions

// adds a new state to the current session
function addState(stateManager, action, data1, data2) {
    if (!action) {
	console.log("ERROR: invalid action passed to addState");
	return false;
    }

    // get current stateList based on session
    var stateList = stateManager.sessionArray[stateManager.session];
    if (!stateList) {
	console.log("ERROR: Bad session in addState: " + stateManager.session);
	return false;
    }

    // add action to session's stateList
    stateList.push(new State(action, data1, data2));

    // emit an event to update URL
    stateManager.emitUpdateQuery();

    return true;
} 

// removes the last state from the session and returns the state that was removed
function removeState(stateManager) {

    // get current stateList based on session
    var stateList = stateManager.sessionArray[stateManager.session];
    if (!stateList) {
	console.log("ERROR: Bad session in removeState: " + stateManager.session);
	return false;
    }

    // emit an event to update URL
    stateManager.emitUpdateQuery();
    
    // return the popped state
    return (stateList.length > 0)? stateList.pop: null;
}

exports.StateManager = StateManager;