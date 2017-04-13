var db = require("../models");
var cloudinaryConfig = require("../config/cloudinary.json");
var cloudinary = require("cloudinary");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret
});

// routes to export
module.exports = function(app) {

  // *** Production Routes ***

  // route for returning challenge history by user id
  app.get("/user/:userId/challengeHistory", function(req, res){
    var userId = req.params.userId;
    db.Session.findAll({
      where: {
        $or: [
            {
              playerAId:
                {
                  $eq: userId
                }
            },
            {
              playerBId:
                {
                  $eq: userId
                }
            }
        ],
        success: true
      },
      include: [{
        model: db.Challenge,
        as: "Challenge"
      }, {
        model: db.User,
        as: "playerA"
      }, {
        model: db.User,
        as: "playerB"
      }],
      order: 'createdAt DESC'
    }).then(function(data){
      data = JSON.parse(JSON.stringify(data)); //cleans up the data for easy reading
      var mappedData = data.map(function(session){
        var newObject = {};
        newObject.ChallengeName = session.Challenge.name;
        newObject.success = session.success;
        newObject.updatedAt = session.updatedAt;
        newObject.playerA = session.playerA.displayName;
        newObject.playerB = session.playerB.displayName;
        return newObject;
      });
       res.json(mappedData);
    }).catch(function (err) {
       console.error("** error occured on route /user/:userId/challengeHistory:", err);
       res.json(err);
    });
  });

  // route for updating a user
  app.put("/user/update", function(req, res){
    //route to update a user
    //console.log(req.user);
    db.User.update({
      email: req.body.email || req.user.email,
      firstName: req.body.firstName || req.user.firstName,
      lastName: req.body.lastName || req.user.lastName
    }, {
      where: {
        displayName: req.body.displayName  // can change this to displayName or email if that is better
      }
    }).then(function(result){
      // returns "1" for success and "0" for failure
      if (result[0] === 1){
        console.log("user successfully updated");
        res.redirect("/profile");
      } else if (result[0] === 0) {
        res.send("user was not successfully updated");
      } else {
        res.send("an unknown error occured");
      };

    }).catch(function (err) {
      console.error("** error occured.  Sent to client as JSON")
      res.json(err);
    })
  });

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
        console.log("session successfully updated");
        if (req.body.success){
          res.json(true);
        } else {
          res.json(false);
        };
      } else if (result[0] === 0) {
        res.send("session was not successfully updated");
      } else {
        res.send("and unknown error occured");
      };
    }).catch(function (err) {
      console.error("** error occured.  Sent to client as JSON")
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
      testAArgument: req.body.testAArgument,
      testAResult: req.body.testAResult,
      testBArgument: req.body.testBArgument,
      testBResult: req.body.testBResult
    }).then(function(newChallenge){
      console.log("challenge successfully created");
      res.redirect("/dashboard");
    }).catch(function (err) {
      console.log("** error occured.  Sent to client as JSON.")
      res.json(err);
    });
  });

  // route for updating a challenge
  app.put("/challenge/update", function(req, res){
    db.Challenge.update({
      difficulty: req.body.difficulty,
      name: req.body.name.trim(),
      instructionsAll: req.body.instructionsAll.trim(),
      instructionsA: req.body.instructionsA.trim(),
      instructionsB: req.body.instructionsB.trim(),
      startCodeA: req.body.startCodeA.trim(),
      startCodeB: req.body.startCodeB.trim(),
      testAArgument: req.body.testAArgument,
      testAResult: req.body.testAResult,
      testBArgument: req.body.testBArgument,
      testBResult: req.body.testBResult
    }, {
      where: {
        id: parseInt(req.body.id) //parsing to int because update form might send as a string
      }
    }).then(function(challengesAffected){
      console.log("challenge successfully updated");
      res.redirect("/dashboard");
    }).catch(function (err) {
      console.log("** error occured.  Sent to client as JSON.")
      res.json(err);
    });
  });

  // route for deleting a challenge
  app.delete("/challenge/delete", function(req, res){
    db.Challenge.destroy({
      where: { id: req.body.id } // parseInt(req.body.id)?
    }).then(function(){
      console.log("challenge successfully deleted");
      res.redirect("/dashboard");
    }).catch(function (err) {
      console.log("** error occured.  Sent to client as JSON.")
      res.json(err);
    });
  });

  // route for creating a report
  app.put("/report/", function(req, res){
    //route to update a user
    db.Report.create({
      reportedBy: req.body.reportedby || req.user.displayName,
      userName: req.body.username || "unknown user",
      reason: req.body.reason || "no reason specified"
    }).then(function(result){
        res.send(result);
    }).catch(function (err) {
      console.error("** error occured.  Sent to client as JSON")
      res.json(err);
    })
  });

  // route for deleting a report
  app.delete("/report/", function(req, res){
    console.log("DELETING ",  req.body.id);
    //route to update a user
    db.Report.destroy({
      where: { id: req.body.id}
    }).then(function(){
      res.redirect("/dashboard");
    }).catch(function (err) {
      console.error("** error occured.  Sent to client as JSON")
      res.json(err);
    })
  });

  // route for sending the client chats that happened just before they entered the room
  app.get("/recentchats/", function(req, res){
    db.Chat.findAll({
      where: { // created at is less than now, and greater than 12 hours ago
        createdAt: {
          $lt: new Date(),
          $gt: new Date(new Date() - 12 * 60 * 60 * 1000)
        },
        // this route is only used by the lobby chat room. If this changes, can do some logic here
        chatRoom: "lobby"
      }, // don't get more than 15 chats at a time
      limit: 15,
      order: 'createdAt DESC'
    }).then(function(data){
      data = JSON.parse(JSON.stringify(data)); //cleans up the data for easy reading
      res.json(data);
    }).catch(function (err) {
       console.error("** error occured on route /recentchats", err);
       res.json(err);
    });
  });

  //Uploading a picture to cloudinary and recieving a JSON object in return
   app.post("/profile/upload", upload.single('avatar'), function(req, res, next){
     var profPicSrc = req.file.path;

     //Call to Cloudinary
     cloudinary.uploader.upload(profPicSrc,
         function(result) {
           console.log(result);

           //Update the user's account in the DB to now have the URL source of the profile picture image
           db.User.update({
             profilePicture: result.secure_url
           }, {
             where: {
               id: req.user.id
             }
           }).then(function(response){
             console.log("Updated user profile pic!");
             res.redirect("/profile");
           }).catch(function(err){
             console.log("Error occurred. Sent to client as JSON.")
             res.json(err);
           });

         });
   });
}
