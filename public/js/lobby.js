$(document).ready(function(){
    //get logged in user data from server
    var user = {
        displayName: $(".dataHolder").data().displayname, 
        id: $(".dataHolder").data().userid
    };

    // keeping this value in the larger scope, so it doesn't get rewritten
    // every time the que change listener fires
    var foundMatch = false;
    var sessionCreated = false;

    createChatRoom("lobby", 1000, user.displayName);
    showChallengeHistory();
    
    $("#joinQueue").click(function(){
        $(this).hide().next("p").text("Please wait...pairing you with someone...");

        openModal("Please wait...", "Pairing you with another hacker...");

        // add player id to queue, return either a match, or wait a few seconds and check again. 
        // on server, when a second player joins the queue, send a match response to both players. 
        // first player to join queue becomes player A  
    });

    function createSession(partnerName, partnerId, sharedKey, iAmPlayerA){
        //console.log("Who am I? Am I player A?", iAmPlayerA);
        $.ajax({
            type: "GET",
            url:"/session/create",
            data: {
                userId: user.id,
                teammateId: partnerId,
                matchId: sharedKey,
                isPlayerA: iAmPlayerA
            },
            success: function(response){
                //console.log("session created! ", response);
                if (response){
                    //get challenge page
                    window.location = 
                    "/challenge/?sessionId=" + response.id 
                    + "&challengeId=" + response.ChallengeId  
                    + "&userId=" + user.id;
                }
            }
        });
    }
});