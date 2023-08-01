const User = require(`../models/User`) 
const bcript = require(`bcrypt`) ; 
const {jwt} = require(`../utils/jsonWebToken`) ; 
const constants = require(`../lib/constats`) ; 


exports.addNewUser = async (username , password) => {
    
    let user = await User.findOne({username}) ;
    if(user){
        throw new Error (`This user is existing!`) ; 
    }

    // VALIDATE PASSWORD!!!!!!!!!!!!!!!
    if(password.length < 4){
        throw new Error (`Password length must be more 4 simbols!`) ; 
    }

    const hashedPassword = await bcript.hash(password ,10) ; 
    const currentUser = {username , nickname : username, password : hashedPassword , accessToken : '', places : [] , books : [] , profilePicture : "" , about : "" , mesages : []} ; 
    const newUser = await User.create(currentUser); 
    const token = await this.setToken(JSON.stringify({_id: newUser._id , username : newUser.username , username : newUser.username}));
    const upatedUser = await this.UpdateUser("accessToken", token , newUser._id);
    return {...newUser.toObject(), "accessToken" : token };
} ; 

exports.verifyUser = async(username , password) => {
    
    const user = await User.findOne({username}).lean() ;
    const validPass = await bcript.compare(password , user.password) ; 

    if(!user || !validPass){
        throw new Error(`wrong password or username`)
    }
    user._id = user._id.toString(); 
    return user
};

exports.setToken = async (user) => {
    
    const token = await jwt.sign(user , constants.secret ) ; 
    return token 
};

exports.UpdateUser = async (property  , token , _id) => {
    await User.findByIdAndUpdate({_id},{[property] : token});
}
exports.removeToken = async (_id) => {
    await User.findByIdAndUpdate(_id,{accessToken : ""})
}

exports.getUser = async (username) => {
    const  user = await User.findOne({username}).populate("books").populate("places").lean();
    return  ({
    _id : user._id, 
    username : user.username ,
    accessToken : user.accessToken || "" ,
    places : user.places || [],
    books : user.books || [],
    profilePicture : user.profilePicture || "" ,
    about : user.about || "" ,
    mesages : user.mesages || [] , 
})
}