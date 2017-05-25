var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/kylie', function (req, res) {
	res.render('kylie');
});

app.get('/kylie2', function (req, res) {
	res.render('kylie2');
});

app.get('/kevin', function (req, res) {
	res.render('kevin');
});

app.get('/ik', function (req, res) {
	res.render('ik');
});

app.get('/ik2', function (req, res) {
	res.render('ik2');
});

app.get('/craig', function (req, res) {
	res.render('craig_test2');
});

// Start listening for requests
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});