'use strict';

/**
 * Module dependencies.
**/
const path = require('path');
const express = require('express');
const app = express();


// General Configs
const port = process.env.PORT || 8080;

app.use('/static', express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/404', (req, res, next) => next());
app.get('/403', function(req, res, next) {
	// trigger a 403 error
	var err = new Error('not allowed!');
	err.status = 403;
	next(err);
});
app.get('/500', function(req, res, next) {
	// trigger a generic (500) error
	next(new Error('keyboard cat!'));
});
// $ curl http://localhost:8080/notfound
// $ curl http://localhost:8080/notfound -H "Accept: application/json"
// $ curl http://localhost:8080/notfound -H "Accept: text/plain"
app.use(function(req, res, next) {
	res.status(404);
	
	res.format({
		html: function () {
			res.send("<h1>Page not found</h1>");
		},
		json: function () {
			res.json({ error: 'Not found' });
		},
		default: function () {
			res.type('txt').send('Not found');
		}
  });
});

if (!module.parent) {
	app.listen(port);
	console.log(`Node Server Template - Listening on port ${port}`);
}