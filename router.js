const router = require(`express`).Router() ;
const userControler = require(`./controlers/userControler`);
const plasesControler = require(`./controlers/placesControler`);
const imageControler = require(`./controlers/imageControler`); 
const companyControler = require(`./controlers/companyControler`)


router.use(`/users` , userControler ); 
router.use(`/places` , plasesControler);
router.use(`/images` , imageControler);
router.use(`/company` , companyControler);



module.exports = router ;