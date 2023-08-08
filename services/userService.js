
const User = require(`../models/User`);


exports.addPlace = async ( placeId , owner ) => {
    let user = await User.findById(owner);
    user.places.push(placeId);
    await user.save();
    return user; 
}
exports.addBook = async ( book , owner ) => {
    let user = await User.findById(owner);
    user.books.push(book);
    await user.save();
    return user; 
}
exports.removePlace = async ( placeId , owner ) => {
    let user = await User.findById(owner);
    user.places =  user.places.filter(x => x !== placeId);
    await user.save();
    return user; 
}
exports.editUser = async ( userId , newData ) => {
    let place = await User.findByIdAndUpdate(userId , newData);
    return place; 
}
exports.addConversation = async (ownerId,bookingUserId, bookingUserNickname,conversation) => {
    const  {title , placeId , from , to  } = conversation ; 
    const owner = await User.findById(ownerId);
    let user = await User.findById(bookingUserId); 
    let newConversation = {
        forPlace : {
            title,
            id :  placeId ,
            from ,
            to ,
        },
        approval : {
            approve : false,
            unapprove :false
        },
        participants :[{
        id :  owner._id,
        nickname :  owner.nickname
        } , {
            id :  bookingUserId,
            nickname : bookingUserNickname
            } ],
        mesages : []
    }

    user.mesages.push(newConversation); 
    await user.save();
    user  = await User.findById(bookingUserId); 
    newConversation._id =  user.mesages[user.mesages.length - 1]._id; 
    console.log(newConversation)
    owner.mesages.push(newConversation);
    await owner.save();
    return user.mesages[user.mesages.length - 1]
}
exports.removeConversation = async (userId , conversationId) => {
    const userOne = await User.findById(userId);
    const conversation = userOne.mesages.find(x => x._id == conversationId)
    let userTwoId = "";
    conversation.participants.forEach(x => {
        if(x.id != userId){
            userTwoId = x.id;
        }
    })
    userOne.mesages = userOne.mesages.filter(x => x._id != conversationId);
    userOne.save();
    let userTwo = await User.findById(userTwoId); 
    let userTwoConv = userTwo.mesages.find(x => x._id == conversationId);
    if(userTwoConv){
    userTwoConv.mesages.push({
        read: false,
        user : userId, 
        mesage : "Other user delete this conversation."
    })
    userTwo.save()
}}
exports.addMessage = async (text, otherUserId , userId , textMessageId) => {
    let userOne  = await User.findById(userId);
    let userTwo = await User.findById(otherUserId); 
    let textMessageOne   = {
        read : true ,
        mesage : text , 
        user : userId 
    }
    let textMessageTwo  = {
        read : false ,
        mesage : text , 
        user : userId 
    }
    let UserOneMessages = userOne.mesages.filter(x => x._id == textMessageId)[0] ;
    UserOneMessages.mesages.push(textMessageOne); 
    await userOne.save()
    let UserTwoMessages = userTwo.mesages.filter(x => x._id == textMessageId)[0] ;
    UserTwoMessages.mesages.push(textMessageTwo); 
    await userTwo.save()
    return 
}
exports.readMessages = async (userId , conversationId) => {
    const userOne = await User.findById(userId);
    let conversation = userOne.mesages.find(x => x._id == conversationId);
    conversation.mesages = conversation.mesages.map(x => ({...x , read : true}));
    userOne.save();
}
exports.getUserData = async (userId) => {
    let user  = await User.findById(userId);
    let data = {mesages : [...user.mesages] , books : [...user.books]}
    return data
}