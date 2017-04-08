

$(document).ready(function(){

    // build an editable form for existing challenges 
    $(".challenge-link").on("click", function(){
        console.log("i found " + $(this).attr("id"));
        // select the challenge edit field 
        var challengeEditArea = $("#challenge-edit-area");
        // clear in inner html
        challengeEditArea.empty();

        // add challengeEditForm
        var challengeEditForm = $("<form method='POST' action='/challenge/update?_method=PUT'></form>")
        // hidden store of id
        challengeEditForm.append("<div><input type='hidden' name='id' value='" + $(this).attr("data-id") + "' />");
        // name 
        challengeEditForm.append("<div><label for='name'>Name:</label></div>");
        challengeEditForm.append("<div><input name='name' value='" + $(this).attr("data-name") + "' /></div>");
        // difficulty 
        challengeEditForm.append("<div><label for='difficulty'>Difficulty:</label></div>");
        challengeEditForm.append("<div><input name='difficulty' type='number' value='" + $(this).attr("data-difficulty") + "' /></div>");
        // instructions to all 
        challengeEditForm.append("<div><label for='instructionsAll'>Instructions for All Participants</label></div>");
        challengeEditForm.append("<div><textarea name='instructionsAll' rows='4' cols='50'>" + $(this).attr("data-instructionsAll") + "</textarea></div>");
        // instructions to A
        challengeEditForm.append("<div><label for='instructionsA'>Instructions for User A</label></div>");
        challengeEditForm.append("<div><textarea name='instructionsA' rows='4' cols='50'>" + $(this).attr("data-instructionsA") + "</textarea></div>");
        // instructions to B
        challengeEditForm.append("<div><label for='instructionsB'>Instructions for User B</label></div>");
        challengeEditForm.append("<div><textarea name='instructionsB' rows='4' cols='50'>" + $(this).attr("data-instructionsB") + "</textarea></div>");
        // start code A
        challengeEditForm.append("<div><label for='startCodeA'>Start Code for User A</label></div>");
        challengeEditForm.append("<div><textarea name='startCodeA' rows='4' cols='50'>" + $(this).attr("data-startCodeA") + "</textarea></div>");
        // start code B
        challengeEditForm.append("<div><label for='startCodeB'>Start Code for User B</label></div>");
        challengeEditForm.append("<div><textarea name='startCodeB' rows='4' cols='50'>" + $(this).attr("data-startCodeB") + "</textarea></div>");
        // test A 
        challengeEditForm.append("<div><label for='testA'>Test for user A</label></div>");
        challengeEditForm.append("<div><textarea name='testA' rows='4' cols='50'>" + $(this).attr("data-testA") + "</textarea></div>");
        // test B 
        challengeEditForm.append("<div><label for='testB'>Test for user B</label></div>");
        challengeEditForm.append("<div><textarea name='testB' rows='4' cols='50'>" + $(this).attr("data-testB") + "</textarea></div>");
        // submit button
        challengeEditForm.append("<div><button type='submit'>Submit Challenge Updates</button></div>");

        // add form to challenge-edit-area
        challengeEditArea.append(challengeEditForm);
    })

    // build a new blank form for a new challenge 
    $("#new-challenge-btn").on("click", function(){
        console.log("i found " + $(this).attr("id"));
        // select the challenge edit field 
        var challengeEditArea = $("#challenge-edit-area");
        // clear in inner html
        challengeEditArea.empty();

        // add challengeEditForm
        var challengeEditForm = $("<form method='POST' action='/challenge/create'></form>")
        // name 
        challengeEditForm.append("<div><label for='name'>Name:</label></div>");
        challengeEditForm.append("<div><input name='name' value='" + $(this).attr("data-name") + "' /></div>");
        // difficulty 
        challengeEditForm.append("<div><label for='difficulty'>Difficulty:</label></div>");
        challengeEditForm.append("<div><input name='difficulty' type='number' value='" + $(this).attr("data-difficulty") + "' /></div>");
        // instructions to all 
        challengeEditForm.append("<div><label for='instructionsAll'>Instructions for All Participants</label></div>");
        challengeEditForm.append("<div><textarea name='instructionsAll' rows='4' cols='50'>" + $(this).attr("data-instructionsAll") + "</textarea></div>");
        // instructions to A
        challengeEditForm.append("<div><label for='instructionsA'>Instructions for User A</label></div>");
        challengeEditForm.append("<div><textarea name='instructionsA' rows='4' cols='50'>" + $(this).attr("data-instructionsA") + "</textarea></div>");
        // instructions to B
        challengeEditForm.append("<div><label for='instructionsB'>Instructions for User B</label></div>");
        challengeEditForm.append("<div><textarea name='instructionsB' rows='4' cols='50'>" + $(this).attr("data-instructionsB") + "</textarea></div>");
        // start code A
        challengeEditForm.append("<div><label for='startCodeA'>Start Code for User A</label></div>");
        challengeEditForm.append("<div><textarea name='startCodeA' rows='4' cols='50'>" + $(this).attr("data-startCodeA") + "</textarea></div>");
        // start code B
        challengeEditForm.append("<div><label for='startCodeB'>Start Code for User B</label></div>");
        challengeEditForm.append("<div><textarea name='startCodeB' rows='4' cols='50'>" + $(this).attr("data-startCodeB") + "</textarea></div>");
        // test A 
        challengeEditForm.append("<div><label for='testA'>Test for user A</label></div>");
        challengeEditForm.append("<div><textarea name='testA' rows='4' cols='50'>" + $(this).attr("data-testA") + "</textarea></div>");
        // test B 
        challengeEditForm.append("<div><label for='testB'>Test for user B</label></div>");
        challengeEditForm.append("<div><textarea name='testB' rows='4' cols='50'>" + $(this).attr("data-testB") + "</textarea></div>");
        // submit button
        challengeEditForm.append("<div><button type='submit'>Submit New Challenge</button></div>");

        // add form to challenge-edit-area
        challengeEditArea.append(challengeEditForm);
    })

});
