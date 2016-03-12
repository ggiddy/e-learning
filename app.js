/* global __dirname, module */

var express = require('express');
var socket_io = require('socket.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var io = socket_io();
var administrator = require('./routes/admin')(io);
var instructor = require('./routes/instructor')(io);
var index = require('./routes/index')(io);
var student  = require('./routes/student')(io);
var access = require('./routes/access_middleware')();
var resourses = require('./routes/resourses')(__dirname, io);

mongoose.connect(config.database);

var app = express();

app.io = io;

var authenticate = require('./routes/authenticate');


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

app.use('/auth', authenticate);
app.use('/admin', administrator);
app.use('/instructor', instructor);
app.use('/student', student);
app.use('/access', access);
app.use('/resourses', resourses);

//Add some socket events



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.warn(err);
  next();
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
