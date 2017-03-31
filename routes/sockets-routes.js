var db = require("../models");
var chatFilters = require("./../config/chatfilters.json");

function markAsPresent(user, isPresent, io){
    db.User.update({
      present: isPresent
    }, {
      where: {
        displayName: user
      }
    }).then(function(result){
        if (result[0] === 1){
            // user updated
            db.User.findAll({
                where: {
                    present: true
                }
            }).then(function(data){
                data = JSON.parse(JSON.stringify(data)); //cleans up the data for easy reading
                io.emit("allpresent", data);
            }).catch(function (err) {
                console.log("** error occured getting all present users: ", err);
                return false;
            });
        } else {
            console.log("user NOT updated: ", result);
            return false;
        };
    }).catch(function (err) {
      console.log("** error occured updating user: ", err);
    });
}

function placeInQueue(user, isInQueue){
    db.User.update({
      inqueue: isInQueue
    }, {
      where: {
        displayName: user
      }
    }).then(function(result){
        if (result[0] === 1){
            // user updated
            db.User.findAll({
                where: {
                    inqueue: true
                }
            }).then(function(data){
                if(isInQueue){
                    // if someone just joined the queue
                    data = JSON.parse(JSON.stringify(data)); //cleans up the data for easy reading
                    // find two users in queue, make a match
                    if (data.length > 1){
                        createSession(data[0], data[1]);
                    }
                }
            }).catch(function (err) {
                console.log("** error occured getting queued users: ", err);
                return false;
            });
        } else {
            //console.log("user NOT updated: ", result);
            return false;
        };
    }).catch(function (err) {
      console.log("** error occured updating user: ", err);
    });
}

function createSession(userA, userB){
    // remove these people from the queue
    placeInQueue(userA.displayName, false);
    placeInQueue(userB.displayName, false);
    // create a session 
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
      //console.log("used:", usedChallengeIds);
      // parse the array of all possible challenge id
      var allChallengeIds = [];
      for (var i = 0; i < challenges.length; i++){
        allChallengeIds.push(challenges[i].id);
      }
      //console.log("total:", allChallengeIds);
      // compare the arrays and remove the used challenges from AllChallengeIds
      var possibleChallengeIds = removeElements(allChallengeIds, usedChallengeIds)
      // select a challenge
      while (matchId < possibleChallengeIds.length){
        matchId * 2;
      };
      var challengeIndex = matchId % possibleChallengeIds.length;
      var challengeToUse = possibleChallengeIds[challengeIndex];
      // 2. create the session and get the information
      db.Session.create({
        success: "false",  // will always be false when created
        playerA: isPlayerA,
        playerB: isPlayerB,
        matchId: matchId,
        ChallengeId: challengeToUse,  // note: must be an valid(existing) ChallengeId
        UserId: userId,  // note: must be an valid(existing) UserId
        TeammateId: teammateId,  // note: must be an valid(existing) UserId
      }).then(function(sessionData) {
        // 3. return the information
        console.log("newSession:", JSON.parse(JSON.stringify(sessionData)));
        res.json(sessionData);
      }).catch(function (err) {
        console.log("** error occured.  Sent to client as JSON");
        res.json(err);
      });
    }).catch(function (err) {
      console.log("** error occured.  Sent to client as JSON");
      res.json(err);
    });
    // send session info to invited users
}

// routes to export
module.exports = function(app) {
    var http = require("http").Server(app);
    var io = require("socket.io")(http);
    io.on("connection", function(socket){
        var connectedUsername;
        
        socket.on("userconnected", function(username){
            connectedUsername = username;
            // mark logged in user as present, get list of all users present
            markAsPresent(connectedUsername, true, io);
        });

        socket.on("disconnect", function(){
            // mark logged in user as no longer present, and no longer in queue
            placeInQueue(connectedUsername, false, io);
            markAsPresent(connectedUsername, false, io);
        });

        socket.on("chatmessage", function(msg){
            // replace shrug with shrug emoji
            // cause why the hell not
            var filteredText = msg.text;
            for (trigger in chatFilters){
                // check each chat for the presence of a chat filter trigger
                // defined in a config file, along with its replacement
                if (filteredText.indexOf(trigger) > -1){
                    var array = filteredText.split(trigger);
                    var newText = array.join(chatFilters[trigger]);
                    filteredText = newText;
                }
            }
            msg.text = filteredText;
            // send user's chat out to all connected users
            io.emit("chatmessage", msg);
        });

        socket.on("joinqueue", function(userInfo){
            placeInQueue(userInfo.displayName, true, io);
        });
    });
    return http;
}
