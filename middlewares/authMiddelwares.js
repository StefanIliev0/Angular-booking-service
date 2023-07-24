
const {jwt} = require(`../utils/jsonWebToken`) ; 
const constants = require(`../lib/constats`);
const User = require ('../models/User');
const Place = require('../models/Place');


exports.authentication = async (req,res,next) => {
const token = req.header("accessToken") ; 
if(token){
try{
    const decodedToken = await jwt.verify(token , constants.secret) ;
    req.user = decodedToken ; 
    res.locals.isAutenthicated = true ; 
    next() ; 
}catch(err){
    res.status(400).json({error : err});
}
}else{
    next() ; 
}
}
exports.autorization = async ( req, res ,next) => {
const CurrentUserId = req.user._id ; 
const userID = req.params.userId; 
const  placeID = req.params.placeId

if(placeID){
    const currentItemOwner  = await Place.findById(placeID).lean(); 
    if(currentItemOwner.owner === CurrentUserId){
        next()
    }else {
    res.status(401)
    }
}
if(userID){
    const currentItemOwner  = await User.findById(userID).lean(); 
    if(currentItemOwner._id === CurrentUserId){
        next()
    }else {
    res.status(401)
    }
}

next()

}