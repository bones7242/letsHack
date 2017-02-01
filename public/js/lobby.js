// js for submitting a chat, getting screenname from hbrs
// js for creating a pair of users, and sending them to createsession
   $(document).ready(function(){
    firebase.initializeApp(config);
	var database = firebase.database();
    createChatRoom("lobby", 1000, user.displayName, database);
   });