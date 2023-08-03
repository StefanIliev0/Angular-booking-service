
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