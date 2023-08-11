const express = require(`express`);
const connectDB = require(`./utils/conectDB`);
const cors = require(`cors`);
const bodyParser = require('body-parser');


const authMiddkewares = require(`./middlewares/authMiddelwares`); 
const  router = require("./router");


const app = express() ;

app.use(cors());
app.use(bodyParser.json())
app.use(express.urlencoded({extended : false})) ;
app.use(express.json())
app.use(express.raw({ type: 'image/*', limit: '5mb' }))
app.use(authMiddkewares.authentication);

app.use(router)

connectDB.connectDB()
    .then( () => {app.listen(3000, console.log(`Listening on port 3000! Now its up to you...`))}) 
    .catch( (err) => { 
        connectDB.closeConnection();
        console.log (err)}) ;
