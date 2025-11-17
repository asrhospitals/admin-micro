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


const verifyToken = (req, res, next) => {
    // 1. Check for token in the Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn('Authentication attempt failed: Invalid or missing Authorization header.');
        return res.status(401).json({
            message: "Access Denied. Bearer token is required.",
            error: "UNAUTHORIZED_NO_TOKEN"
        });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    // 2. Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(403).json({
                message: "Invalid or expired token. Access Forbidden.",
                error: "FORBIDDEN_INVALID_TOKEN"
            });
        }

        // 3. Token is valid. Attach decoded payload to request.
        // Example payload: { userid, role, roleType, iat, exp }
        req.user = decoded;

        next();
    });
};

module.exports = verifyToken;

