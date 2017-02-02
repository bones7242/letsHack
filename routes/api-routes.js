
var db = require("../models");

module.exports = function(app) {
  
  // route for returning challenge history (by user id)
  app.get("/user/:userId/challengeHistory", function(req, res){
    var userId = req.params.userId;
    db.Session.findAll({
      where: {
        UserId: userId
      },
      include: [{
        model: db.Challenge,
        as: "Challenge"
      }, {
        model: db.User,
        as: "Teammate"
      }]
    }).then(function(data){
      // to do: parse the results into a summary easily consumed by the front end.
      res.send(data);
    })
  });

  // --- routes for testing (might be usefull in production too) ---
  // route for creating a user 
  app.post("/user/create", function(req, res){  //route to create new user 
    db.User.create({
      email: req.body.email,
      password: req.body.password
      // note: left out "displayName", "firstName", and "lastName"
    }).then(function(newUser){
      res.render("lobby", {user: newUser});  //returns the new user information (that isn't null) as well as "id", "updatedAt", and "createdAt"
    });
  });

  // route for updating a user 
  app.put("/user/update", function(req, res){  //route to update a user 
    db.User.update({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }, {
      where: {
        id: req.body.id  // can change this to displayName or email if that is better 
      }
    }).then(function(result) {
      // returns "1" for success and "0" for failure
      if (result[0] === 1){
        res.send("user successfully updated");
      } else if (result[0] === 0) {
        res.send("user was not successfully updated");
      } else {
        res.send("and unknown error occured");
      };
    });
  })

  // route for creating a session 
  app.post("/session/create", function(req, res){
    //need to select a challenge ID that isn't in either user's challenge history.
    var challengeSelected;
    db.Session.create({
      success: "false",  // will always be false when created 
      teammateId: req.body.teammateId,
      UserId: req.body.userId,  // note: must be an valid(existing) UserId
      ChallengeId: challengeSelected  // note: must be an valid(existing) ChallengeId
    }).then(function(newSession){
      // this page needs data:
      // - all data for the session
      // - all data for challenge (test, starter code, instructions, etc)
      // - screen name or id for logged in user
      // - screen name or id for partner
       res.render("challenge", {session: newSession});  // returns the new session information including "id", "updatedAt", and "createdAt"
    });
  });

  // route to update a session (based on session Id)
  app.put("/session/update", function(req, res){  
    db.Session.update({
      success: req.body.success,
      teammateId: req.body.teammateId,
      UserId: req.body.UserId,
      ChallengeId: req.body.ChallengeId
    }, {
      where: {
        id: req.body.id  
      }
    }).then(function(result) {
      // returns "1" for success and "0" for failure
      if (result[0] === 1){
        res.send("session successfully updated");
      } else if (result[0] === 0) {
        res.send("session was not successfully updated");
      } else {
        res.send("and unknown error occured");
      };
    });
  });

  // route for creating a challenge 
  app.post("/challenge/create", function(req, res){  //route to create a challenge 
    db.Challenge.create({
      difficulty: req.body.difficulty,
      name: req.body.name,
      instructionsAll: req.body.instructionsAll,
      instructionsA: req.body.instructionsA,
      instructionsB: req.body.instructionsB,
      startCodeA: req.body.startCodeA,
      startCodeB: req.body.startCodeB,
      test: req.body.test
    }).then(function(newChallenge){
      res.json(newChallenge);
    });
  });

  // route for updating a challenge 
  app.put("/challenge/update", function(req, res){  //route to update a challenge 
    db.Challenge.update({
      difficulty: req.body.difficulty,
      name: req.body.name,
      instructionsAll: req.body.instructionsAll,
      instructionsA: req.body.instructionsA,
      instructionsB: req.body.instructionsB,
      startCodeA: req.body.startCodeA,
      startCodeB: req.body.startCodeB,
      test: req.body.test
    }, {
      where: {
        id: req.body.id
      } 
    }).then(function(newChallenge){
      res.json(newChallenge);
    });
  });

}
