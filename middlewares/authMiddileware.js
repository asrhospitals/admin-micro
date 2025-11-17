const jwt=require("jsonwebtoken");


// The name of the environment variable holding your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Middleware to verify the JWT token and attach user data to the request.
 * The decoded token payload (e.g., { userid, role, roleType, ... }) is stored in req.user.
 * * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */


const verifyToken=(req,res,next)=>{

    let token;
    let authHeader=req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];
        

        if(!token){
            return res.status(401).json({message:"No Token, authoraization denide"})
        }

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decode;
            console.log("The decoded user is :",req.user);
            next();

        }catch(err){
            res.status(400).json({message:"Token is not valid"})
        }
    }else{
        return res.status(401).json({message:"No Token, authoraization denide"})
    }
}

module.exports = verifyToken;

