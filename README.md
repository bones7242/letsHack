# letsHack
*learn to code by working together to solve problems.*

letsHack is a collaborative coding web app that lets people get paired up randomly with other coders, and work together to solve a hacking challenge.

letsHack is written in JavaScript using Node, Express, Sequelize, Handlebars, and Firebase.

[Application overiew - powerpoint presentation](https://docs.google.com/presentation/d/1DJZedp5DKjjFjCM9r3zlsF3VLGBXBzzJzFoaZCIIs6s/edit?usp=sharing)

[Live application](https://polar-sea-42102.herokuapp.com/)

### Authors: 
@jesseharold
@billbitt
@ehirshfield

### Project Highlights

+ Wrote entire front and back end of this full-stack application utilizing MVC structure
 * used MySQL database with Sequelize ORM
 * used express for the server
 * used handlebars to render the View
+ Utilized passport.js for authentication

### Application flow

+ The user can create a new profile or log in to an existing profile
+ Upon logging in, the user enters a public lobby with all other letsHack users
 * Users can chat while they wait in the lobby
 * When ready to do a coding challenge, the user can place him or herself into the cue and will automatically be paired with another user from the cue
+ Paired users are taken to a challenge page.  On this page they each complete a portion of the challenge by writing code.
 * In order to pass the challenge, both users must write code that satisfies their portion of the challenge.
 * Users can use the chat feature to help their partner
+ After the users complete their challenge, they are returned to the lobby
+ Each user has a profile page which shows their profile data and challenge history

### Libraries & Frameworks

+ bcrypt
+ body-parser
+ connect-flash
+ cookie-parser
+ express
+ express-handlebars
+ express-session
+ handlebars
+ method-override
+ morgan
+ mysql
+ passport
+ passport-local
+ sequelize

### Screen Shot
![Login](http://i.imgur.com/Ewl0l7M.png)

![Lobby](http://i.imgur.com/Ydi7XD0.png)

![Challenge](http://i.imgur.com/JNtKlyk.png)
