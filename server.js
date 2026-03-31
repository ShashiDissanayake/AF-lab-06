const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// ================= CONFIG =================
const SECRET = "mysecretkey";
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================

// JSON parse middleware
app.use(express.json());

// CORS middleware
app.use(cors());

// 👉 Serve uploaded images (IMPORTANT 🔥)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Logger middleware 
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ================= ROUTES =================

// import routes
const postRoutes = require('./routes/posts');

// base route
app.get('/', (req, res) => {
    res.send("Server is running 🚀");
});

// example EJS route (test)
app.get('/home', (req, res) => {
    res.render('home', { name: "Kasun" });
});

// ================= AUTH ROUTE =================

// LOGIN → token generate
app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username required" });
    }

    const user = {
        id: 1,
        username
    };

    const token = jwt.sign(user, SECRET, { expiresIn: '1h' });

    res.json({
        message: "Login successful",
        token
    });
});

// ================= PROTECTED ROUTES =================

app.use('/posts', postRoutes);

// ================= ERROR HANDLING =================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

// ================= SERVER =================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});