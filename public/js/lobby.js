$(document).ready(function(){
    var socket = io();
    //get logged in user data from server
    var user = {
        displayName: $(".dataHolder").data().displayname, 
        id: $(".dataHolder").data().userid
    };

    createChatRoom("lobby", 1000, user.displayName);
    showChallengeHistory();
    
    $("#joinQueue").click(function(){
        $(this).hide().next("p").text("Please wait...pairing you with someone...");
        openModal("Please wait...", "Pairing you with another hacker...");
        
        socket.emit("joinqueue", user);
    });
    
    socket.on("matchmade", function(sessionData){
        console.log("match made: ", sessionData);
        //get challenge page
        window.location = 
        "/challenge/?sessionId=" + sessionData.id 
        + "&challengeId=" + sessionData.ChallengeId  
        + "&userId=" + user.id;
    });

    // function createSession(partnerName, partnerId, sharedKey, iAmPlayerA){
    //     //console.log("Who am I? Am I player A?", iAmPlayerA);
    //     $.ajax({
    //         type: "GET",
    //         url:"/session/create",
    //         data: {
    //             userId: user.id,
    //             teammateId: partnerId,
    //             matchId: sharedKey,
    //             isPlayerA: iAmPlayerA
    //         },
    //         success: function(response){
    //             //console.log("session created! ", response);
    //             if (response){
    //             }
    //         }
    //     });
    // }
});