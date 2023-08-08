const router = require(`express`).Router() ;
const userControler = require(`./controlers/userControler`);
const plasesControler = require(`./controlers/placesControler`);
const imageControler = require(`./controlers/imageControler`); 


router.use(`/users` , userControler ); 
router.use(`/places` , plasesControler);
router.use(`/images` , imageControler);



module.exports = router ;