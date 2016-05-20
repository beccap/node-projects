var GamePlay = require('./lib/gameplay.js').GamePlay;
var game;

// set up express
var express = require('express');
var app = express();

// set up server
var server = require('http').createServer(app);

// set up socket io
var io = require('socket.io')(server);

io.on('connection', function(client) {
    console.log('Client connected...');
    if (game) {
	var session = client.handshake.query.session || 0;
	var start   = client.handshake.query.start || 0;
	console.log('starting game play with session: ' + session + ' and start: ' + start);
	game.startGamePlay(client, session, start);
    }
    client.on('guess', function(letter) {
	console.log("guess: " + letter);
	game.makeGuess(client, letter);
    });
    client.on('undo', function() {
	console.log("undo");
	game.undo(client);
    });
});

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// render home page
app.get('/', function(req, res) {
	res.render('home', { layout: null });
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
        // initialize game, but don't start yet
	game = new GamePlay();
    });
