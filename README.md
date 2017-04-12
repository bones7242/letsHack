# letsHack
*learn to code by working together to solve problems.*

letsHack is a collaborative coding web app that pairs users up randomly with another coder, to work together to solve a hacking challenge.

letsHack is written in JavaScript using Node, Express, Sequelize, Handlebars, and Socket.io.

[Application overiew - powerpoint presentation](https://docs.google.com/presentation/d/1DJZedp5DKjjFjCM9r3zlsF3VLGBXBzzJzFoaZCIIs6s/edit?usp=sharing)

[Live application](https://polar-sea-42102.herokuapp.com/)

### Authors: 
@jesseharold
@billbitt
@ehirshfield

### Project Highlights

+ Wrote entire front and back end of this full-stack application utilizing MVC structure
 * uses MySQL database with Sequelize ORM
 * uses Node Express for the server
 * uses Handlebars to render the View
 * Uses passport.js for user authentication
 * Uses socket.io for realtime chat and codesharing
 * Uses codemirror frontend library for javascript code formatting and color hinting

### Application flow

+ The user can create a new profile or log in to an existing profile
+ Upon logging in, the user enters a public lobby with all other letsHack users
 * Users can chat while they wait in the lobby
 * When ready to do a coding challenge, the user can place him or herself into the queue and will automatically be paired with another user from the queue
+ Paired users are taken to a challenge page.  On this page they each complete a portion of the challenge by writing code.
 * In order to pass the challenge, both users must write code that satisfies their portion of the challenge.
 * Users can use the chat feature to help their partner
+ After the users complete their challenge, they are returned to the lobby
+ Each user has a profile page which shows their profile data, profile picture, and challenge history
+ Users can edit their own profile, and can view the publicly available elements of other users' profiles as well
+ Users can report other users who are engaged in abusive behavior
+ Administrators have a protected view where they can edit and create challenges and view users' reports

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
+ socket.io

+ CodeMirror
+ Bootstrap
+ jQuery

### Screen Shot
![Login](http://i.imgur.com/Ewl0l7M.png)

![Lobby](http://i.imgur.com/Ydi7XD0.png)

![Challenge](http://i.imgur.com/JNtKlyk.png)
