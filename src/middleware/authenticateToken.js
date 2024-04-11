import jwt from 'jsonwebtoken';

// src/middleware/authenticateToken.js


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);

        // Adjust here to match the structure of your JWT payload
        req.user = { id: payload.userId, role: payload.role };
        next();
    });
}


export default authenticateToken;
