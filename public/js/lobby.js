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
        $(this).next("p").text("Please wait...pairing you with someone...");
        openModal("Please wait...", "Pairing you with another hacker...", false, false, function(){
            // remove me from the queue if I click the close modal button
            socket.emit("leavequeue", user);
        });
        socket.emit("joinqueue", user);
    });
    
    socket.on("matchmade", function(sessionData){
        //get challenge page
        window.location = 
        "/challenge/?sessionId=" + sessionData.id 
        + "&challengeId=" + sessionData.ChallengeId  
        + "&userId=" + user.id;
    });
});