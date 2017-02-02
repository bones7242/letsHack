var db = require("../models");

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render("login");
  });

  app.get("/signup", function(req, res) {
    res.render("login");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  // when clicked from the nav
  app.get("/lobby", function(req, res) {
    // this page needs data:
    // logged in user info
    db.User.findOne({
      where: {
        id: req.body.userId //can change this to displayName or email if that is better 
      }
    }).then(function(data){   
      res.render("lobby", {user: data});
    });
  });

  // this one will not actually be used in production, 
  // since challenges will be accessed after create session
  app.get("/challenge/:challengeid", function(req, res) {
    db.Challenge.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(data){
      res.render("challenge", {challege: data});
    })
  });
}