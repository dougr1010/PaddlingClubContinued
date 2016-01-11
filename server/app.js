var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var passport      = require('passport');
var session       = require('express-session');
var localStrategy = require('passport-local').Strategy;
var mongoose      = require('mongoose');
var User          = require('../models/User');

var routes = require('./routes/index');
var users  = require('./routes/users');
var db     = require('./routes/db');

var mongoURI = 'mongodb://localhost:27017/imaginary_paddling';
var mongoDB  = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
  console.log('MongoDB error', err);
});

mongoDB.once('open', function(){
  console.log('Connected to MongoDB');
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/public/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy({passReqToCallback: true, usernameField: 'username'},
    function(req, username, password, done){
        User.findOne({username: username}, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false,{message: 'Incorrect username or password'});
            }
            user.comparePassword(password, function(err, isMatch){
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    done(null, false, {message: 'Incorrect username or password'});
                }
            })
        })
    }
));

passport.serializeUser(function(user, callback){
    callback(null, user.id);
});

passport.deserializeUser(function(id, callback){
    User.findById(id, function(err, user){
        if(err) callback(err);
        callback(null, user)
    });
});

app.use('/', routes);
app.use('/users', users);
app.use('/db', db);
app.use('*', routes);  //allows for page refreshes

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
    throw err;
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
