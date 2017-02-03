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
$(document).ready(function() {
  
    //get logged in user data from server
    var user = {
        displayName: $(".dataHolder").data().displayname, 
        id: $(".dataHolder").data().userid
    };
    //console.log(user);

  if (typeof user.id != 'undefined'){
      var lobbyLink = $("nav .nav-right")
        .show()
        .find(".nav-item.lobby-link a");
      var lobbyHref = lobbyLink.attr("href");
      lobbyLink.attr("href", lobbyHref + "?userId=" + user.id);
  }

  $("#modal .modal-close, #modal modal-background").click(closeModal);

  $("nav #icon, nav #logo").click(function(){
    window.location = "/";
  });

});