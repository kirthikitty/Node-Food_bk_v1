const jwt = require('jsonwebtoken');
function verifyToken(req,res,next){
    const token = req.header('Authorization');
    if (!token)  // If the token is not found "access is denied"
        return res.status(401).json({error: 'Access denied'});
    try{    // Verifying the key of the user
        const decoded = jwt.verify(token, '20');
        req.userId = decoded.userId;
        next();
    }catch (error){
        res.status(401).json({error: 'Invalid Token'});
    }
}
module.exports = verifyToken;
