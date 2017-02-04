$(document).ready(function(){
    showChallengeHistory();
    
    $(".profileSection button").click(function(){
        $(this).after("<input type='text' size='20'>");
    }
});