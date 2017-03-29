function createChatRoom(chatRoomName, maxUsers, myUserName){
    var socket = io();
    var chatRoom = chatRoomName;

    socket.on("chatmessage", function(message){
        displayChat(message, myUserName);
    });

    var sendChat = function (msg, screenname){
        // default values
        var chatter = "anon";
        if (screenname){
            chatter = screenname;
        }
        var timeStamp = new Date();
        var thisChat = {
            text: msg,
            chatter: chatter,
            time: timeStamp,
            chatRoom: chatRoomName
        };
        socket.emit("chatmessage", thisChat);
    };

    var displayChat = function (chat, myUserName){
        var div = $("<div>").addClass("chat-message");
        if (chat.chatter === myUserName){
            div.addClass("chat-message-mine");
        }
        var txt = '<span class="chatter">' + chat.chatter + ": </span>";
        txt += chat.text;
        var chatTime = "<span class='chatTime'>(" + convertTime(chat.time) + ")</span>";
        div.html(chatTime + txt);
        $("#chat-history").prepend(div);	
    };

    var clearChat = function (){
        $("#chat-history").empty();
    };

    // send new chats to db
    $("button#submit-chat").click(function(){
        var chatText = $(this).prev("input").val().trim();
        sendChat(chatText, myUserName);
        $(this).prev("input").val("");
    });

    // make chat send on enter keypress
    $("input#chatbox").on("focus", function(){
        $("body").on("keyup", function(event){
            // firefox doesn't recognize event.keyCode
            var keyPressed = event.which || event.keyCode;
            if (keyPressed === 13) {
                // if enter key is pressed
                $("button#submit-chat").trigger("click");
            }
        });
    }).on("focusout", function(){
        $("body").off("keyup");
    });
}

function convertTime(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp);
    var ampm = "pm";
    if (hours < 12 || hours === 0){
        ampm = "am";
    }
    // Hours part from the timestamp
    var hours = (date.getHours() % 12);
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

    // Will display time in 10:30:23 pm format
    var formattedTime = hours + ':' + minutes.substr(-2) + ":" + date.getSeconds() + " " + ampm;
    return formattedTime;
}