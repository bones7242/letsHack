var db = require("../models");

module.exports = {
  createSeeds: function(){
    // create challenges
    db.Challenge.create({
        difficulty: 1,
            name: "Hello World",
            instructionsAll: "Welcome to the wide world of programming.  First things first, say 'Hello world!'",
            instructionsA: "Create a function that returns the string 'Hello'",
            instructionsB: "Create a function that returns the string 'world!'",
            startCodeA: "function sayHello(){\n\t// A your code goes here\n}",
            startCodeB: "function sayWorld(){\n\t// B your code goes here\n}",
            testA: "Hello",
            testB: "world!",
    });
    db.Challenge.create({
        difficulty: 1,
            name: "Hello World",
            instructionsAll: "Welcome to the wide world of programming.  First things first, say 'Hello world!'",
            instructionsA: "Create a function that returns the string 'Hello'",
            instructionsB: "Create a function that returns the string 'world!'",
            startCodeA: "function sayHello(){\n\t// A your code goes here\n}",
            startCodeB: "function sayWorld(){\n\t// B your code goes here\n}",
            testA: "Hello",
            testB: "world!",
    });
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
    //create sessions
        // db.Session.create({
        //   success: true,
        //   playerA: 1,
        //   playerB: 2,
        //   ChallengeId: 1
        // });
        // db.Session.create({
        //   success: true,
        //   playerA: 2,
        //   playerB: 1,
        //   ChallengeId: 1
        // });
        // db.Session.create({
        //   success: false,
        //   playerA: 1,
        //   playerB: 2,
        //   ChallengeId: 2
        // });
        // db.Session.create({
        //   success: false,
        //   playerA: 2,
        //   playerB: 1,
        //   ChallengeId: 2
        // });
  }
}
