var db = require("../models");
var express = require('express');
var router = express.Router();


function passportRoutes(passport){

  router.route('/')
  .get(function(req, res) {
      res.redirect('/login');
    });

  router.route('/login')
    .get(function(req, res){
      res.render('login', {
        message: req.flash('loginMessage'), 
        user: req.user
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/lobby',
      failureRedirect: '/login',
      failureFlash: true
    }));

  router.route('/user/create')
    .post(function(req,res, next){

      db.User.findOne({ where: {displayName: req.body.username}}).then(function(user) {

        if (user){
          req.flash('loginMessage', 'This user already exists');
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
            displayName: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
          }).then(function(user){
            passport.authenticate('local', {
              successRedirect: '/lobby',
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


  router.route('/lobby')
    .get(isLoggedIn, function(req, res) {
      res.render("lobby", {user: req.user});
    });



  function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('loginMessage', 'Please log in');
    res.redirect('/login');
    }

  return router;

}

module.exports = passportRoutes;
