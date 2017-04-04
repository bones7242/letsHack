$(document).ready(function() {
    var matchId = $(".dataHolder").data().matchid;
    var partnerName = $(".dataHolder").data().partnername;
    var iPassedTest = false;
    var partnerPassedTest = false;
    var myCodeSoFar = "";
    // start up chat
    createChatRoom(matchId, 2, user.displayName);
    //put my starter code into the textarea
    $("#userCode").val(addBRTags($(".dataHolder").data().startcode));

    var socket = io();

    // *** EVENT LISTENERS ***

    // notify if your teammate disconnects
    socket.on("leftChallenge", function(leaverName){
        if (leaverName === partnerName){
            //partner was here, but they disconnected
            openModal(leaverName + " Disconnected", "Oops, it looks like your partner was disconnected. Get matched up with someone else to try another challenge.", "Go Back to Lobby", function(){window.location = "/lobby"});
        }
    });

    // send my code typing to back end
    $("#your-code .code-input").on("focus", function(){
        $("body").on("keyup", function(event){
            myCodeSoFar = $("#your-code .code-input").val().trim();
            // emit socket event
            socket.emit("codeTyping", {sessionId: matchId, userName: user.displayName, code: myCodeSoFar});
		});
    }).on("focusout", function(){
		$("body").off("keyup");
	});

    // listen for my partner's typing
    socket.on("codeSharing", function(someonesCode){
        if (someonesCode.sessionId == matchId && someonesCode.userName == partnerName){
            $("#partner-code .code-input").text(someonesCode.code);
        }
    });

    // perform code test
    $("button.testMyCode").on("click", testMyCode);

    function addBRTags(input){
        if (input && typeof input === "string" && input.length > 1){
            return input.split("\n").join("<br />");
        }
    }

    function challengeSuccess(){
        console.log("calling challenge success");
        // update the session record to show success
        $.ajax({
            type: "PUT",
            url:"/session/update",
            data: {
                success: true,
                id: sessionData.sessionId
            },
            success: function(response){
                if (response){
                    console.log("session updated! ", response);
                    openModal("Success!", "You both passed your challenge, nice team work, you guys! Head back to the lobby for more challenge fun!", "Lobby", function(){window.location = "/lobby"});
                } else {
                    console.error("not able to update session", sessionData.sessionId);
                }
            }
        });
    }

    function testMyCode(){
        // Take the player's code
        var userCode = $("#userCode").val();
        // Get this user's test, as passed down from the db
        var challengeTest = $("input#myTest").val();
        var passedTest = false;

    //    try { 
        var returnValue = eval("(" + userCode + ")()");
        if (returnValue == challengeTest){
            passedTest = true;
        }
  //      }
  //      catch (err) {
  //          openModal("Your code threw an error", err, "OK", closeModal);
  //      }
  //      finally {
        if (passedTest) {
            myRef.update({
                finished: 1
            });
            iPassedTest = true;
            if (partnerPassedTest){
                //we both passed yay!
                challengeSuccess();
            } else {
                // I passed, my parnter hasn't yet
                openModal("Nice work!", "Your partner is still working, see if you can help them out using the chat.", "OK", closeModal);
            }
        } else {
            //i didn't pass
            openModal("Your code didn't return the expected result.", "Keep trying!", "OK", closeModal);
        }
        //}
    }

});
