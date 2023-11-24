const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const { validateMessage } = require('../models/messages')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/users.controller')

// constant secret key (base64-encoded)
const secretKey = '4f04HmehhvhwUTFMbTvh+HFMMrseT/zwR35H6sUt9iUpe+RKU2yN/JzR93k4HRQf+';

// auth middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

// login
router.post('/login', UserController.loginUser);

// create a new user
router.post('/users', UserController.createUser);

// create a new message
router.post('/messages', authenticateToken ,UserController.createMessage);

// get all users
router.get('/users', UserController.getUsers);

// get all messages
router.get('/messages', authenticateToken ,UserController.getMessages);

module.exports = { authenticateToken, router, secretKey};
