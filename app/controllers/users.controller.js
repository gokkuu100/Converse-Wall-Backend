const db = require('../models');
const { validationResult, check } = require('express-validator');
const { Op } = require('sequelize')
const multer = require("multer")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = db.users;
const Message = db.messages;
const Image = db.images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const UserController = {
    // create and save new users 
    createUser: async (req, res) => {        
        try {
            const { name, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await User.create({ name, password: hashedPassword });
            return res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error'})
        }
    },

    loginUser: async (req, res) => {
        try {
            const { name, password } = req.body;
            const user = await User.findOne({ where: { name } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const { id } = user
            const token = jwt.sign({ name: user.name, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.json({ name, id, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
        
    },

    // create and save a message
    createMessage: async (req, res) => {
        try {
            await Promise.all([
                check('messageText').notEmpty().withMessage("Message Text is required").run(req),
                check('senderId').notEmpty().withMessage("SenderId is required").run(req),
                check('receiverId').optional().run(req),
                // Add validation for image upload
            ]);
    
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0] });
            }
    
            const { senderId, receiverId, messageText } = req.body;
            const newMessage = await Message.create({ senderId, receiverId, messageText });
            res.status(201).json(newMessage);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    // get all users
    getUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    },

    // get all messages
    getMessages: async (req, res) => {
        try {
            const messages = await Message.findAll();
            res.status(200).json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    },

    // conversations
    getConversation: async (req, res) => {
        try {
            const { id } = req.user;
            const { receiverId } = req.params;

            const conversationsReceived = await Message.findAll({
                where: {
                    senderId: receiverId,
                    receiverId: id
                },
                order: [['createdAt', 'ASC']]
            });

            const conversationsSent = await Message.findAll({
                where: {
                    senderId: id,
                    receiverId: receiverId,
                },
                order: [['createdAt', 'ASC']]
            })
            const conversations = [...conversationsReceived, ...conversationsSent]
            res.status(200).json(conversations.map((msg) => ({
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                messageText: msg.messageText,
                type: msg.senderId === id ? 'sent' : 'received',
                createdAt: msg.createdAt,
            })));
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error"})
        }
    },

    storeImages: async function(req, res) {
        try {
          console.log('req.body:', req.body);
          console.log('req.file:', req.file);
      
          const { senderId, receiverId } = req.body;
          const imageData = req.file.buffer; // Access the image buffer from Multer
      
          // Save image information to the database
          const newImage = await Image.create({
            senderId,
            receiverId,
            image_data: imageData,
          });
      
          res.status(201).json(newImage);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
    
    
      // get images:
      getImages: async (req, res) => {
        try {
          const images = await Image.findAll({
            order: [['createdAt', 'ASC']],
          });
          res.status(200).json(images);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
}

module.exports = UserController;
