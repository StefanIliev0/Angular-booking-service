const express = require(`express`); 
const cookieParser = require(`cookie-parser`);
const connectDB = require(`./utils/conectDB`);
const cors = require(`cors`);


const authMiddkewares = require(`./middlewares/authMiddelwares`); 
const  router = require("./router");


const app = express() ;

app.use(cors());

app.use(express.urlencoded({extended : false})) ;
app.use(express.json())
app.use(authMiddkewares.authentication);

app.use(router)

connectDB()
    .then( () => {app.listen(3000, console.log(`Listening on port 3000! Now its up to you...`))}) 
    .catch( (err) => { console.log (err)}) ;
