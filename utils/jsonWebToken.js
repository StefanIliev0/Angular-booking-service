const util = require(`util`) ; 
const jsonwebtoken = require(`jsonwebtoken`) ; 


exports.jwt = {
        sign: util.promisify(jsonwebtoken.sign),
        verify: util.promisify(jsonwebtoken.verify),
    };
    