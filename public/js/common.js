//dummy data for logged in user
var user = {
  displayName : "HaroldCommonJS",
  userId : 90876,
  loggedIn : true
}
$(document).ready(function() {
    $("nav #icon, nav #logo").click(function(){
      console.log("go home");
      window.location = "/";
    });
    if (user.loggedIn){
      $("nav .nav-right").show();
    }
});