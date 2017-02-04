var db = require("../models");

module.exports = {
  createSeeds: function(){
    // create challenges
    db.Challenge.create({
        difficulty: 1,
            name: "Hello World",
            instructionsAll: "Welcome to the wide world of programming.  First things first, say 'Hello World!'",
            instructionsA: "Create a function that returns the string 'Hello'",
            instructionsB: "Create a function that returns the string 'world!'",
            startCodeA: "function sayHello(){ // A your code goes here };",
            startCodeB: "function sayWorld(){ // B your code goes here };",
            testA: "Hello",
            testA: "world!",
    });
    db.Challenge.create({
        difficulty: 1,
            name: "Hello World",
            instructionsAll: "Welcome to the wide world of programming.  First things first, say 'Hello World!'",
            instructionsA: "Create a function that returns the string 'Hello'",
            instructionsB: "Create a function that returns the string 'world!'",
            startCodeA: "function sayHello(){ // A your code goes here };",
            startCodeB: "function sayWorld(){ // B your code goes here };",
            testA: "Hello",
            testA: "world!",
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
