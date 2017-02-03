var db = require("../models");
var express = require('express');
var router = express.Router();


function passportRoutes(passport){

  router.route('/')
  .get(function(req, res) {
      res.render('hometest',  { user: req.user });
    });

  router.route('/login')
    .get(function(req, res){
      res.render('login', {message: req.flash('loginMessage')});
    })
    .post(passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    }));

  router.route('/signup')
    // .get(function(req, res){
    //   res.render('signup');
    // })
    .post(function(req,res, next){

      db.User.findOne({ where: {email: req.body.email}}).then(function(user) {
        console.log("user:" + user);
        if (user){
          req.flash('loginMessage', 'This user is already exists');
          return res.redirect('/login');
        }
        else if (req.body.password !== req.body.passwordConfirm) {
          req.flash('loginMessage', 'Passwords do not match, try again');
          return res.redirect('/login');
        }
        else {
          var hash = db.User.generateHash(req.body.password);
          db.User.create({
            email: req.body.email,
            password: hash,
            displayName: req.body.displayName
          }).then(function(user){
            passport.authenticate('local', {
              successRedirect: '/profile',
              failureRedirect: '/login',
              failireFlash: true
            })(req, res, next)});
          }

        });
      });



  router.route('/profile')
    .get(isLoggedIn, function(req, res) {
        res.render('profile', { user: req.user });
      });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
    }

  return router;

}

module.exports = passportRoutes;
