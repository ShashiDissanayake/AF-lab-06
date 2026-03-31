const jwt = require('jsonwebtoken');

const SECRET = "mysecretkey";

function auth(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied - No Token" });
    }

    
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid Token Format" });
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
}

module.exports = auth;