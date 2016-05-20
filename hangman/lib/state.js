// Possible Actions:

// newword:      happens when stating a new word
// guess:        user makes a guess
// outofguesses: user has no more guesses
// solved:       user has solved the hangman

function State(action, data) {
    this.action = action;
    this.data = data;
}

exports.State = State;