const router = require(`express`).Router() ;
const authMiddkewares = require(`../middlewares/authMiddelwares`);
const placeServices = require(`../services/placeService`) ; 
const querystring = require('querystring')


router.get(`/travel-catalog` , async (req, res , next)=>{
    try{
    let page = req.query.page;
    let location = req.query.location;
    let price = req.query.price;


    let colection  = await placeServices.getColection({businesTravel : false}, page ,location,price) ; 

    res.status(200).json(colection) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.get(`/work-catalog` , async (req, res , next)=>{
    try{

    let page = req.query.page;
    let limit = req.query.limit;
    let location = req.query.location;
    let price = req.query.price;

    let places = await placeServices.getColection({businesTravel : true}, page, limit ,location,price) ; 

    res.json(places) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.get(`/:placeId/details` ,async (req, res , next)=>{
    try{
    const place = await placeServices.getPlace(req.params.placeId) ; 
    if(!place){
    throw new Error(`missing place!!!`);
    }
    res.json(place) ;

}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.patch(`/:placeId/update`,authMiddkewares.autorization ,async (req, res , next)=>{
    try{
    const place =  {title , description, images, location, price, facilities, businesTravel} = req.body; 

    const UpdatedPlace = await placeServices.updatePlace(req.params.placeId , place) ; 
    res.status(204) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.delete(`/:placeId/remove`,authMiddkewares.autorization ,async (req, res , next)=>{
    try{
        const removedPlace = await placeServices.removePlace(req.params.placeId ) ; 
         res.status(204) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.post(`/create`,authMiddkewares.autorization ,async (req, res , next)=>{
    const {title , description, images, location, price, facilities, businesTravel} = req.body; 
    const owner = req.user._id ;

    const place = {
        title,
        description,
        images,
        location :  location.substring(0,1).toUpperCase() + location.substring(1).toLowerCase(),
        price,
        facilities,
        businesTravel,
        owner
    }
    try{
    const newPlace = await placeServices.addPlace(place) ;
    res.json(newPlace);
     }catch(err){
        res.status(400).json({ error : err.message });
     }
});
router.post(`/:placeId/add-comment` ,async (req, res , next)=>{
    const {comment} = req.body; 
    const userID = req.user._id ;
    const  userNickname = req.user.nickname

    const newComment = {
        user : {
            userID ,
            userNickname 
        },
        comment 
    }
    try{
    const place = await placeServices.addComment(req.params.placeId , newComment) ; 
    res.status(204);
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.post(`/:placeId/make-book` ,async (req, res , next)=>{
    const {book} = req.body; 
    const userID = req.user._id ;

    const newBook = {
        user :userID,
        from : book.from,
        to : book.to
    }
    try{
    const place = await placeServices.addBook(req.params.placeId , newBook) ; 
    res.status(204);
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.post(`/:placeId/addRate`,async (req, res , next)=>{
    const {rate} = req.body; 
    const userID = req.user._id ;

    const newRate = {
        user :userID,
        rate 
    }
    try{
    const place = await placeServices.addRate(req.params.placeId , newRate) ; 
    res.status(204);
}catch(err){
    res.status(400).json({ error : err.message });
}
});
module.exports = router ;