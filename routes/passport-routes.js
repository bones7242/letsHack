var db = require("../models");
var express = require('express');
var router = express.Router();


function passportRoutes(passport){

  // route for 
  router.route('/challenge')
    .get(function(req, res){
      //receive session ID
      var userId = req.query.userId;
      var sessionId = req.query.sessionId;
      var challengeId = req.query.challengeId;
      //render handlebars with session info and challenge info
      db.sequelize.Promise.all([
        db.Session.findOne({
          where: {
            id: sessionId
          },
          include: [{
            model: db.User,
            as: "Teammate"
          }]
        }),
        db.Challenge.findOne({
          where: {
            id: challengeId
          }
        }),
        db.User.findOne({
          attributes: ["id", "displayName"],
          where: {
            id: userId
          }
        })
      ])
      .spread(function(sessionData, challengeData, userData) {
        console.log("sessionData", JSON.parse(JSON.stringify(sessionData)));
        tailoredChallengeData = {
          id: challengeData.id,
          difficulty: challengeData.difficulty,
          name: challengeData.name,
          instructionsAll: challengeData.instructionsAll,
        };
        console.log("what is player A status:", sessionData.playerA);
        if (sessionData.playerA === true || sessionData.playerA === "true"){
          tailoredChallengeData.instructions = challengeData.instructionsA;
          tailoredChallengeData.partnerInstructions = challengeData.instructionsB;
          tailoredChallengeData.startCode = challengeData.startCodeA;
          tailoredChallengeData.test = challengeData.testA;
        } else {
          tailoredChallengeData.instructions = challengeData.instructionsB;
          tailoredChallengeData.partnerInstructions = challengeData.instructionsA;
          tailoredChallengeData.startCode = challengeData.startCodeB;
          tailoredChallengeData.test = challengeData.testB;
        }
        console.log("tailoredChallengeData", JSON.parse(JSON.stringify(tailoredChallengeData)));
        res.render("challenge", {session: sessionData, challenge: tailoredChallengeData, user: userData, partner: sessionData.Teammate});  //note: can we re-authenticate?
      });
    });

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
