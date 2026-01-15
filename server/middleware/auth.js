const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // FORMAT: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            return res.sendStatus(403);
        }
        console.log("User authenticated:", user.username, "ID:", user.id);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
