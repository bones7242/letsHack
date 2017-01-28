$(document).ready(function() {
    console.log("ready");
    firebase.initializeApp(config);
	var database = firebase.database();
    // get this from the back end
    var thisChallenge = 4000;
    // get name from user input, assign id based on whether 
    // or not there's already a user in this challenge
    var myPlayer = {
        name:"Harry", 
        playerNum:0, 
        inChallenge: thisChallenge, 
        codeSoFar: ""
    };
    var myPartner = {
        name:"Gerry", 
        playerNum:1, 
        inChallenge: thisChallenge, 
        codeSoFar: ""
    };
    database.ref("users/").push(myPlayer);
    database.ref("users/").push(myPartner);
    // watch for partner's typing
    database.ref("users/" + myPartner.id + "/codeSoFar").on("value", function(snapshot){
        $("#partner-code .code-input").text(snapshot.val());
    }, function(error){
        console.error("Can't get partner's typing")
    });
    // send code typing to db
    $("#your-code .code-input").on("focus", function(){
        $("body").on("keypress", function(event){
            var code = $("#partner-code .code-input").val().trim();
            database.ref("users/" + myPlayer.id + "/codeSoFar").set(code);
		});
    }).on("focusout", function(){
		$("body").off("keypress");
	});
    // watch for new chats
	database.ref("chatLog").orderByChild("timestamp").on("value", function(snapshot){
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
	$("input#chat-box").on("focus", function(){
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
        if (myPlayer && myPlayer.name){
            chatter = myPlayer.name;
            chatOwner = "user-" + myPlayer.playerNum;
        }
        var timeStamp = new Date();
        database.ref("chatLog").push({name:chatter, message:msg, owner:chatOwner, timestamp:timeStamp});
    }
    function displayChats(snapshot){
        $("#chat-history").empty();
        for (var key in snapshot) {
            var chat = snapshot[key];
            var div = $("<div>").addClass("chat-message");
            if (chat.owner){
                div.addClass("chat-message-" + chat.owner)
            }
            var txt = '<span class="chatter">' + chat.name + ": </span>";
            txt += chat.message;
            div.html(txt);
            $("#chat-history").prepend(div);	
        }
    }
    function clearChat(){
        database.ref("chatLog").remove();
    }


});