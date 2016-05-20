var State = require("./state.js").State;

var blank = "_";
var masterDictionary = [
    "RABBIT", 
    "ANTELOPE", 
    "ORANGUTAN",
    "GORILLA", 
    "CHIMPANZEE", 
    "ZEBRA", 
    "COUGAR", 
    "WILDEBEAST",
    "PELICAN",
    "OSPREY"
];

function Words() {

    this.dictionary = [];
    this.currentWord = "";
    this.progress = "";
    this.isFirstWord = true;

    this.initialize = function(stateArray) {

        // start with a copy of the master dictionary
        this.dictionary = masterDictionary.slice(0, masterDictionary.length);
	this.isFirstWord = true;

        // update dictionary and progress based on saved state if it exists
        var numGuessesUsed = 0;
        if (stateArray) {
	    // remove words that have been used
            var currentWord = "";
    	    for (i = 0; i < stateArray.length; ++i) {
                // handle new word
	        if (stateArray[i].action === "newword") {
                    this.currentWord = stateArray[i].data1;
		    var index = this.dictionary.indexOf(this.currentWord);
		    this.dictionary.splice(index, 1);
                    numGuessesUsed = 0;
		    this.progress = initializeProgress(this.currentWord);
		    this.isFirstWord = false;
	        }
                // handle user guess
		else if (stateArray[i].action === "guess") {
                    var letter = stateArray[i].data1;
                    if (!this.guessLetter(letter)) {
			++numGuessesUsed;
		    }
		}
	    }
	}
        return numGuessesUsed;
    };

    // randomly selects a new word and removes it from working dictionary (not master)
    // also initializes the progress to all blanks
    // returns the new word
    this.getNewWord = function() {
        if (this.dictionary.length <= 0) {
	    alert("No words left in dictionary!");
	    return null;
	}

	var index = this.isFirstWord? 0: Math.floor(Math.random() * this.dictionary.length);
	var newWord = this.dictionary[index];
	console.log("getNewWord: " + newWord);

	// remove word from dictionary
	this.dictionary.splice(index, 1);

	console.log("dictionary: " + this.dictionary);

        this.progress = initializeProgress(newWord);
	this.isFirstWord = false;
	this.currentWord = newWord;

	return newWord;
    };

    // use when undo makes us put back a word we were working on
    // restores the dictionary; returns true if we're back to the beginning
    this.restoreWord = function(word, lastWord) {
	// if it is our first word, let the caller know we're back to the beginning
	// and make sure word is added at the start of the array
        this.currentWord = lastWord;
	if (word == masterDictionary[0]) {
	    this.dictionary.unshift(word);
	    this.isFirstWord = true;
	    return true;
	}
	// otherwise, just add it to the end
	else {
	    this.dictionary.push(word);
	    return false;
	}
    };

    // checks a user guess against the current word and updates the progress if there
    // is a match; returns true if there is a match, otherwise returns false
    this.guessLetter = function(letter) {

	// search for letter matches in word
	var foundLetter = false;
	var newProgress = "";
	for (var i = 0; i < this.currentWord.length; ++i) {
	    // if find the letter in the word, replace blank; otherwise keep current progress
            if (this.currentWord[i] == letter &&
		this.progress[i] == blank) {
		newProgress += letter;
		foundLetter = true;
	    }
	    else {
		newProgress += this.progress[i];
	    }
	}
	this.progress = newProgress;
	return foundLetter;
    };

    // undo a guess
    this.unguessLetter = function(letter) {

	// search for letter matches in progress
	var unfoundLetter = false;
        var newProgress   = "";
	for (var i = 0; i < this.progress.length; ++i) {
	    // if find the letter in the word, replace blank; otherwise keep current progress
            if (this.progress[i] == letter) {
		newProgress += blank;
		unfoundLetter = true;
	    }
	    else {
		newProgress += this.progress[i];
	    }
	}
	this.progress = newProgress;
	return unfoundLetter;
    };

    this.hasSolvedWord = function() {
        return (this.progress == this.currentWord);
    };

    // returns a pretty-print version of the progress string
    this.getProgressDisplay = function() {

	// pad with spaces for display
	var result = "";
	for (var i = 0; i < this.progress.length; ++i) {
	    result += this.progress[i] + " ";
	}

	if (result.length > 0) {
	    result = result.slice(0, result.length - 1); // cut off last space
	}
	return result;
    };
}

// private functions

// returns a string the same length as the original word, containing 'blanks' (underscores)
function initializeProgress(word) {
    if (!word) {
	return null;
    }
    return blank.repeat(word.length);
};

exports.Words = Words;