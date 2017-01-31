$(document).ready(function() {
    console.log("ready");
    firebase.initializeApp(config);
	var database = firebase.database();

// get this data from the back end
    var sessionData = {
        sessionId : 34567,
        challenge : {
            challengeId : 4567,
            instructionsAll : "In this challenge, you will be reversing and setting a string to all caps",
            instructionsA : "Write a function that reverses a string and returns that value",
            instructions : "Write a function that makes a string into all caps and returns that value"
        }
    };
    var myPlayer = {
        screenname: "Harry", 
        id: 12345,
        playerRole: "a", 
        inChallenge: sessionData.challenge.challengeId, 
        codeSoFar: "// start coding here"
    };
    var myPartner = {
        screenname:"Gerry", 
        id: 45678,
        playerRole: "b", 
        inChallenge: sessionData.challenge.challengeId, 
        codeSoFar: "// start coding here"
    };
// end of data from back end 

    var myPointer;
    var myRef;
    var partnerPointer;
    var sessionRef = database.ref("activeSessions/" + sessionData.sessionId);
    myRef = sessionRef.push(myPlayer, function(err){
        if (err) console.err(err);
        myPointer = myRef.getKey();
    });
    myRef.onDisconnect().remove();

    sessionRef.on("value", function(snapshot){
        var usersConnected  = snapshot.numChildren();
        console.log("users connected:", usersConnected);
        if (usersConnected === 2 && myPointer) {
            // game has started, loop through users on change
            for (user in snapshot.val()){
                if (user === myPointer){
                    console.log("found myself");
                } else {
                    console.log("this is someone else: " + user);
                    // watch for partner's typing
                    partnerPointer = snapshot.getKey();
                    console.log(partnerPointer);
                    var partnersCode = user.codeSoFar;
                    $("#partner-code .code-input").text(partnersCode);
                }
            }
        }
    });

    // send my code typing to db
    $("#your-code .code-input").on("focus", function(){
        $("body").on("keypress", function(event){
            var code = $("#your-code .code-input").val().trim();
            myRef.child("/codeSoFar").set(code);
		});
    }).on("focusout", function(){
		$("body").off("keypress");
	});

    // watch for new chats
	database.ref("chatLog/" + sessionData.thisSessionId).orderByChild("timestamp").on("value", function(snapshot){
		displayChats(snapshot.val());
	}, function(error){
		console.error("Can't get chatLog data: " + error);
	});
    // send new chats to db
    $("button#submit-chat").click(function(){
		sendChat($(this).prev("input").val().trim());
		$(this).prev("input").val("");
	});
    // make chat send on enter keypress
	$("input#chatbox").on("focus", function(){
		$("body").on("keypress", function(event){
			if (event.charCode === 13) {
				// if enter key is pressed
				$("button#submit-chat").trigger("click");
			}
		});
	}).on("focusout", function(){
		$("body").off("keypress");
	});
    function sendChat(msg){
        // default values
        var chatter = "anon";
        var chatOwner = false;
        if (myPlayer && myPlayer.screenname){
            chatter = myPlayer.screenname;
            chatOwner = "user-" + myPlayer.playerRole;
        }
        var timeStamp = new Date();
        database.ref("chatLog/" + sessionData.thisSessionId).push({screenname:chatter, message:msg, owner:chatOwner, timestamp:timeStamp});
    }
    function displayChats(snapshot){
        $("#chat-history").empty();
        for (var key in snapshot) {
            var chat = snapshot[key];
            var div = $("<div>").addClass("chat-message");
            if (chat.owner){
                div.addClass("chat-message-" + chat.owner)
            }
            var txt = '<span class="chatter">' + chat.screenname + ": </span>";
            txt += chat.message;
            div.html(txt);
            $("#chat-history").prepend(div);	
        }
    }
    function clearChat(){
        database.ref("chatLog/"+thisSessionId).remove();
    }


});