$(document).ready(function() {
    var matchId = $(".dataHolder").data().matchid;
    var partnerName = $(".dataHolder").data().partnername;
    var iPassedTest = false;
    var partnerPassedTest = false;
    var myCodeSoFar = "";

    // create a CodeMirror editor window:
    var cmcontainer = document.getElementById("code-mirror-container");
    var myCodeMirror = CodeMirror(cmcontainer, {
        value: $(".dataHolder").data().startcode,
        mode:  "javascript",
        lineSeparator: "\n",
        tabSize: 2,
        lineNumbers: true,
        autofocus: true
    });

    // start up chat
    createChatRoom(matchId, 2, user.displayName);

    var socket = io();

    // *** EVENT LISTENERS ***

    // send my code to the back end as I type it
    myCodeMirror.on("change", function(){
        myCodeSoFar = myCodeMirror.getValue();
        // emit socket event
        socket.emit("codeTyping", {sessionId: matchId, userName: user.displayName, code: myCodeSoFar});
    });

    // notify if your teammate disconnects
    socket.on("leftChallenge", function(leaverName){
        if (leaverName === partnerName){
            //partner was here, but they disconnected
            openModal(leaverName + " Disconnected", "Oops, it looks like your partner was disconnected. Get matched up with someone else to try another challenge.", "Go Back to Lobby", function(){window.location = "/lobby"});
        }
    });

    // listen for my partner's typing
    socket.on("codeSharing", function(someonesCode){
        if (someonesCode.sessionId == matchId && someonesCode.userName == partnerName){
            $("#partner-code .code-input").text(someonesCode.code);
        }
    });

    socket.on("challengeHalfDone", function(halfDone){
        if (halfDone.session == matchId){
            // this event is for our current session
            if (halfDone.userName == partnerName){
                // your partner is done!
                //console.log("your partner passed their test");
                partnerPassedTest = true;
                if (iPassedTest){
                    challengeSuccess();
                }
            }
        }
    });

    // perform code test
    $("button.testMyCode").on("click", function(){
        testMyCode(myCodeMirror.getValue());
    });

    function testMyCode(userCode){
        // Get this user's test, as passed down from the db
        var challengeTest = $("input#myTest").val();
        var passedTest = false;

        try { 
            var returnValue = eval("(" + userCode + ")()");
            if (returnValue == challengeTest){
                passedTest = true;
            }
        }
        catch (err) {
           openModal("Your code threw an error", err, "OK", closeModal);
        }
        finally {
            if (passedTest) {
                // update session
                socket.emit("oneChallengePassed", {session: matchId, userName: user.displayName});
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
        }
    }

    function challengeSuccess(){
        //console.log("calling challenge success");
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
                    //console.log("session updated! ", response);
                    openModal("Success!", "You both passed your challenge, nice team work, you guys! Head back to the lobby for more challenge fun!", "Lobby", function(){window.location = "/lobby"});
                } else {
                    console.error("not able to update session", sessionData.sessionId);
                }
            }
        });
    }

});
