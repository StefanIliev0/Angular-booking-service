const router = require(`express`).Router() ;
const authServices = require(`../services/authServices`) ;


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
    
    const token  = await authServices.setToken({ _id :user._id , username : user.username});
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


module.exports = router ;