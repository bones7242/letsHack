$(document).ready(function() {
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