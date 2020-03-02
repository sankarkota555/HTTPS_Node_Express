var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs = require('fs');
const crypto = require('crypto');
var http = require('http');
var https = require('https');

console.log('path', path.resolve(__dirname, "../file.xml"));
console.log('__dirname', __dirname);

const privateKey = fs.readFileSync('sslcert/simpson.key', 'utf8');
//console.log('privateKey:', privateKey);
//var certificate = fs.readFileSync('sslcert/server-cert.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/simpson.crt', 'utf8');
//console.log('certificate:', certificate);


const certChain = fs.readFileSync('sslcert/certchain.pem', 'utf8');
//console.log('certChain:', certChain);
//console.log('privateKey', privateKey);
//console.log('certificate', certificate);

// var credentials = { key: privateKey, cert: certificate, passphrase: 'pass' };
const credentials = { key: privateKey, cert: certificate, passphrase: '1234' };
//var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8985);
httpsServer.listen(8986, ()=> {
      console.log('Https on 8986');
});

module.exports = app;
