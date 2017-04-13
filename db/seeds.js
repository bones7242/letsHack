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
            testAArgument: "", 
            testAResult: "Hello",
            testBArgument: "", 
            testBResult: "world!",
    });
    db.Challenge.create({
        difficulty: 1,
            name: "Uppers and Lowers",
            instructionsAll: "Do yo functions!",
            instructionsA: "Write a function that takes in a string and returns it in all caps.",
            instructionsB: "Write a function that takes in a string in all caps and returns it in lower case.",
            startCodeA: "function makeItUpper(string){\n\t// A your code goes here\n}",
            startCodeB: "function makeItLower(string){\n\t// B your code goes here\n}",
            testAArgument: "i am whispering", 
            testAResult: "I AM WHISPERING",
            testBArgument: "I AM YELLING", 
            testBResult: "i am yelling",
    });
    db.Challenge.create({
        difficulty: 3,
            name: "Pig Latin",
            instructionsAll: "Did you ever speak Pig Latin as a kid to keep secrets from your parents? The rules are: 1) If a word starts with a consonant, move the first letter to the end of the word and add \"ay\". 2) If the word starts with a vowel, just add \"yay\" to the end of the word. Work with your partner to cover these two cases and create a Pig Latin translator.",
            instructionsA: "Write a function that takes a word in English as an argument, and returns it's Pig Latin equivalent. The word your function gets will always start with a consonant (that's anything other than a,e,i,o, or u).",
            instructionsB: "Write a function that takes a word in English as an argument, and returns it's Pig Latin equivalent. The word your function gets will always start with a vowel (that's a,e,i,o, or u).",
            startCodeA: "function pigLatinConsonant(englishWord){\n\t// A your code goes here\n}",
            startCodeB: "function pigLatinVowel(englishWord){\n\t// B your code goes here\n}",
            testAArgument: "campfire", 
            testAResult: "ampfirecay",
            testBArgument: "ottoman", 
            testBResult: "ottomanyay",
    });
    db.Challenge.create({
        difficulty: 1,
            name: "Reverse Reverse",
            instructionsAll: "Slide to the left! Now reverse these!  For example, 231 would be 132!",
            instructionsA: "Write a function that reverses any string passed in, and returns the backwards string.",
            instructionsB: "Write a function that reverses any sequence of nubmers passed in, and returns the backwards number.",
            startCodeA: "function reverseThisString(string){\n\t// A your code goes here\n}",
            startCodeB: "function reverseThisNumber(number){\n\t// B your code goes here\n}",
            testAArgument: "raboof", 
            testAResult: "foobar",
            testBArgument: 934324, 
            testBResult: 423439,
    });
    db.Challenge.create({
        difficulty: 1,
            name: "Reverse Reverse",
            instructionsAll: "Slide to the left! Now reverse these!  For example, 231 would be 132!",
            instructionsA: "Write a function that reverses any string passed in, and returns the backwards string.",
            instructionsB: "Write a function that reverses any sequence of nubmers passed in, and returns the backwards number.",
            startCodeA: "function reverseThisString(string){\n\t// A your code goes here\n}",
            startCodeB: "function reverseThisNumber(number){\n\t// B your code goes here\n}",
            testAArgument: "raboof", 
            testAResult: "foobar",
            testBArgument: 934324, 
            testBResult: 423439,
    });
    db.Challenge.create({
        difficulty: 2,
            name: "Simon Says",
            instructionsAll: "Who is this Simon, anyway, and why does he get to boss everyone around? Another childhood favorite, you must do as your told, as long as the other person says 'Simon says...' first. Write functions to play this game of nitpicky obedience!",
            instructionsA: "Write a function that takes an order in as a string, and randomly decides whether to return it as is, or return it with 'Simon says' at the beginning",
            instructionsB: "Write a function that takes in a string, and returns true if it contains the text 'Simon says', and false if it doesn't",
            startCodeA: "function simonSays(order){\n\t// A your code goes here\n}",
            startCodeB: "function didSimonSay(statement){\n\t// B your code goes here\n}",
            testAArgument: "shake your booty", 
            testAResult: "Simon says shake your booty",
            testBArgument: "Simon says shake your booty", 
            testBResult: true,
    });
  }
}
