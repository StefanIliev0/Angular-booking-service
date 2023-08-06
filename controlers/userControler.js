const router = require(`express`).Router() ;
const authServices = require(`../services/authServices`) ;
const authMiddkewares = require(`../middlewares/authMiddelwares`);
const userService = require(`../services/userService`)


router.post(`/register`  , async(req ,res) => {
    const {username , password} = req.body ; 
    try{
    const user =  await authServices.addNewUser(username , password) ; 
    res.json(user);
    }catch(err){
        res.status(400).json({ error : err.message });
    }
} );
router.post(`/login` , async (req, res ,next) => {
    const {username , password} = req.body ; 
    
    try{
    const user = await authServices.verifyUser(username , password); 
    
    const token  = await authServices.setToken({ _id :user._id , username : user.username , nickname : user.nickname});
    await authServices.UpdateUser("accessToken" ,token , user._id); 
    const currnetUser = await authServices.getUser(username); 
    res.json(currnetUser)
    }catch(err){
        res.status(400).json({ error : err.message });
    }}) ; 
router.post (`/logout` , async (req , res , next) => {
    const {_id} = req.body ; 
try{
    await authServices.removeToken(_id); 
    res.status(200);
}catch(err){
    res.status(400).json({ error : err.message });
}}) ; 
router.patch(`/:userId/update`,authMiddkewares.autorization ,async (req, res , next)=>{
    try{
    const user =  {nickname , about , profilePicture } = req.body; 

    const UpdatedUser = await userService.editUser(req.params.userId , user) ; 
    res.status(204) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.post(`/:userId/addConversation`,authMiddkewares.authentication ,async (req, res , next)=>{
    try{
    const conversation  =  {title , placeId , from , to  } = req.body; 
    const bookingUserId = req.user._id ;
    const bookingUserNickname = req.user.nickname ; 
    const newConv = await userService.addConversation(req.params.userId ,bookingUserId, bookingUserNickname,conversation) ; 
    res.status(201).json(newConv);
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.delete(`/messages/:conversationId`,authMiddkewares.authentication ,async (req, res , next)=>{
    try{
    const userId = req.user._id ;
    const newConv = await userService.removeConversation(userId, req.params.conversationId ) ; 
    res.status(202);
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.post(`/messages/:messageId`,authMiddkewares.authentication ,async (req, res , next)=>{
    try{
    const  {text, otherUserId , userId} = req.body; 
    const textMessageId  = req.params.messageId ; 
    const userOneMessage = await userService.addMessage(text, otherUserId , userId , textMessageId) ; 
    res.status(201).json(userOneMessage);
}catch(err){
    res.status(400).json({ error : err.message });
}
});
router.get(`/userData`,authMiddkewares.authentication ,async (req, res , next)=>{
    try{
    const userId = req.user._id ;
    const userData = await userService.getUserData(userId) ; 
    res.status(200).json(userData);
}catch(err){
    res.status(400).json({ error : err.message });
}
});

module.exports = router ;