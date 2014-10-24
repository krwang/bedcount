var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var mongoose = require('mongoose');

var connectionString = "localhost:27017/expressgui_db";
if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "expressgui";
}
mongoose.connect(connectionString);

var db = mongoose.connection;
// var db = monk('localhost/bedcount');

var routes = require('./routes/index.js');
var shelter = require('./routes/shelter.js');
var bedcount = require('./routes/bedcount.js');

var app = express();

// Start app
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8000, process.env.OPENSHIFT_NODEJS_IP || "localhost", function() {
    console.log("ExpressGUI running on port "+(process.env.OPENSHIFT_NODEJS_PORT || 8000)+"...");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/shelter', shelter);
app.use('/bedcount', bedcount);

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
