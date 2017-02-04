var user;
function openModal(title, html, buttonText, buttonCallback){
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
        console.log("showing challenge history for user ", user.id);
        console.log(history);
        var list = $("ul.challenge-history");
        var listItem = "";
        for (var i = 0; i < history.length; i++){
            listItem += "<li>";
            listItem += history[i].ChallengeId + ": " + history[i].ChallengeName;
            if (history[i].success){
                listItem += ", completed on "
            } else {
                listItem += ", attempted on "
            }
            listItem += history[i].updatedAt;
            listItem += " with " + history[i].TeammateDisplayName;
            listItem += "</li>";
        }
        list.append(listItem);
    });
}

$(document).ready(function() {
  //get logged in user data from server
  user = {
      displayName: $(".dataHolder").data().displayname, 
      id: $(".dataHolder").data().userid
  };
  //console.log(user);
  if (user.displayName){
      $("nav .nav-right")
        .show()
        .find(".nav-item.user-name")
        .text(user.displayName);
  } else {
      $("nav .nav-right")
        .hide()
        .find(".nav-item.user-name")
        .text("");
  }

  $("#modal .modal-close, #modal modal-background").click(closeModal);

  $("nav #icon, nav #logo").click(function(){
    window.location = "/";
  });

});