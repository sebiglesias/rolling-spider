var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//  Rolling spider library
var RollingSpider   = require('rolling-spider');
var rollingSpider   = new RollingSpider();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//  Acciones del drone
app.get('/:action', function (req, res) {
    let action = req.params.action
    if (action === 'conectar') {
        console.log('Iniciar drone');
        rollingSpider.connect(function (e) {
            console.log('Drone conectado');
            rollingSpider.setup(function () {
                rollingSpider.flatTrim();
                rollingSpider.startPing();
                rollingSpider.flatTrim();
            });
        });
    } else
    if (action === 'despegar') {
      console.log('Drone listo para volar');
      rollingSpider.takeOff(function () {});
    } else 
    if (action === 'aterrizar') {
        rollingSpider.land(function () {
            console.log('Aterrizando');
            process.exit(0);
        });
    } else {
        console.log('Ninguna acción definida');
    }
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
