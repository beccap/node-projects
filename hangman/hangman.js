var words = require('./lib/words.js');

var express = require('express');

var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 8081);

// variables
var guessWord = words.getRandomWord(true); // get first word
var progress  = words.initializeProgress(guessWord);
var guessesLeft = 8;

app.get('/', function(req, res) {
	res.render('home', { displayProgress: words.displayProgress(progress), 
                             remainingGuesses: guessesLeft });
    });

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
	res.status('404');
        res.render('404');
    });

// 500 catch-all handler (middleware)
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status('500');
	res.render('500');
    });

app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' + app.get('port') +
		    '; press Ctrl-C to terminate.');
    });