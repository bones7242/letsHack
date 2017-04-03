$(document).ready(function(){
    showChallengeHistory();

    $(".profileSection button").click(function(){
        $(this).parent(".profileSection").find("input.profileEdit").show();
        $(".hiddenSubmit").show();
        return false;
    });
    $(".reportSubmit").click(function(e){
        e.preventDefault();
        var reportData = {
            reportedby: $("div.dataHolder").data().displayname,
            username: $("div.dataHolder").data().showinguser,
            reason: $("#reportReason").val().trim()
        };
        // send this info to the route that creates a report
        $.ajax({
            url: "/report/",
            type: "PUT",
            data: reportData,
            success: function(report) {
                console.log("report submitted ", report);
                $("#reportingForm").html("<h3>Thank you</h3>Your report was submitted and will be reviewed.");
            }
        });
    });
});
