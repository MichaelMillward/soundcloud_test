var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SC = require('node-soundcloud');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var token = 0;
// Initialize client
SC.init({
  id: 'e8a4c59ab006807fbd0b5fda265802d2',
  secret: '95764ea9b46bca2f63397a9eb26bd2c8',
  uri: 'https://tranquil-atoll-5562.herokuapp.com/redirect'
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use('/users', users);

app.use('/me', function(req, res){

  SC.get('/me', function(err, user) {
  if ( err ) {
    throw err;
  } else {
    console.log('user retrieved:', user);
  }

  res.end();
});

});

app.use('/soundcloud', function(req, res){
  var url = SC.getConnectUrl();
  console.log("hello there");
  res.writeHead(301, {
    'Location': url
  });

  res.end();
});

app.use('/redirect', function(req, res){
  var code = req.query.code;

  SC.authorize(code, function(err, accessToken) {
    if ( err ) {
      throw err;
    } else {
      // Client is now authorized and able to make API calls
      console.log('access token:', accessToken);
      token = accessToken;
    }
  });
  console.log("access token var: " + token);
  res.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
