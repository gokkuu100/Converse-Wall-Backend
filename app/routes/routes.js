const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/users.controller')

// create a new user
router.post('/users', UserController.createUser)

// create a new message
router.post('/messages', UserController.createMessage);

// get all users
router.get('/users', UserController.getUsers);

// get all messages
router.get('/messages', UserController.getMessages);

module.exports = router;