const mongoose = require(`mongoose`) ; 


const PlaaceSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : [true ,`title is reqired` ] , 
    } , 
    description : {
        type : String ,
    } , 
    images : [{
        type : String 
    }], 
    location : {
        type : String ,
        require : true
    } , 
    owner : {
        type : mongoose.Types.ObjectId , 
        ref : `User`
    }, 
    rating : [{
        user : {
            type : mongoose.Types.ObjectId , 
            ref : `User`
        },
        rate : {
            type: Number,
            min : 1 ,
            max : 6
        }
    }],
    price : {
        type : Number , 
        require : true
    },
    comments : [{
        user : {
            userID :{
                type :String 
            },
            userNickname : {
                type : String
            }
        },
        comment : {
            type :String , 
            require : true
        }
    }],
    books : [{
        user : {
            type : mongoose.Types.ObjectId , 
            ref : `User`
        } ,
        from : {
            type : String 
        },
        to : {
            type : String
        }
    }],
    facilities : [
        {
            type : String
        }
    ],
    businesTravel : {
        type : Boolean ,
        require : true
    }
})

const Place = mongoose.model(`Place` , PlaaceSchema) ; 

module.exports = Place;