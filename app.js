var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose=require('mongoose');
const flash=require("connect-flash");
const User = require('./models/User');
const bcrypt=require('bcryptjs');
const Post=require('./models/Posts');

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true , useUnifiedTopology: true})
const db=mongoose.connection;
db.on('error',console.error.bind(console,'Mongoose connection error'))
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.locals.moment = require('moment');
app.locals.deletePost=function(id){
  console.log('click',id)
  Post.findByIdAndDelete(id,function(err,post){
    if(err){
      app.use(function(req, res, next) {
        next(err);
      });
    }else{
      app.use(function(req,res,next){
        console.log("deleted:",post)
        res.render('posts',{user:req.user});
        return;
      })
    }
  })
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        
        return done(null, false, { message: "Incorrect username" });
      }else{
        if (bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user)
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        }))
        return done(null, user);
        
      }
    });
  })
);  

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
}); 
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

// Access the user object from anywhere in our application
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});





app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
