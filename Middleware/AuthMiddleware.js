const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        console.error('No token found');
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'key'); // Split token to get the actual token value
        req.userId = decoded.userId;
        console.log('Token verified:', decoded);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid Token' });
    }
}

module.exports = verifyToken;
