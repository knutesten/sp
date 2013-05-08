/**
 * Module dependencies.
 */

var express = require('express')
  , router = require('./routes/router')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

// Attempt connection to database
mongoose.connect('mongodb://localhost/SP');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function callback() {
  console.log("Conneciton to database established.");
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "Dette er superhemmelig!" }));
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Sets up all the routes
router(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
