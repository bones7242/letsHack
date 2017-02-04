
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

  // route for creating a new user
  // app.post("/user/create", function(req, res){  //route to create new user
  //   db.User.create({
  //     email: req.body.email,
  //     password: req.body.password
  //     // note: left out "displayName", "firstName", and "lastName"
  //   }).then(function(newUser){
  //     res.render("lobby", {user: newUser});  //returns the new user information (that isn't null) as well as "id", "updatedAt", and "createdAt"
  //   });
  // });

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
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON")
      res.json(err);
    });
  })

  // route for returning challenge history by user id
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
      // to do: order the results by challengeId and then by date updated
    }).then(function(data){
      data = JSON.parse(JSON.stringify(data)); //cleans up the data for easy reading
      var mappedData = data.map(function(session){
        var newObject = {};
        newObject.ChallengeId = session.ChallengeId;
        newObject.ChallengeName = session.Challenge.name;
        newObject.success = session.success;
        newObject.updatedAt = session.updatedAt;
        newObject.TeammateId = session.Teammate.id;
        newObject.TeammateDisplayName = session.Teammate.displayName;
        return newObject;
      })
      res.json(mappedData);
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON")
      res.json(err);
    });
  });

  // route for creating a session
  app.post("/session/create", function(req, res){
    console.log("** post request received on /session/create."); 
    var userId = req.body.userId;
    var teammateId = req.body.teammateId;
    var matchId = req.body.matchId;
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
          res.json(newSession);
        }).catch(function (err) { 
          console.log("** error occured.  Sent to client as JSON")
          res.json(err);
        });
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON")
      res.json(err);
    });
  });

  // route to render the challenge page
  app.get("/challenge", function(req, res){
    // parse the body
    
    // render the page
    res.render("challenge", {session: newSession});
  }

  // route to update a session (based on session Id)
  app.put("/session/update", function(req, res){
    db.Session.update({
      success: req.body.success,  //update success regardless of case so that the updatedAt gets updated
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(result) {
      if (result[0] === 1){
        console.log("user successfully updated");
        if (req.body.success){  //case for instance where users succeeded
          res.json(true);
        } else {  // fase for instance where users failed
          res.json(false);
        };
      } else if (result[0] === 0) {
        res.send("user was not successfully updated");
      } else {
        res.send("and unknown error occured");
      };
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON")
      res.json(err);
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
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON.")
      res.json(err);
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
    }).catch(function (err) { 
      console.log("** error occured.  Sent to client as JSON.")
      res.json(err);
    });
  });

}
