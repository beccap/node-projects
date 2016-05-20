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

    this.initialize = function(stateArray) {

        // start with a copy of the master dictionary
        this.dictionary = masterDictionary.slice(0, masterDictionary.length);

        // update dictionary and progress based on saved state if it exists
        var numGuessesUsed = 0;
        if (stateArray) {
	    // remove words that have been used
            var currentWord = "";
    	    for (i = 0; i < stateArray.length; ++i) {
                // handle new word
	        if (stateArray[i].action === "newword") {
                    this.currentWord = stateArray[i].data;
		    var index = this.dictionary.indexOf(this.currentWord);
		    this.dictionary.splice(index, 1);
                    numGuessesUsed = 0;
		    this.progress = initializeProgress(this.currentWord);
	        }
                // handle user guess
		else if (stateArray[i].action === "guess") {
                    var letter = stateArray[i].data;
                    if (!this.guessLetter(letter)) {
			++numGuessesUsed;
		    }
		}
	    }
	}
        return numGuessesUsed;
    };

    // use when undo makes us put back a word we were working on
    this.restoreWord = function(word) {
	this.dictionary.add(word);
    };

    // randomly selects a new word and removes it from working dictionary (not master)
    // also initializes the progress to all blanks
    // returns the new word
    this.getNewWord = function(firstTime) {
        if (this.dictionary.length <= 0) {
	    alert("No words left in dictionary!");
	    return null;
	}

	var index = firstTime? 0: Math.floor(Math.random() * this.dictionary.length);
	console.log("getRandomWord: " + this.dictionary[index]);

	// remove word from dictionary
	this.dictionary.splice(index, 1);

	console.log("dictionary: " + dictionary);

        this.progress = initializeProgress(this.dictionary[index]);
	return this.dictionary[index];
    };

    // checks a user guess against the current word and updates the progress if there
    // is a match; returns true if there is a match, otherwise returns false
    this.guessLetter = function(letter) {

	letter = letter.toUpper(); // force to upper case

	// search for letter matches
	var foundLetter = false;
	for (var i = 0; i < this.currentWord.length; ++i) {
	    // if find the letter in the word, replace blank; otherwise keep current progress
            if (this.currentWord[i] == letter &&
		this.progress[i] == blank) {
		this.progress[i] = letter;
		foundLetter = true;
	    }
	}
	return foundLetter;
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