$(document).ready(function(){
    firebase.initializeApp(config);
    var database = firebase.database();

    //get logged in user data from server
    var user = {
        displayName: $(".dataHolder").data().displayname, 
        id: $(".dataHolder").data().userid
    };
    //console.log(user);
    // keeping this value in the larger scope, so it doesn't get rewritten
    // every time the que change listener fires
    var foundMatch = false;
    var sessionCreated = false;

    createChatRoom("lobby", 1000, user.displayName, database);
    showChallengeHistory();
    
    $("#joinQueue").click(function(){
        $(this).hide().next("p").text("Please wait...pairing you with someone...");

        openModal("Please wait...", "Pairing you with another hacker...");

        // add user.displayName to queue
        var queueRef = database.ref("queue");
        var meInQueueRef = queueRef.push({name: user.displayName, joinedTime: firebase.database.ServerValue.TIMESTAMP});   
        meInQueueRef.onDisconnect().remove();

        //check to see if you can pair the user with someone else in the queue
        queueRef.on("value", function(snapshot){
            console.log(snapshot.numChildren() + " users in the queue");
            if (!sessionCreated){
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
                    sessionCreated = true;
                    // the above makes sure this matching process doesn't run again
                    // for this user until they load this page again
                }
            } else {
                console.log("waiting for a match to join...");
            }
        });
    });

    function createSession(partnerName, sharedKey){
        //console.log("create a session with user ", partnerName)
        console.log("sending create session request with userId: " + user.displayName + " teammateId: " + partnerName + " matchId: " + sharedKey);
        $.ajax("/session/create", {
            method: "POST",
            userId: user.id,
            teammateId: partnerName,
            matchId: sharedKey
        }).done(function(response){
            console.log("response from create session route: ", response);
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