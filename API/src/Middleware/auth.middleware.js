const User = require("../Models/user.model.js");
const { ApiError } = require("../utils/apiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }catch(error){
            return res.status(401).json({error: "Not authorized token failed"})
        }
    }

    if(!token){
        return res.status(401).json({error: "Not authorized, no token"})
    }

});

module.exports = { verifyJWT };
