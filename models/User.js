const mongoose = require(`mongoose`) ; 


const userShema = new mongoose.Schema({
    username : {
        type : String , 
        require : true , 
    } ,
    password : {
        type : String , 
        require : true , 
    },
    accessToken : {
        type : String 
    },
    nickname : {
        type : String
    },
    places : [{
            type : mongoose.Types.ObjectId ,
            ref : "Place"
    }],
    books : [{
        from : {
            type : String,
            require : true
        },
        to :  {
            type : String,
            require : true
        },
        place : {
            type : mongoose.Types.ObjectId ,
            ref : "Place"
    }
    }],
    profilePicture : {
        type : String
    },
    about : {
        type : String
    },
    mesages : [{
            participants :[{
            type : String
            }],
            mesages : [{
                username : {
                    type :String
                },
                mesage : {
                    type : String
                }
            }]
        }]
  
})

const User = mongoose.model(`User` , userShema) ; 

module.exports = User;