var words = require('./lib/words.js');
var state = require('./lib/state.js');

// set up express
var express = require('express');
var app = express();

// set up server
var server = require('http').createServer(app);

// set up socket io
var io = require('socket.io')(server);

io.on('connection', function(client) {
    console.log('Client connected...');
    client.on('guess', function(letter) {
	console.log("guess: " + letter);
    });
    client.on('undo', function() {
	console.log("undo");
    });
});

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// variables
var guessWord = words.getRandomWord(true); // get first word
var progress  = words.initializeProgress(guessWord);
var guessesLeft = 8;

app.get('/', function(req, res) {
	res.render('home', { layout: null,
                             displayProgress: words.displayProgress(progress), 
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

// set up port
server.listen(8081, function() {
	console.log('Express started on http://localhost: 8081; press Ctrl-C to terminate.');
    });
