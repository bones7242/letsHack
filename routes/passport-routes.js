var db = require("../models");
var express = require('express');
var router = express.Router();


function passportRoutes(passport){

  router.route('/')
  .get(function(req, res) {
      res.redirect('/login');
    });

  // route for creating a session
  router.get("/session/create", function(req, res){
    console.log("** post request received on /session/create."); 
    var userId = req.query.userId;
    var teammateId = req.query.teammateId;
    var matchId = req.query.matchId;
    console.log("userId:", userId);
    console.log("teammateId:", teammateId);
    console.log("matchId:", matchId);
    // 1. select a challenge id that isn't in either user's challenge history.
    db.sequelize.Promise.all([
      db.Session.findAll({
          attributes: ["ChallengeId"],
          where: {
            $or: [{UserId: userId}, {UserId: teammateId}],  // selects if id is user's or teammate's
            success: true // only selects records that have not been solved
          }
      }),
      db.Challenge.findAll({
          attributes: ["id"],
      })
    ])
    .spread(function(sessions, challenges) {
      // parse the results to get an array of the used challenge ids
      var usedChallengeIds = [];
      for (var i = 0; i < sessions.length; i++){
        usedChallengeIds.push(sessions[i].ChallengeId);
      }
      usedChallengeIds = removeDuplicates(usedChallengeIds);
      console.log("used:", usedChallengeIds);
      // parse the array of all possible challenge id
      var allChallengeIds = [];
      for (var i = 0; i < challenges.length; i++){
        allChallengeIds.push(challenges[i].id);
      }
      console.log("total:", allChallengeIds)

      // compare the arrays and remove the used challenges from AllChallengeIds
      var possibleChallengeIds = removeElements(allChallengeIds, usedChallengeIds)
      // select a challenge
      while (matchId < possibleChallengeIds.length){
        matchId * 2;
      };
      var challengeIndex = matchId % possibleChallengeIds.length;
      var challengeToUse = possibleChallengeIds[challengeIndex];

      // 2. create the session and get the information
      db.sequelize.Promise.all([
        db.Session.create({
            success: "false",  // will always be false when created
            ChallengeId: challengeToUse,  // note: must be an valid(existing) ChallengeId
            UserId: userId,  // note: must be an valid(existing) UserId
            TeammateId: teammateId,  // note: must be an valid(existing) UserId
          }),
          db.Challenge.findOne({
              where: {
                id: challengeToUse
              }
          })
        ])
        .spread(function(sessionData, challengeData) {
          // 3. return the information
          var newSession = {
            session: JSON.parse(JSON.stringify(sessionData)),
            challenge: JSON.parse(JSON.stringify(challengeData)),
          };
          console.log("newSession:", newSession);
          res.render("challenge", {session: newSession});
        }).catch(function (err) { 
          console.log("** error occured.  Sent to client as JSON")
          res.json(err);
        });
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON")
      res.json(err);
    });
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
