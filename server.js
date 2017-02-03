var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var PORT = process.env.PORT || 3000;

var db = require("./models");

//Setting the local authetication strategy, may want to move this to a separate document in future
passport.use(new LocalStrategy({
  usernameField: 'email'
  },
  function(email, password, done) {
    db.User.findOne({ where: {email: email}}).then(function(user) {
      if (!user) {
        return done(null, false);
      } else if (password != user.password) {
        return done(null, false);
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
    }, function (err, user) {
      if (err) { return cb(err); }
      console.log("deserialize: " + user);
      cb(null, user);
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



app.use(passport.initialize());
app.use(passport.session());


require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/passport-routes.js")(app, passport);

db.sequelize.sync({force: true}).then(function(){
  app.listen(PORT, function() {
    //create seeds testing
    var seeds = require("./db/seeds.js");
    seeds.createSeeds();
    //log that you are on port 
    console.log("Listening on PORT " + PORT);
  });
});
