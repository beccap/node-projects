var State = require('./state.js').State; // import State prototype

// intended to be a singleton
function StateManager() {

    this.sessionArray = []; // this will allow for multiple state sessions
    this.sessionArray.push([]);
    this.session = 0;

    this.logMakeGuess = function(letter) {
	addState(this, "guess", letter);
    };

    this.logStartNewWord = function(word) {
	addState(this, "newword", word);
    };

    this.logOutOfGuesses = function() {
	addState(this, "outofguesses");
    };

    this.logSolved = function(word) {
	addState(this, "solved", word);
    };

    this.initializeSession = function(session, start) {
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

	// TODO: emit an event to update URL
    };

    this.undo = function() {
	return removeState(this);
    };
}

// adds a new state to the current session
function addState(stateManager, action, data) {
    if (!action) {
	console.log("ERROR: invalid action passed to addState");
	return false;
    }

    // get current stateList based on session
    var stateList = stateManager.sessionArray[session];
    if (!stateList) {
	console.log("ERROR: Bad session in addState: " + stateManager.session);
	return false;
    }

    // add action to session's stateList
    stateList.push(new State(action, data));

    // TODO: emit an event to update URL
    return true;
} 

// removes the last state from the session and returns the state that was removed
function removeState(stateManager) {

    // get current stateList based on session
    var stateList = stateManager.sessionArray[session];
    if (!stateList) {
	console.log("ERROR: Bad session in removeState: " + stateManager.session);
	return false;
    }

    // TODO: emit an event to update URL
    
    // return the popped state
    return (stateList.length > 0)? stateList.pop: null;
}

exports.StateManager = StateManager;