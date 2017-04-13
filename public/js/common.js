var user;

function padDigits(num) { 
    return (num < 10) ? "0" + num : num; 
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
    var minutes = padDigits(date.getMinutes());

    // Will display time in 10:30:23 pm format
    var formattedTime = hours + ':' + minutes + ampm;
    return formattedTime;
}

function convertDay(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp);
    return [date.getMonth()+1, date.getDate(), date.getFullYear()].join('/');
}

function openModal(title, html, buttonText, buttonCallback, closeCallback){
    $("#modal")
    .show()
    .find(".title")
    .text(title)
    .next("p.modal-text")
    .html(html);
    if (buttonText && buttonCallback){
        $("#modal p.modal-text").append("<button class='largeButton'>" + buttonText + "</button>");
        $("#modal p").click("button", buttonCallback);
    }
    $("#modal .modal-close, #modal modal-background").click(function(){
        if (closeCallback){
            closeCallback();
        }
        closeModal();
    });
}

function closeModal(){
  $("#modal").hide().find(".title").text("").next("p").html("");
}

function showChallengeHistory(){
    $.ajax("/user/" + user.id + "/challengeHistory", {
        data:{
            method: "GET"
        }
    }).done(function(history){
        //console.log("showing challenge history for user ", user.id);
        var list = $("ul.challenge-history");
        var listItem = "";
        for (var i = 0; i < history.length; i++){
            var userAcode = "";
            if (history[i].playerA == user.displayName){
                userAcode = "you";
            } else {
                userAcode = `<a href="/user/${history[i].playerA}">${history[i].playerA}</a>`;
            }
            var userBcode = "";
            if (history[i].playerB == user.displayName){
                userBcode = "you";
            } else {
                userBcode = `<a href="/user/${history[i].playerB}">${history[i].playerB}</a>`;
            }
            var tidyDate = convertDay(history[i].updatedAt) + " at " + convertTime(history[i].updatedAt);
            listItem += "<li>";
            listItem += history[i].ChallengeName;
            if (history[i].success){
                listItem += ", completed on "
            } else {
                listItem += ", attempted on "
            }
            listItem += tidyDate;
            listItem += " with " + userAcode;
            listItem += " and " + userBcode;
            listItem += "</li>";
        }
        if (history.length === 0){
            listItem = "<li>No challenges completed yet.</li>"
        }
        list.append(listItem);
    });
}

function decipher(str){
    //simple cipher for obscuring code test
    var output = "";
    var originalAmount = -6;
    // to reverse, add 26 to this = 16
    var amount = 20;

	for (var i = 0; i < str.length; i ++) {
		var c = str[i];
		// if it's a letter
		if (c.match(/[a-z]/i)) {
			// Get its code
			var code = str.charCodeAt(i);
			// Uppercase letters
			if ((code >= 65) && (code <= 90))
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
			// Lowercase letters
			else if ((code >= 97) && (code <= 122))
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        // if it's a number
		} else if (c.match(/[0-9]/)){
            // if it's a digit, shift it by amount
            c = (parseInt(c) + originalAmount);
            // adding extra modulo to get correct value for negative numbers
            c = ((c % 10) + 10) % 10;
        }
		// append transformed character to output
		output += c;
	}
	return output;
}

$(document).ready(function() {
  //get logged in user data from server
  user = {
      displayName: $(".dataHolder").data().displayname,
      id: $(".dataHolder").data().userid
  };
  if (user.displayName){
      $("nav .nav-right")
        .show()
        .find(".nav-item.user-name")
        .text("Welcome, " + user.displayName + "!");
  } else {
      $("nav .nav-right")
        .hide()
        .find(".nav-item.user-name")
        .text("");
  }

  $("nav #icon, nav #logo").click(function(){
    window.location = "/";
  });

});
