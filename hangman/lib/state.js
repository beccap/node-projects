// Possible Actions:

// newword:      happens when stating a new word
// guess:        user makes a guess
// outofguesses: user has no more guesses
// solved:       user has solved the hangman

function State(action, data1, data2) {
    this.action = action;
    this.data1 = data1;
    this.data2 = data2;
}

exports.State = State;