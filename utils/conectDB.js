const mongoose = require(`mongoose`) ; 


async function connectDB() {

    mongoose.set('strictQuery', false);
    await mongoose.connect("mongodb://localhost:27017/booking") ; 
    // await mongoose.connect("mongodb+srv://Stefan:Si123456789@earthbnb.9qzwznb.mongodb.net/?retryWrites=true&w=majority") ; 

    console.log(`DB is connected`) ;
}
async function closeConnection () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
      });

}

module.exports = {connectDB , closeConnection} ;  
