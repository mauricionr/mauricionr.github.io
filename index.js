const express = require('express');
const compression = require('compression'); // Provides gzip compression for the HTTP response
const serveStatic = require('serve-static');

const app = express();

// Enable gzip compression for all HTTP responses
app.use(compression());

// Allow all of the generated files under "static" to be served up by Express
app.use('/static', serveStatic(__dirname + '/static'));
app.use('/', serveStatic(__dirname + '/'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(8080, function() {
  console.log('Example app listening on port 8080!')
})