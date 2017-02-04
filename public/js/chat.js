function createChatRoom(chatRoomName, maxUsers, myUserName, database){
    var chatRoom = chatRoomName;
    var sendChat = function (msg, screenname){
        // default values
        var chatter = "anon";
        var chatOwner = false;
        if (screenname){
            chatter = screenname;
            chatOwner = "user-" + screenname;
        }
        var timeStamp = new Date();
        database.ref("chatLog/" + chatRoom).push({
            screenname:chatter, 
            message:msg, 
            owner:chatOwner,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    };
    var displayChats = function (snapshot){
        $("#chat-history").empty();
        for (var key in snapshot) {
            var chat = snapshot[key];
            var div = $("<div>").addClass("chat-message");
            if (chat.owner){
                div.addClass("chat-message-" + chat.owner)
            }
            var txt = '<span class="chatter">' + chat.screenname + ": </span>";
            txt += chat.message;
            var chatTime = "<span class='chatTime'>" + convertTime(chat.timestamp) + "</span>";
            div.html(txt + chatTime);
            $("#chat-history").prepend(div);	
        }
    };
    var clearChat = function (){
        database.ref("chatLog/"+chatRoom).remove();
    };

    // watch for new chats
    database.ref("chatLog/" + chatRoom).orderByChild("timestamp").on("value", function(snapshot){
        displayChats(snapshot.val());
    }, function(error){
        console.error("Can't get chatLog data: " + error);
    });

    // send new chats to db
    $("button#submit-chat").click(function(){
        var chatText = $(this).prev("input").val().trim();
        sendChat(chatText, myUserName);
        $(this).prev("input").val("");
    });

    // make chat send on enter keypress
    $("input#chatbox").on("focus", function(){
        $("body").on("keypress", function(event){
            // firefox doesn't recognize event.keyCode
            var keyPressed = event.which || event.keyCode;
            if (keyPressed === 13) {
                // if enter key is pressed
                $("button#submit-chat").trigger("click");
            }
        });
    }).on("focusout", function(){
        $("body").off("keypress");
    });
}

function convertTime(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}