var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');

var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var passportRoutes = require('./routes/passport-routes.js');
var methodOverride = require('method-override');
var passportConfig = require("./config/passport.json");

var PORT = process.env.PORT || 3000;
var db = require("./models");

//Setting the local authetication strategy
passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
  function(req, username, password, done) {
    db.User.findOne({ where: {displayName: username}}).then(function(user) {
      if(user){
        var dbCheck = user.password;
      }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Username is incorrect'));
      } else if (!this.validatePassword(password, dbCheck)) {
        return done(null, false, req.flash('loginMessage', 'Password is incorrect'));
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

// setup handelbars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// set static directory
app.use(express.static(path.join(__dirname, '/public')));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(methodOverride("_method"));

app.use(bodyParser.json());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')(passportConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', passportRoutes(passport));
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// include socket.io functionality
// this wraps the server in sockets, to intercept incoming sockets requests
var http = require("./routes/sockets-routes.js")(app);

// start sync db and app
db.sequelize.sync({force: true}).then(function(){
  http.listen(PORT, function() {
    //create seeds testing
    require("./db/seeds.js").createSeeds();
    //log that you are on port
    console.log("Listening on PORT " + PORT);
  });
});
