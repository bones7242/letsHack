function createChatRoom(chatRoomName, maxUsers, myUserName){
    var socket = io();
    socket.emit('userconnected', myUserName);
    
    // display old chats for this chatroom that happened in the last 12 hours
    // limit 15 chats pulled from db
    // this fires immediately on doc ready
    $.get("/recentchats/", function(recentChats){
        if(chatRoomName === "lobby"){
            // go backwards through the results, since the newest ones are at the top
            for (var i = recentChats.length-1; i >= 0; i--){
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