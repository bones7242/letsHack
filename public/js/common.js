$(document).ready(function() {
    function openModal(title, html, buttonText, buttonCallback){
      $("#modal")
      .show()
      .find(".title")
      .text(title)
      .next("p.modal-text")
      .html(html);
      if (buttonText && buttonCallback){
        $("#modal p.modal-text").append("<button>" + buttonText + "</button>");
        $("#modal").click("button", buttonCallback);
      }
    }
    function closeModal(){
      $("#modal").hide().find(".title").text("").next("p").html("");
    }
    $("#modal").click(".modal-close, modal-background", closeModal);

    $("nav #icon, nav #logo").click(function(){
      window.location = "/";
    });
    
    if (typeof user != 'undefined'){
        var lobbyLink = $("nav .nav-right")
          .show()
          .find(".nav-item.lobby-link a");
        var lobbyHref = lobbyLink.attr("href");
        lobbyLink.attr("href", lobbyHref + "?userId=" + user.id);
    }
});