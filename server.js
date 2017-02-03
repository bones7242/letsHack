var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var passportRoutes = require('./routes/passport-routes.js');


var PORT = process.env.PORT || 3000;

var db = require("./models");

//Setting the local authetication strategy, may want to move this to a separate document in future
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
  function(req, email, password, done) {
    db.User.findOne({ where: {email: email}}).then(function(user) {
      var dbCheck = user.password;

      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Username/Password is incorrect'));
      } else if (!this.validatePassword(password, dbCheck)) {
        return done(null, false, req.flash('loginMessage', 'Username/Password is incorrect'));
      } else {
        return done(null, user);
      }
    }).catch(function(err){
      return done(err);
    });
}));


  passport.serializeUser(function(user, cb) {
    console.log("serialized: " + user.id);
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.User.findOne({
      where: {
        'id': id
      }
    }).then(function(user) {
      console.log("deserialize: " + user);
      cb(null, user);
    }).catch(function(error){
      console.log(error);
    });
  });



var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.

app.use(bodyParser.json());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());


// require("./routes/api-routes.js")(app);
// require("./routes/html-routes.js")(app);


app.use('/', passportRoutes(passport));


db.sequelize.sync().then(function(){
  app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
  });
});
