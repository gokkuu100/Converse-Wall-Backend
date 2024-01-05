const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const { validateMessage } = require('../models/messages')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserController, upload} = require('../controllers/users.controller')


// secret key (base64-encoded)
const secretKey = process.env.JWT_SECRET_KEY;

// auth middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

router.post('/login', UserController.loginUser);
router.post('/users', UserController.createUser);
router.post('/messages', authenticateToken ,UserController.createMessage);
router.post('/upload', upload.single('image'), UserController.storeImages)

router.get('/users', UserController.getUsers);
router.get('/messages', authenticateToken ,UserController.getMessages);
router.get('/images', UserController.getImages);
router.get('/conversations/:receiverId', authenticateToken, UserController.getConversation)
router.get('/allconversations/:receiverId', authenticateToken, UserController.getAllconversation)



module.exports = { authenticateToken, router };
