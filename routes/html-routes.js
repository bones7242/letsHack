
module.exports = function(app) {
  app.get("/challenge/", function(request, response){

  }).then(function(data){
      response.render('challenge');
  });
};