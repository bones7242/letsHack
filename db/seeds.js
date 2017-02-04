var db = require("../models");

module.exports = {
  createSeeds: function(){
    // create users
    // db.User.create({
    //   email: "johndoe@gmail.com",
    //   password: "password",
    //   displayName: "john-doe",
    //   firstName: "John",
    //   lastName: "Doe"
    // });
    // db.User.create({
    //   email: "janedoe@gmail.com",
    //   password: "password",
    //   displayName: "jane-doe",
    //   firstName: "Jan",
    //   lastName: "Doe"
    // });
    // db.User.create({
    //   email: "jimidoe@gmail.com",
    //   password: "password",
    //   displayName: "jimi-doe",
    //   firstName: "Jimi",
    //   lastName: "Doe"
    // });
    // create challenges
    db.Challenge.create({
        difficulty: 1,
            name: "Hello World",
            instructionsAll: "Say 'Hello World!'",
            instructionsA: "Create a function that returns the string 'Hello'",
            instructionsB: "Create a function that returns the string 'World!'",
            startCodeA: "function sayHello(){ \m// A your code goes here \n};",
            startCodeB: "function sayWorld(){ \m// B your code goes here \n};",
            test: "function(){var hello = sayHello(); var world = sayWorld(); return hello + world}"
    });
    db.Challenge.create({
        difficulty: 2,
            name: "flip it and reverse it",
            instructionsAll: "work together to solve this challenge! output should be bla",
            instructionsA: "A your task is to spin the thing and return the other thing",
            instructionsB: "B your task is to get all prime numbers betweeb bla and bla",
            startCodeA: "// A your code goes here",
            startCodeB: "// B code goes here",
            test: "function(acode, bcode){return true;}"
    });
    db.Challenge.create({
        difficulty: 5,
            name: "Just Another Challenge",
            instructionsAll: "work together to solve this challenge! output should be bla",
            instructionsA: "A your task is to spin the thing and return the other thing",
            instructionsB: "B your task is to get all prime numbers betweeb bla and bla",
            startCodeA: "// A your code goes here",
            startCodeB: "// B code goes here",
            test: "function(acode, bcode){return true;}"
    });
    //create sessions
    // db.Session.create({
    //   success: true,
    //   UserId: 1,
    //   TeammateId: 2,
    //   ChallengeId: 1
    // });
    // db.Session.create({
    //   success: true,
    //   UserId: 2,
    //   TeammateId: 1,
    //   ChallengeId: 1
    // });
    // db.Session.create({
    //   success: false,
    //   UserId: 1,
    //   TeammateId: 2,
    //   ChallengeId: 2
    // });
    // db.Session.create({
    //   success: false,
    //   UserId: 2,
    //   TeammateId: 1,
    //   ChallengeId: 2
    // });
  }
}
