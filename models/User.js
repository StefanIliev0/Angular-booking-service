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
            type : String,
            require : true
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