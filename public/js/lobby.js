// js for submitting a chat, getting screenname from hbrs
// js for creating a pair of users, and sending them to createsession
   $(document).ready(function(){
        firebase.initializeApp(config);
        var database = firebase.database();
        createChatRoom("lobby", 1000, user.displayName, database);
        $("#joinQueue").click(function(){
            $(this).hide().next("p").text("Please wait...pairing you with someone...");

            // add user.displayName to queue
            var queueRef = database.ref("queue");
            var meInQueueRef = queueRef.push(user.displayName);   
            meInQueueRef.onDisconnect().remove();

            //check to see if you can pair the user with someone else in the queue
            queueRef.on("value", function(snapshot){
                length = snapshot.numChildren();
                console.log(length + "users in the queue");
                if (length > 1){
                    
                }
            });
        });

   });