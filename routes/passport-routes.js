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

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  router.route('/profile')
    .get(isLoggedIn, function(req, res) {
        res.render('profile', { showUser: req.user, user: req.user });  // note: why showUser and user if they both contain the same data 
  });

  router.route('/dashboard')
    .get(isLoggedIn, function(req, res) {
      // note: set a check so dashboard only renders if (req.user.role === "admin")
      db.sequelize.Promise.all([  // retrieve challenge and user data from sequelize 
        db.Challenge.findAll({}),
        db.User.findAll({})
      ])
      .spread(function(challengesData, usersData){  

        // clean up the data (if needed)
        console.log( JSON.parse(JSON.stringify(challengesData)));
        // send all teh info to handlebars 
        // console.log({user: req.user, 
        //   challenges: challengesData, 
        //   users: usersData});
        res.render('dashboard', { 
          user: req.user,   
          challenges: JSON.parse(JSON.stringify(challengesData)), 
          users: JSON.parse(JSON.stringify(usersData))
        });
      }).catch(function (err) {
       console.error("** error occured on route /dashboard", err);
       res.json(err);
    });
      
      
  });

  router.route('/lobby')
    .get(isLoggedIn, function(req, res) {
      res.render("lobby", {user: req.user});
  });

  // route for showing info for another user (not own profile for logged in user)
  router.route("/user/:userName")
  .get(function(req, res){
    var userName = req.params.userName;
    db.User.find({
      where: {
        displayName: userName
      }
      // to do: order the results by challengeId and then by date updated
    }).then(function(data){
      data = JSON.parse(JSON.stringify(data)); //cleans up the data for easy reading
      var publicUser = {
        public: true,
        id: data.id,
        displayName: data.displayName,
        present: data.present,
        inQueue: data.inqueue,
        firstName: data.firstName,
        lastName: data.lastName
      };
      res.render('profile', { 
        user: req.user,
        showUser: publicUser 
      });
    }).catch(function (err) {
       console.error("** error occured on route /user/:userName", err);
       res.json(err);
    });
  });

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

  router.route('/challenge')
    .get(function(req, res){
      //receive session ID
      var userId = req.query.userId;
      var sessionId = req.query.sessionId;
      var challengeId = req.query.challengeId;
      //find the current challenge in the DB
      db.sequelize.Promise.all([
        db.Session.findOne({
          where: {
            id: sessionId
          },
          include: [{
            model: db.User,
            as: "playerA"
          }, {
            model: db.User,
            as: "playerB"
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
        JSON.parse(JSON.stringify(sessionData));
        tailoredChallengeData = {
          id: challengeData.id,
          difficulty: challengeData.difficulty,
          name: challengeData.name,
          instructionsAll: challengeData.instructionsAll,
        };
        // determine which player gets which role
        if (sessionData.playerAId === userData.id){
          // this user is player A 
          tailoredChallengeData.instructions = challengeData.instructionsA;
          tailoredChallengeData.partnerInstructions = challengeData.instructionsB;
          tailoredChallengeData.partnerDisplayName = sessionData.playerB.displayName;
          tailoredChallengeData.startCode = challengeData.startCodeA;
          tailoredChallengeData.testArgument = challengeData.testAArgument;
          tailoredChallengeData.testResult = challengeData.testAResult;
        } else {
          // this user is player B 
          tailoredChallengeData.instructions = challengeData.instructionsB;
          tailoredChallengeData.partnerInstructions = challengeData.instructionsA;
          tailoredChallengeData.partnerDisplayName = sessionData.playerA.displayName;
          tailoredChallengeData.startCode = challengeData.startCodeB;
          tailoredChallengeData.testArgument = challengeData.testBArgument;
          tailoredChallengeData.testResult = challengeData.testBResult;
        }
        // send all the info to handlebars
        res.render("challenge", {
          user: userData,
          session: sessionData, 
          challenge: tailoredChallengeData
        });  
      });
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
