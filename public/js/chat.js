


function createChatRoom(chatRoomName, myUserName, maxUsers){
    if (!database){
        firebase.initializeApp(config);
        var database = firebase.database();
    }
    
    chatRoom = chatRoomName;

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
            if (event.charCode === 13) {
                // if enter key is pressed
                $("button#submit-chat").trigger("click");
            }
        });
    }).on("focusout", function(){
        $("body").off("keypress");
    });
}

function sendChat(msg, screenname){
    // default values
    var chatter = "anon";
    var chatOwner = false;
    if (screenname){
        chatter = screenname;
        chatOwner = "user-" + screenname;
    }
    var timeStamp = new Date();
    database.ref("chatLog/" + chatRoom).push({screenname:chatter, message:msg, owner:chatOwner, timestamp:timeStamp});
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
    database.ref("chatLog/"+chatRoom).remove();
}
