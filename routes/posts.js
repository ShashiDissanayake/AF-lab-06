const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

// ================= MULTER CONFIG =================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// ================= DATA =================
let posts = [];

// ================= CREATE (Protected + Image) =================
router.post('/', auth, upload.single('image'), (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
    }

    const newPost = {
        id: Date.now(),
        title,
        content,
        image: req.file ? req.file.filename : null,
        user: req.user.username
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

// ================= READ all (Public + Pagination) =================
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPosts = posts.slice(startIndex, endIndex);

    res.json({
        page,
        limit,
        totalPosts: posts.length,
        totalPages: Math.ceil(posts.length / limit),
        data: paginatedPosts
    });
});

// ================= READ single (Public) =================
router.get('/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
});

// ================= UPDATE (Protected + Optional Image) =================
router.put('/:id', auth, upload.single('image'), (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    if (req.file) {
        post.image = req.file.filename;
    }

    res.json(post);
});

// ================= DELETE (Protected) =================
router.delete('/:id', auth, (req, res) => {
    const index = posts.findIndex(p => p.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    posts.splice(index, 1);
    res.json({ message: "Post deleted" });
});

module.exports = router;