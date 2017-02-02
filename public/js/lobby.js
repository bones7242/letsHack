$(document).ready(function(){
    firebase.initializeApp(config);
    var database = firebase.database();
    createChatRoom("lobby", 1000, user.displayName, database);
    showChallengeHistory();
    
    $("#joinQueue").click(function(){
        $(this).hide().next("p").text("Please wait...pairing you with someone...");

        // add user.displayName to queue
        var queueRef = database.ref("queue");
        var meInQueueRef = queueRef.push(user.displayName);   
        meInQueueRef.onDisconnect().remove();

        //check to see if you can pair the user with someone else in the queue
        queueRef.on("value", function(snapshot){
            console.log(snapshot.numChildren() + " users in the queue");
            var foundMatch = false;
            snapshot.forEach(function(userInQueue){
                var waitingUser = userInQueue.val();
                if (!foundMatch && waitingUser != user.displayName){
                    foundMatch = true;
                    createSession(waitingUser);
                }
            });
        });
    });

    function createSession(partnerName){
        //console.log("create a session with user ", partnerName)
        $.ajax("/session/create", {
            data:{
                method: "POST",
                userId: user.displayName,
                teammateId: partnerName
            }
        }).done(function(sessionData){
            //prompt user to confirm they want to enter this session
            openModal("You've been matched", "You and " + partnerName + " have been given the challenge called <em>" +
            sessionData.challengeName + ".</em> Ready? Set?", "Let's Hack!", function(){
                //go to the challenge page
                $.ajax("/challenge/"sessionData.challengeId, {
                    data:{
                        method: "POST",
                        userId: user.displayName,
                        teammateId: partnerName,
                        sessionId: sessionData.Id
                    }
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
            if (!history){
                listItem = "<li>You have not completed any challenges yet.</li>";
            } else {
                for (session in history){
                    var listItem = "<li>";
                    listItem += session.ChallengeId + ": " + session.ChallengeId.name;
                    if (session.success){
                        listItem += ", completed on "
                    } else {
                        listItem += ", last attempted on "
                    }
                    listItem += session.lastModified;
                    listItem += "</li>";
                }
            }
            list.append(listItem);
        });
    }
});