const db = require('../models')
const User = db.users;
const Message = db.messages;

const UserController = {
    // create and save new users 
    createUser: async (req, res) => {
        try {
            const { name, password } = req.body;
            const newUser = await User.create({ name, password });
            return res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error'})
        }
    },

    // create and save a message
    createMessage: async (req, res) => {
        try {
            const {senderId, receiverId, messageText } = req.body;
            const newMessage = await Message.create({ senderId, receiverId, messageText });
            res.status(201).json(newMessage);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error'})
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
    }
}

module.exports = UserController;
