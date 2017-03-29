var db = require("../models");

// routes to export
module.exports = function(app) {
    var http = require("http").Server(app);
    var io = require("socket.io")(http);
    io.on("connection", function(socket){
        console.log("a user connected");
        socket.on("disconnect", function(){
            console.log("user disconnected");
        });
        socket.on("chatmessage", function(msg){
            io.emit("chatmessage", msg);
        });
    });
    return http;
}
