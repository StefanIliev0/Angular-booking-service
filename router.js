const router = require(`express`).Router() ;
const userControler = require(`./controlers/userControler`);
const plasesControler = require(`./controlers/placesControler`);
const genericErrorMidleware = require(`./middlewares/errorMiddleware`);


router.use(`/users` , userControler ); 
router.use(`/places` , plasesControler);

module.exports = router ;