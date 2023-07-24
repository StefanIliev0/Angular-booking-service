const Place = require(`../models/Place`)


exports.getColection = async (criteria, page, location, price) => {
    let colection = [];
    let curPrice = {}; 
    let colectionLength = 0; 

    
    if(price && price.split("-").length == 2){
        curPrice = { $lte : Number(price.split("-")[1]) ,  $gte : Number(price.split("-")[0])};
    }else if(price && price.split(` `)[2] == "400" ){
        curPrice = { $gte : Number(price.split(` `)[2])};

    }else if(price && price.split(` `)[2] == "100" ){
        curPrice = { $lte : Number(price.split(` `)[2])};
    }
    
if(!!price && !!location ){
        colection = await Place.find({...criteria ,location, price : curPrice}).limit(6).skip((page * 6)).populate(`owner`).lean();
        colectionLength = (await Place.find({...criteria ,location, price : curPrice})).length
}else if(!!location){
     colection = await Place.find({...criteria , location}).limit(6).skip((page * 6)).populate(`owner`).lean();
     colectionLength =(await Place.find({...criteria , location})).length;
}else if(!!price){
     colection = await Place.find({...criteria , price : curPrice}).limit(6).skip((page * 6)).populate(`owner`).lean();
     colectionLength = (await Place.find({...criteria , price : curPrice})).length;
}else{
     colection = await Place.find(criteria).limit(6).skip((page * 6)).populate(`owner`).lean();
     colectionLength = (await Place.find(criteria)).length;
}
if(colection.length > 0){
    colection = colection.map(a => ({ image : a.images[0] || '' , title : a.title ,  location : a.location , owner : a.owner.username , price : a.price , _id : a._id.toString()})); 
}
 return {colection,colectionLength}
} 

exports.addPlace = async ( place ) => {
    let newPlace = await Place.create(place);
    return newPlace; 
}
exports.getPlace = async ( placeId ) => {
    let place = await Place.findById(placeId).populate("owner").lean();
    return place; 
}
exports.addComment = async ( placeId , comment ) => {
    let place = await Place.findById(placeId);
    place.comments.push(comment);
    await place.save();
    return place; 
}
exports.addBook = async ( placeId , book ) => {
    let place = await Place.findById(placeId);
    place.books.push(book);
    await place.save();
    return place; 
}
exports.addRate = async ( placeId , rate ) => {
    let place = await Place.findById(placeId);
    place.rating.push(rate);
    await place.save();
    return place; 
}
exports.updatePlace = async ( placeId , newData ) => {
    let place = await Place.findByIdAndUpdate(placeId , newData);
    return place; 
}
exports.removePlace = async ( placeId  ) => {
    let place = await Place.findByIdAndDelete(placeId).lean();
    return place; 
}
