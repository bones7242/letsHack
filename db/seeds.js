var db = require("../models");

module.exports = function(){
  db.User.create({
    email: "johndoe@gmail.com",
    password: "password",
    displayName: "john-doe",
    firstName: "John",
    lastName: "Doe"
  });
  db.User.create({
    email: "janedoe@gmail.com",
    password: "password",
    displayName: "jane-doe",
    firstName: "Jan",
    lastName: "Doe"
  });
  db.User.create({
    email: "jimidoe@gmail.com",
    password: "password",
    displayName: "jimi-doe",
    firstName: "Jimi",
    lastName: "Doe"
  });
  db.User.create({
    email: "johndoe@gmail.com",
    password: "password",
    displayName: "john-doe",
    firstName: "John",
    lastName: "Doe"
  });
  db.Session.create({
    success: true,
    User: 1,
    Teammate: 2,
    ChallengeId: 1
  });
  db.Challenge.create({
      difficulty: 1,
          name: "flip it and reverse it",
          instructionsAll: "work together to solve this challenge! output should be bla",
          instructionsA: "A your task is to spin the thing and return the other thing",
          instructionsB: "B your task is to get all prime numbers betweeb bla and bla",
          startCodeA: "// A your code goes here",
          startCodeB: "// B code goes here",
          test: "function(acode, bcode){return true;}"
  });
};