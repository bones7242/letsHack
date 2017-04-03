function createChatRoom(chatRoomName, maxUsers, myUserName){
    var socket = io();
    socket.emit('userconnected', myUserName);
    
    // display old chats for this chatroom that happened in the last 12 hours
    // limit 15 chats pulled from db
    // this fires immediately on doc ready
    $.get("/recentchats/", function(recentChats){
        if(chatRoomName === "lobby"){
            for (var i = 0; i < recentChats.length; i++){
                var thisChat = {
                    chatter: recentChats[i].userName,
                    text: recentChats[i].text,
                    time: recentChats[i].createdAt,
                };
                displayChat(thisChat, myUserName);
            }
        }
    });

    // get number and list of present users
    socket.on("allpresent", function(presentUsers){
        $(".chatStats span.number").text(presentUsers.length);
        var userList = "";
        for (var i = 0; i < presentUsers.length; i++){
            userList += "<a class='online-user' href='/user/" + presentUsers[i].displayName + "'>";
            userList += presentUsers[i].displayName;
            userList += "</a>";
        }
        $(".chatStats .user-list").html(userList);
        console.log(presentUsers);
    });

    socket.on("chatmessage", function(message){
        displayChat(message, myUserName);
    });

    var sendChat = function (msg, screenname){
        // default values
        var chatter = "anon";
        if (screenname){
            chatter = screenname;
        }
        var thisChat = {
            text: msg,
            chatter: chatter,
            chatRoom: chatRoomName,
            time: new Date()
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

    $(".chatStats .trigger-user-list").on("mouseenter", function(){
        $(".chatStats .user-list").show();
    });
    
    $(".chatStats .user-list").on("mouseleave", function(){
        $(".chatStats .user-list").hide();
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