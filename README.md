# Booking ExpressJS service RestAPI

## Introduction

This is a project written entirely by me with the purpose of presenting the skills I have on the ExpressJS and NodeJS. For this purpose, I have used a minimal amount of additional libraries. Please do not abuse the code in this repositories!

The application is designed to serve the [Angular Booking App](https://github.com/StefanIliev0/booking-angular-app).

## Contents
1. [Startup](#startup)
2. [Application structure](#application-structure)
3. [Main folder](#main-folder)
4. [Models](#models)
5. [Controlers](#controlers)
6. [Services](#services)
7. [Midlewares](#midlewares)


## Startup
This project uses standard commands to launch an ExpressJS application.
After copying the repository you need to install the node packages with `npm install` 

#### Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will use nodemoon and will automatically reload if you change any of the source files.If you want to startup aplication without nodemoon you can run with `npm start`.

### Deployment server


You can use or test this application on `https://kind-lime-attire.cyclic.app/`. 



## Application structure 

* App main folder.
   * Controlers 
   * Libraries 
   * Middlewares 
   * Models 
   * Services 
   * Utils 
* index.js
* router.js

## Main folder

The main folder contains the entire structure of the application, as well as the startup file and the file in which the main router of the application is defined.

### index.js 

A service is defined and started in this file.

The aplication uses some middlewares to be able to perform its main functionalities:

* `cors()` - to allow the server to serve applications whose domain is different.

* `body-parser` - to match the JSON objects that are sent with the requests.

* `express.urlencoded()` - it  parses incoming requests with URL-encoded payloads and is based on a body parser.

* `express.raw()` - It  parses incoming request payloads into a Buffer and is based on body-parser.This midleware is used for work with files from incoming with requests.

* `authMiddkewares.authentication` -  this is an authentication middleware that checks request header "accessToken" and obtains and converts the token into a "user" object and adds it to a request.

* `router` -  this is a middleware that provade Router funcionality in the aplication. 


At the end application is asynchronous connected to database. After connecting to DB is ready starts listen on port 3000.

### router 

This file is used to provide router functionality in the application.

Once defined, Router() accepts and uses three subrouters:

* Users router -this router serves all requests starts with `/users`.

* Places router -this router serves all requests starts with `/places`.

* Images router -this router serves all requests starts with `/images`.

[home](#contents)

## Models 

Because the application uses MongoDB as a database. 
The database models are defined in this folder. 

This application uses two models:


### User Model 

This model holds all the information that is saved in the user database.

Structure :

 * Username - this is string which gives information for user  username. It is uses for login in aplication.

 * password - this is string which gives information for user password. It is uses for login in aplication.

 * accessToken - this is string where the user's current access token is stored.

 * nickname - this is string which gives information for user nickname.

 * places - this is array where the users places is stored. Every place is stored as relation ID. 

 * books - this is array where the users books is stored. Every book is object where as a string are define start date , end date and ID at current place. 

 * profilePicture - this is string where the user's profile picture is stored.

 * about - this is string where the user's аdditional information is stored.

 * mesages - this is array where the users messages is stored. Every message is object where are define for witch place is starting conversation , whether the reservation is approved , who are the participants, messages sends in this conversation and id for this conversation. 


 ### Place Model 

This model holds all the information that is saved in the place database.

Structure :

* title - this is a string which gives information for place's title.

* description - this is a string which gives information for place's description.

* images -  this is an array where the place's images is stored. Every place is stored as string URI. 

* location - this is a  string where the place's location is stored.

* owner - this is a relation ID where the place's owner is stored.

* rating - this is array where the place's rating is stored. Every rate is object where as a string is define voted user ID , end  rate as a number .

* price - this is number where the place's price is stored.

* rooms - this is number which gives information for place's rooms.

* comments - this is an array where the place's comments is stored. Every comment is object where are define who user is commented and the comment itself as a string.

* books - this is an  array where the place's books is stored. Every book is object where are define who user is booked this place ,start date as a string and end date as string. 

* facilities - this is an array where the  place's facilities is stored. Every facility is stored as a string. 

* businesTravel - this is a boolean where is stored whether the place will be used for business trips or for tourist trips. 
 
[home](#contents)

## Controlers 

There are three controllers in the app. Each controller is responsible for paths starting with a specific path.

### User controler 

   This controler is reaponsible for all requests starts with `/users`

#### Post requests : 

* `/users/login` - In this request, the application received `{username , password}` from `req.body`. It then authenticates the user, generates and sets the Token in the DB. Finally, it returns the user data to the consumer application. If an error occurs, it returns an object that contains a message with information about an error that occurred.

* `/users/register` - In this request, the application received `{username , password}` from `req.body`. After then via service verifies that the data meets the requirements and set new User in DB. Finally, it returns new user data to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.

* `/users/logout` - This request use authentication midleware. In this request, the application received `{_id}` from `req.body`. After then via service remove Token for this user From DB. Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.

* `/users/:userId/addConversation` - This request use authentication midleware. In this request, the application received `{title , placeId , from , to}` from `req.body` and `userId and  nickname` from the previously attached information to the request. After then via service add new conversation to DB. Finally, it returns new conversation object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.

* `/users/messages/:messageId` -This request use authentication midleware. In this request, the application received `{text, otherUserId , userId}` from `req.body` and `textMessageId` from request`s params. After then via service add new message to DB. Finally, it returns new message object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.

* `/users/messages/:conversationId/read` -This request use authentication midleware. In this request, the application received `userId` from the previously attached information to the request and `conversationId` from request`s params. After then via service change status on messages in this conwersation to "read". Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.

#### Get requests : 

* `/users/userData` -This request use authentication midleware. In this request, the application received `userId` from the previously attached information to the request. After then via service gets data for messages and reservation on this user from DB. Finally, it returns userdata object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.


#### Patch requests : 

* `/users/:userId/update` -This request use autorization midleware. In this request, the application received `{nickname , about , profilePicture }` from `req.body` and `userId` from the previously attached information to the request. After then via service update data for this user to DB. Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.   

* `/users/messages/:conversationId/approve` -This request use authentication midleware. In this request, the application received ` {userOneId , userTwoId }` from `req.body` and `conversationId` from request`s params. After then via service update conversation data for both users to DB. Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.   

#### Delete request : 

* `/users/messages/:conversationId` -This request use authentication midleware. In this request, the application received `userId` from the previously attached information to the request and `conversationId` from request`s params. After then via service remove conversation from user data and send messaga to other user in this conversation. Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.   

### Place controler 

   This controler is reaponsible for all requests starts with `/places`.


#### Post request 

* `/places/create` -This request use authentication midleware. In this request, the application received `{title , description, images, location, price, facilities, businesTravel, rooms}` from `req.body` and `userId` from the previously attached information to the request. After then via service add new place to DB. Finally, it returns new place object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.   

* `/places/:placeId/addComment` -This request use authentication midleware. In this request, the application received `{comment}` from `req.body`, `userId, nickname` from the previously attached information to the request and `placeId` from request`s params. After then via service add new comment to this place in DB. Finally, it returns new comment object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

* `/places/:placeId/makeBook` -This request use authentication midleware. In this request, the application received `{book , userId}` from `req.body` and `placeId` from request`s params. After then via service add new reservation to DB. Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

* `/places/:placeId/addRate` -This request use authentication midleware. In this request, the application received `{rate}` from `req.body` , `placeId` from request`s params  and userId from the previously attached information to the request. After then via service add new rate for this place to DB. Finally, it returns empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

#### Get requests 

* `/places/travel-catalog` - In this request, the application received `{page, location,price}` from request`s queries. After then via service gets places colection from  DB. Finally, it returns places array to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

* `/places/work-catalog` - In this request, the application received `{page, location,price}` from request`s queries. After then via service gets work places colection from  DB. Finally, it returns work places array to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

* `/places/:placeId/details` - In this request, the application received `{placeId}` from request`s params. After then via service gets place from  DB. Finally, it returns work place object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  


#### Patch requests 

* `/places/:placeId/update` - This request use autorization midleware. In this request, the application received `{placeId}` from request params and
 `{title , description, images, location, price, facilities, businesTravel}` from req.body . After then via service update current  place on DB. Finally, it return empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  


#### Delete requests 

* `/places/:placeId/remove` - This request use autorization midleware. In this request, the application received `userId` from the previously attached information to the request  and `{placeId}` from request params. After then via service remove current place from DB. Finally, it return empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

* `/places/:placeId/removeComment/:commentId` - This request use autorization midleware. In this request, the application received `{placeId , commentId}` from request`s params. After then via service remove current comment from place in DB. Finally, it return empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

### Image controler 

   This controler is reaponsible for all requests starts with `/images`

#### Post request 

* `/images/:fileName` - This request use autentication midleware. the application received `fileName` from request`s params. After then via AWS.S3() add new file to storage. Finally, it return string path to file to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  


#### Get requests 

* `/images/:fileName` -  In this request, the application received `fileName` from request`s params. After then via AWS.S3() get current file from storage. Finally, it return file to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

#### Delete requests 

* `/images/:fileName` -  In this request, the application received `fileName` from request`s params. After then via AWS.S3() remove current file from storage. Finally, it return empty object to the consumer application.  If an error occurs, it returns an object that contains a message with information about an error that occurred.  

[home](#contents)

## Services 

### Auth service

Authentication service is responsible for authentication of users.It have six methods.

* `addNewUser`  

   * It accepts two parameters - username and password.
   * Checks if a user with that name exists.
   * Validate password.
   * Hash password.
   * Create new user object in DB. 
   * Create token based on created user object.
   * Add token to created object.
   * return user object.

* `verifyUser` 

   * It accepts two parameters - username and password.
   * Find user in DB.
   * Compare and check password. 
   * if password success compare return user.

* `setToken` 

  * It accepts one parameter - user.
  * Set token based on user.
  * Returns user`s token.

* `UpdateUser`

   * It accepts three parameters - property  , token and _id.
   * Update users token. 
   
* `removeToken`

   * It accepts one parameter - _id.
   * Find user by Id .
   * Sets users token on empty string.

* `getUser`

   * It accepts one parameter -  username.
   * Gets user from DB.
   * Return user object. 


[home](#contents)

### User service 

User service is responsible user-related actions.It have ten methods.

* `addPlace` 

   * It accepts two parameters - placeId and owner.
   * Gets user from DB.
   * Add new place to user object.
   * Return user object. 

* `addBook` 

   * It accepts two parameters - book and owner.
   * Gets user from DB.
   * Add new book to user object.
   * Return user object. 

* `removePlace` 

   * It accepts two parameters - placeID and owner.
   * Gets user from DB.
   * remove place from user object.
   * Return user object. 

* `editUser` 

   * It accepts two parameters - userID and userData.
   * Gets user from DB.
   * Update user object.

* `addConversation` 

   * It accepts four parameters - ownerId, bookingUserId, bookingUserNickname and conversation.
   * Generate conversation ID. 
   * Gets both patrificants users in conversation.
   * Add new conversation to users objects.
   * Return conversation object. 

* `approveBookConv`

   * It accepts two parameters - userOneId and conversationId .
   * Gets  user object from  DB. 
   * Find current conversation and approve it.
   * Save user. 

* `removeConversation`

   * It accepts two parameters - userId and conversationId .
   * Gets user object from  DB. 
   * Find current conversation and remove it.
   * Gets other user object from DB.
   * Add new messeges on conversation.
   * save both user objects. 

* `addMessage`

   * It accepts four parameters - text, otherUserId , userId and textMessageId .
   * Gets both users objects from  DB. 
   * Find current conversation.
   * Add new message to conversation on both users.
   * save both user objects. 

* `readMessages`

   * It accepts two parameters - userId and conversationId .
   * Gets user object from  DB. 
   * Find current conversation and update messages objects to "read".
   * save both user objects. 

* `getUserData`

   * It accepts one parameter - userId .
   * Gets user object from  DB. 
   * Return messages and books from user object as a new object.

[home](#contents)

### Place service 

Place service is responsible place-related actions.It have nine methods.

* `getColection`

   * It accepts four parameters - criteria, page, location and price .
   * Check witch parameters is undefined.
   * Get collection based on parameters from DB.
   * Return array from place objects.

* `addPlace`

   * It accepts one parameter - place .
   * Create new place object to DB. 

* `getPlace`

   * It accepts one parameter - placeId .
   * Gets place object from DB. 
   * Return place object.

* `addComment`

   * It accepts two parameters - placeId and comment.
   * Gets place object from  DB. 
   * Add comment to place object. 

* `removeComment`

   * It accepts two parameters - placeId and commentId.
   * Gets place object from  DB. 
   * Remove comment to place object. 

* `addBook`

   * It accepts two parameters - placeId and book.
   * Gets place object from  DB. 
   * Add new book to place object. 

* `addRate`

   * It accepts two parameters - placeId and rate.
   * Gets place object from  DB. 
   * Add new rate to place object. 

* `updatePlace`

   * It accepts two parameters - placeId and newData.
   * Gets place object from  DB. 
   * Update place object. 
   * Return place object.

* `removePlace`

   * It accepts one parameter - placeId .
   * Gets place object from  DB. 
   * Remove place object from  DB. 
   * Return place object.

[home](#contents)

## Midlewares

This app have one midleware who has two methods : 

### Authentication

This method takes care of checking if the user is authenticated.
If it is authenticated, information about the user is added to the request.

The working algorithm is:

* Check headers for `accessToken` header. 
* If have this header verify it.
* If verify, sets token as user object in request.
* use `next()` to continue with request.

### Autorization 

This method takes care ot checking if the user is autorizated. 

The working algorithm is:

* Gets users Id from request. 
* Get userID and placeId from params.
* Checks if one of these is available. If available, gets the object from the database.
* Checks the owner of the object. If it matches the user id taken from the request it executes `next()`, otherwise it terminates the request and returns an error.

[home](#contents)


