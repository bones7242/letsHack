// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the users
  app.get("/api/users", function(request, response) {
    db.User.findAll({}).then(function(data) {
      response.json(data);
    });
  });
  // GET route for getting all of the challenges
  app.get("/api/challenges", function(request, response) {
    db.Challenge.findAll({}).then(function(data) {
      response.json(data);
    });
  });
  // GET route for getting all of the sessions 
  app.get("/api/sessions", function(request, response) {
    db.Session.findAll({}).then(function(data) {
      response.json(data);
    });
  });

};
