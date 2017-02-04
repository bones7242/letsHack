$(document).ready(function(){
    showChallengeHistory();

    $(".profileSection button").click(function(){
        $(this).parent(".profileSection").find("input.profileEdit").show();
        return false;
    });
});
