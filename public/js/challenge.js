$(document).ready(function() {
    console.log("ready");
    firebase.initializeApp(config);
	var database = firebase.database();
    var myPointer;
    var myRef;
    var partnerPointer;
    var partnerRef;
    var sessionRef = database.ref("activeSessions/" + sessionData.sessionId);
    myRef = sessionRef.push(myPlayer, function(err){
        if (err) console.err(err);
        myPointer = myRef.getKey();
    });
    myRef.onDisconnect().remove();

    // when this session changes value
    sessionRef.on("value", function(snapshot){
        var usersConnected  = snapshot.numChildren();
        //console.log("users connected:", usersConnected);
        if (usersConnected === 2 && myPointer) {
            // game has started, loop through users on change
            for (user in snapshot.val()){
                if (user === myPointer){
                    //console.log("found myself");
                } else {
                    // watch for partner's typing
                    var partnersCode = snapshot.child(user).val().codeSoFar;
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

  /*
  // code to execute tests 
  on submit (
    if (
      var inputA = eval(codeA-input.val); 
      var inputB = eval(codeB-input.val);
 
 // OR

      {{inputA}}
            
      {{inputB}}

    var test = function(){
      {{test}}
    };
    
    if (test)
      {
        showTestSuccess();
      }
      else {
        showTestFail();
      }

    */
});