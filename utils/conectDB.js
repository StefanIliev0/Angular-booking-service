const mongoose = require(`mongoose`) ; 


async function connectDB() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/booking') ; 

    console.log(`DB is connected`) ;
}

module.exports = connectDB ;  