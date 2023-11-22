const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const { validateMessage } = require('../models/messages')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/users.controller')

// constant secret key
const secretKey = '\xe0\xd8\x1f4\ng\xa5o\xe0h~\xf8qL2\xbb1\xe4\xcfo\xf0\xf4G_\xd9\xb1Q\x97)sF\xdas#\x7f';

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
router.post('/messages', UserController.createMessage);

// get all users
router.get('/users', UserController.getUsers);

// get all messages
router.get('/messages', UserController.getMessages);

module.exports = { authenticateToken, router, secretKey: secretKey};
