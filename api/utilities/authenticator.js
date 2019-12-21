const user = require('../models/user')
const User = new user();

/**
 * Middleware to check if user's login status or auth-token
 * @param req request object object
 * @param res response object object
 * @param next next middleware variable
 */
module.exports =  (req, res, next) => {

    // if in any of the following urls, session status will not be checked
    if(['/','/user/login','/user/register'].includes(req.url)){
        next();
    }
    else if(req.headers.hasOwnProperty('authorization')){
        User.authenticateToken(req, res, next);
    }
    else{
        res.status(401).send({
            status: "error",
            err_code: "UNAUTHORIZED",
            message: "User is not logged in"
        });
    }
};