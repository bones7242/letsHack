var db = require("../models");
var chatFilters = require("./../config/chatfilters.json");

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
            io.emit("leftChallenge", connectedUsername);
        });

        socket.on("chatmessage", function(msg){
            //console.log("received a chat from ", msg);
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
            // add chat to the database for preserving chat history
            db.Chat.create({
                text: msg.text,
                userName: msg.chatter,
                chatRoom: msg.chatRoom
            }).catch(function(err){
                console.error("** there was an error adding a chat to the database: ", err);
            });
        });

        socket.on("joinqueue", function(userInfo){
            placeInQueue(userInfo.displayName, true, io);
        });

        socket.on("codeTyping", function(codeData){
            io.emit("codeSharing", codeData);
        });
    });


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
                    console.error("** error occured getting queued users: ", err);
                    return false;
                });
            } else {
                //console.log("user NOT updated: ", result);
                return false;
            };
        }).catch(function (err) {
        console.error("** error occured updating user: ", err);
        });
    }

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
                    console.error("** error occured getting all present users: ", err);
                    return false;
                });
            } else {
                //console.log("user NOT updated: ", result);
                return false;
            };
        }).catch(function (err) {
        console.error("** error occured updating user: ", err);
        });
    }

    function createSession(userA, userB){
        // remove these people from the queue
        placeInQueue(userA.displayName, false);
        placeInQueue(userB.displayName, false);
        
        chooseChallenge(userA.id, userB.id, function(challengeToUse){
            // 2. create the session and send the information back to front end
            db.Session.create({
                success: "false",  // will always be false when created
                playerAId: userA.id,
                playerBId: userB.id,
                ChallengeId: challengeToUse,  // note: must be an valid(existing) ChallengeId
            }).then(function(sessionData) {
                // 3. return the information
                JSON.parse(JSON.stringify(sessionData));
                io.emit("matchmade", sessionData);
            }).catch(function (err) {
                console.error("** error occured creating a session.  Sent to client as JSON");
                io.emit("matchmade", err);
            });
        });
    }

    function chooseChallenge(userAId, userBId, callback){
        // 1. select a challenge id that isn't in either user's challenge history.
        db.sequelize.Promise.all([
            db.Session.findAll({
                attributes: ["ChallengeId"],
                where: {
                    $or: [{UserId: userAId}, {UserId: userBId}],  // selects if id is user's or team mate's
                    success: true // only selects records that have not been solved
                }
            }),
            db.Challenge.findAll({
                attributes: ["id"],
            })
        ])
        .spread(function(sessions, challenges) {
            // parse the results to get an array of the challenge ids already completed by these users 
            var usedChallengeIds = [];
            for (var i = 0; i < sessions.length; i++){
                usedChallengeIds.push(sessions[i].ChallengeId);
            }
            usedChallengeIds = removeDuplicates(usedChallengeIds);
            // parse the array of all possible challenge id
            var allChallengeIds = [];
            for (var i = 0; i < challenges.length; i++){
                allChallengeIds.push(challenges[i].id);
            }
            // compare the arrays and remove the used challenges from AllChallengeIds
            var possibleChallengeIds = removeElements(allChallengeIds, usedChallengeIds);

            var challengeIndex = Math.floor(Math.random() * possibleChallengeIds.length);
            var challengeToUse = possibleChallengeIds[challengeIndex];
            callback(challengeToUse);
        });
    }

    return http;
}
