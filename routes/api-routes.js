
var db = require("../models");

// helper function to remove duplicates
function removeDuplicates(array){
  for (var i = array.length; i > 0; i--){
    if ((array.indexOf(array[i]) >= 0) && (array.indexOf(array[i]) < i)) {
      array.splice(i,1);
    };
  };
  return array;
}

// helper function to compare two arrays and return 
function removeElements(startArray, removeArray){
  for (var i = 0; i < startArray.length; i++){
    if (removeArray.indexOf(startArray[i]) >= 0) {
      startArray.splice(i, 1);
    };
  };
  return startArray;
}

// routes to export 
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
    var userId = req.body.userId;
    var teammateId = req.body.teammateId;
    // 1. select a challenge id that isn't in either user's challenge history.
    db.sequelize.Promise.all([
      db.Session.findAll({
          attributes: ["ChallengeId"],
          where: {
            $or: [{UserId: userId}, {UserId: teammateId}]
            //todo: only select those challenge ids for records where 'success = true'
          }
      }),
      db.Challenge.findAll({
          attributes: ["id"],
      })
    ])
    .spread(function(sessions, challenges) {
      // parse the results to get an array of the used challenge ids
      var usedChallengeIds = []; 
      var jsonSessions = JSON.parse(JSON.stringify(sessions));
      for (var i = 0; i < jsonSessions.length; i++){
        usedChallengeIds.push(jsonSessions[i].ChallengeId); //note: for some reason it comes through with ID capitalized 
      }
      usedChallengeIds = removeDuplicates(usedChallengeIds);
      console.log("used:", usedChallengeIds);
      // parse the array of all possible challenge id 
      var allChallengeIds = []; 
      var jsonChallenges = JSON.parse(JSON.stringify(challenges));
      for (var i = 0; i < jsonChallenges.length; i++){
        allChallengeIds.push(jsonChallenges[i].id); //note: for some reason it comes through with ID capitalized 
      }
      console.log("total:", allChallengeIds)
      // compare the arrays to and remove the used challenges from AllChallengeIds 
      var possibleChallengeIds = removeElements(allChallengeIds, usedChallengeIds)
      // select a challenge
      var challengeToUse = possibleChallengeIds[0];
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
          // this page needs the following data:
          // - all data for the session
          // - all data for challenge (test, starter code, instructions, etc)
          // - screen name or id for logged in user  >> located at sessionData.UserId
          // - screen name or id for partner  >> located at sessionData.TeammateId
          var newSession = {
            sessionData: JSON.parse(JSON.stringify(sessionData)),
            challengeData: JSON.parse(JSON.stringify(challengeData)),
          };
          console.log("newSession:", newSession);
          res.render("Challenge", {session: newSession});
        });
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
