
var db = require("./models");

module.exports = function(app) {

  app.post("/signup", function(req, res) {
      db.User.create({
        email: req.body.username,
        password: req.body.password
      }).then(function(){

        res.redirect('/login');
      });
    });
  };

  app.post("/login", function(req, res) {
      passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
      res.redirect('/');
    });
  };

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  //Need Profile built first
  // app.get('/profile',
  // require('connect-ensure-login').ensureLoggedIn(),
  // function(req, res){
  //   res.render('profile', { user: req.user });
  // });

}
