
module.exports = function(app, passport) {

    app.get('/',
      function(req, res) {
        res.render('hometest', { user: req.user });
      });

    app.get('/login',
      function(req, res){
        res.render('login');
      });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
          // console.log(req.user);
          res.render('hometest', { user: req.user });
        });

      app.get('/profile',
          function(req, res) {
            res.render('profile', { user: req.user });
          });

      // app.post('/login',
      //     function (req, res, next) {
      //           console.log("passport user", req.user);
      //             // console.log(req.user.isAuthenticated());
      //             next();
      //         },
      //         passport.authenticate('local',{
      //                 successRedirect: '/',
      //                 failureRedirect: '/login'
      //             }
      //         ));


    app.get('/logout',
      function(req, res){
        req.logout();
        res.redirect('/');
      });

      app.get("/signup", function(req, res) {
        res.render("signup");
      });

      app.post("/signup", function(req, res) {
          db.User.create({
            email: req.body.username,
            password: req.body.password
          }).then(function(){

            res.redirect('/login');
          });
        });
  }
