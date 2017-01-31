var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


var PORT = process.env.PORT || 9000;

var db = require("./models");

//Local sign in call, may want to move this to separate document in future
passport.use(new Strategy({
  usernameField: 'email'
},
  function(email, password, cb) {
    db.User.findOne({ where: {email: email}}).then(function(user) {
      console.log(user);
      if (!user) {
        return cb(null, false);
      } else if (password != user.password) {
        return cb(null, false);
      } else {
        return cb(null, user);
      }
    }).catch(function(err){
      return cb(err);
    });
}));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.User.findOne({
      where: {
        'id': id
      }
    }, function (err, user) {
      if (err) { return cb(err); }
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


// require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);


  app.post('/login',
          function (req, res, next) {
              // console.log(req.user.isAuthenticated());
              next();
          },
          passport.authenticate('local',{
                  successRedirect: '/',
                  failureRedirect: '/login'
              }
          ));
// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/signup'}),
//   function (req, res){
//     console.log("passport user", req.user.email);
//
//     res.redirect('/profile');
//   });


app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.post("/signup", function(req, res) {
      db.User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      }).then(function(){

        res.redirect('/login');
      });
    });


db.sequelize.sync().then(function(){
  app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
  });
});
