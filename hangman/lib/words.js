var dictionary = [
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

var blank = "_";

exports.getRandomWord = function(firstTime) {
    var index = firstTime? 0: Math.floor(Math.random() * dictionary.length);
    console.log("getRandomWord: " + dictionary[index]);
    return dictionary[index];
};

exports.initializeProgress = function(word) {
    console.log("typeof(word): " + typeof(word));
    if (!word) {
	return null;
    }
    console.log("length: " + word.length);
    return blank.repeat(word.length);
}

exports.guessLetter = function(word, progress, letter) {
    if (!word) {
	return null;
    }

    var result = "";
    letter = letter.toUpper(); // force to upper case

    // just in case it hasn't been initialized elsewhere
    if (progress == null) {
	result = initializeProgress(word);
    }

    // search for letter matches
    for (var i = 0; i < word.length; ++i) {
        // if find the letter in the word, replace blank; otherwise keep current progress
	result += (word[i] == letter && progress[i] == blank)? letter: progress[i];
    }
    return result;
};

exports.displayProgress = function(progress) {
    if (!progress) {
	return null;
    }

    // pad with spaces for display
    var result = "";
    for (var i = 0; i < progress.length; ++i) {
	result += progress[i] + " ";
    }

    if (result.length > 0) {
	result = result.slice(0, result.length - 1); // cut off last space
    }
    return result;
};