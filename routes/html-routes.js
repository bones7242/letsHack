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

  app.get("/lobby", function(req, res) {
    res.render("lobby");
  });

  app.get("/challenge", function(req, res) {
    // this page needs all data for the session, and two user data objects
    res.render("challenge");
  });
}
