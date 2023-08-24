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
8. [Utils](#utils)


## Startup
This project uses standard commands to launch an ExpressJS application.
After copying the repository you need to install the node packages with `npm install` 

#### Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will use nodemoon and will automatically reload if you change any of the source files.If you want to startup aplication without nodemoon you can run with `npm start`.

### Deployment 

You can use or test this repository on `https://kind-lime-attire.cyclic.app/`. 



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
 

## Controlers 

There are three controllers in the app. Each controller is responsible for paths starting with a specific path.

### User controler 


### Place controler 


### Image controler 
Work in progress ... 