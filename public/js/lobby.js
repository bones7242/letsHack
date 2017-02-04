$(document).ready(function(){
    firebase.initializeApp(config);
    var database = firebase.database();

    //get logged in user data from server
    var user = {
        displayName: $(".dataHolder").data().displayname, 
        id: $(".dataHolder").data().userid
    };
    //console.log(user);

    createChatRoom("lobby", 1000, user.displayName, database);
    showChallengeHistory();
    
    $("#joinQueue").click(function(){
        $(this).hide().next("p").text("Please wait...pairing you with someone...");

        // add user.displayName to queue
        var queueRef = database.ref("queue");
        var meInQueueRef = queueRef.push({name: user.displayName, joinedTime: firebase.database.ServerValue.TIMESTAMP});   
        meInQueueRef.onDisconnect().remove();

        //check to see if you can pair the user with someone else in the queue
        queueRef.on("value", function(snapshot){
            console.log(snapshot.numChildren() + " users in the queue");
            var foundMatch = false;
            var matchName;
            var earlierTime;
            var timeStamp1;
            var timeStamp2;
            if (snapshot.numChildren() > 1){
                snapshot.forEach(function(userInQueue){
                    var waitingUser = userInQueue.val();
                    if (!foundMatch && waitingUser.name != user.displayName){
                        // this is your match!
                        foundMatch = true;
                        timeStamp1 = waitingUser.joinedTime;
                        matchName = waitingUser.name
                    } else if (waitingUser.name == user.displayName){
                        // this is you!
                        timeStamp2 = waitingUser.joinedTime;
                    }
                });    
                // after looping through the queue,
                // figure out who has the first timestamp in the queue
                earlierTime = timeStamp1 < timeStamp2 ? timeStamp1 : timeStamp2;
                console.log("earlier Time: ", earlierTime);
                // send that number to createsession as shared "random" number
                createSession(matchName, earlierTime);
            } else {
                console.log("waiting for a match to join...");
            }
        });
    });

    function createSession(partnerName, sharedKey){
        //console.log("create a session with user ", partnerName)
        console.log("sending create session request with userId: " + user.displayname + " teammateId: " + partnerName + " matchId: " + sharedKey);
        $.ajax("/session/create", {
            method: "POST",
            userId: user.displayName,
            teammateId: partnerName,
            matchId: sharedKey
        }).done(function(sessionData){
            //prompt user to confirm they want to enter this session
            openModal("You've been matched", "You and " + partnerName + " have been given the challenge called <em>" +
            sessionData.challengeName + ".</em> Ready? Set?", "Let's Hack!", function(){
                //go to the challenge page
                $.ajax("/challenge/" + sessionData.challengeId, {
                    method: "POST",
                    userId: user.displayName,
                    teammateId: partnerName,
                    sessionId: sessionData.Id
                });
            });
        });
    }
    
    function showChallengeHistory(){
        $.ajax("/user/" + user.id + "/challengeHistory", {
            data:{
                method: "GET"
            }
        }).done(function(history){
            console.log("showing challenge history for user ", user.id);
            console.log(history);
            var list = $("ul.challenge-history");
            var listItem;
            for (var i = 0; i < history.length; i++){
                var listItem = "<li>";
                listItem += session.ChallengeId + ": " + session.ChallengeName;
                if (session.success){
                    listItem += ", completed on "
                } else {
                    listItem += ", last attempted on "
                }
                listItem += session.updatedAt;
                listItem += " with " + session.TeammateDisplayName;
                listItem += "</li>";
            }
            list.append(listItem);
        });
    }
});