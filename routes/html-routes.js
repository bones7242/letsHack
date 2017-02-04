module.exports = function(app) {
  app.get("/challenge2", function(request, response){
   response.render('challenge');
  });
};