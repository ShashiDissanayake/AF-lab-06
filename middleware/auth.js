const jwt = require('jsonwebtoken');

const SECRET = "mysecretkey";

function auth(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Access Denied - No Token" });
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
}

module.exports = auth;