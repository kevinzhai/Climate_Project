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

// Start listening for requests
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});