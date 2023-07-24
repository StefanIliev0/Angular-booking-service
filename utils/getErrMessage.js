const getErrMessage = (err) => {

    switch(err.name){
        case `Error` :
            return err.message ; 
        case `ValidationError` : 
            return getFurstErrMessage(err) ;
        default : 
            return err.message ; 
    }
}

function getFurstErrMessage(err){
    const error = Object.values(err.errors)[0].message ;
    return error
}; 

module.exports = getErrMessage ; 