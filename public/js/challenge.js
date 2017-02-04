$(document).ready(function() {
    //console.log("ready");
    firebase.initializeApp(config);
	var database = firebase.database();

    //get logged in user data from server
    var user = {
        displayName: $(".dataHolder").data().displayname,
        id: $(".dataHolder").data().userid,
        finished: 0
    };
    //console.log(user);

    var myPointer;
    var myRef;
    var partnerPresent = false;

    var sessionRef = database.ref("activeSessions/" + sessionData.sessionId);
    myRef = sessionRef.push(user, function(err){
        if (err) console.err(err);
        myPointer = myRef.getKey();
    });
    myRef.onDisconnect().remove();

    function addBRTags(input){
        return input.split("\n").join("<br />");
    }

    // when this session changes value
    sessionRef.on("value", function(snapshot){
        var usersConnected  = snapshot.numChildren();
        //console.log("users connected:", usersConnected);
        if (usersConnected === 2 && myPointer) {
            // game has started, loop through users on change
            for (user in snapshot.val()){
                if (user === myPointer && snapshot.child("user/finished").val() === 1){
                    //console.log("found myself");
                    //Check the other user to see if they finished the challenge, move from there
                    for (user in snapshot.val()){
                      if (user === myPointer) {
                        //console.log("Same thing, its me")
                      }
                      else {
                        if (snapshot.child("user/finished").val() === 1) {
                          //Other player is done too. Woohoo!!
                        }
                      }
                    }
                } else {
                    // watch for partner's typing
                    partnerPresent = true;
                    var partnersCode = snapshot.child(user).val().codeSoFar;
                    $("#partner-code .code-input").html(addBRTags(partnersCode));
                }
            }
        } else if (usersConnected < 2 && partnerPresent === true){
            //partner was here, but they disconnected
            openModal(myPartner + " Disconnected", "Oops, it looks like your partner was disconnected. Get matched up with someone else to try another challenge.", "Go Back to Lobby", function(){window.location = "/lobby?userId=" + user.id;});
        } else if (usersConnected > 2){
            //there are more than 2 people in this challenge... awkward!
            openModal("Room is Full", "Hm, something went wrong, that challenge is already full. Get matched up with someone else to try another challenge.", "Go Back to Lobby", function(){window.location = "/lobby?userId=" + user.id;});
        }
    });

    // send my code typing to db
    $("#your-code .code-input").on("focus", function(){
        $("body").on("keyup", function(event){
            var code = $("#your-code .code-input").val().trim();
            myRef.child("/codeSoFar").set(code);
		});
    }).on("focusout", function(){
		$("body").off("keyup");
	});

    createChatRoom(sessionData.sessionId, 2, user.displayName, database);



    $(".submitBtn").on("click", function(){
      //Take the player's code
      var userCode = $("#userCode").val().trim();
      console.log("userCode before: " + userCode);

      //Test for user, should not matter as each user is loaded a different test
      var test = req.body.test;

      //Figure out which user is which to choose which test to run with


      // console.log("user code eval: " + eval(userACode);
      //Store and evaluate the code
      var checkAnswer = eval(userCode + test);
      //Compare checkAnswer to the db answer
      if (checkAnswer) {
        sessionRef.child("user").update({
          finished: 1
        })


        //Alert the user to please wait for the other player to finish BUT still keep the chat functioning to help other player


      } else {
        alert("keep trying!");
        //openModal("Room is Full", "Hm, something went wrong, that challenge is already full. Get matched up with someone else to try another challenge.", "Go Back to Lobby", function(){window.location = "/lobby?userId=" + user.id;});
      }

    });



// Onclick of test button take the code inside of the textarea, code.eval, check in firebase to see if other person has finished. If the test passes, then push to firebase to say finished (switch)
// On sessionRef create lofic to check for finished user first

//   // code to execute tests
//   on submit (
//     if (
//       var inputA = eval(codeA-input.val);
//       var inputB = eval(codeB-input.val);
//
//  // OR
//
//       {{inputA}}
//
//       {{inputB}}
//
//     var test = function(){
//       {{test}}
//     };
//
//     if (test)
//       {
//         showTestSuccess();
//       }
//       else {
//         showTestFail();
//       }
//
//     */
});
