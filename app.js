/**
 * Module dependencies.
 */

var express = require('express'),
  router = require('./routes/router'),
  http = require('http'),
  path = require('path'),
  MongoStore = require('connect-mongo')(express),
  mongoose = require('mongoose'),
  konphyg = require('konphyg')(__dirname + '/config');

var app = express();
var config = konphyg('sp');

// Attempt connection to database
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', function callback() {
  console.log("Conneciton to database established.");
});

// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: config.secret,
  store: new MongoStore(config.db)
}));
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
