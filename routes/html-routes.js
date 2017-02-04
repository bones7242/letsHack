module.exports = function(app) {
  app.get("/session/create", function(request, response){
    var userId = request.query.userId;
    var teammateId = request.query.teammateId;
    var matchId = request.query.matchId;
    console.log(teammateId);
   response.render('challenge', {
     challenge:
      {
      id:666, 
      name:"best challenge"
      }
    });
  });
};