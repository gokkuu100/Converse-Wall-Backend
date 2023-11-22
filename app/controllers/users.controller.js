const db = require('../models');
const { validationResult, check } = require('express-validator');
const { secretKey } = require('../routes')

const User = db.users;
const Message = db.messages;

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
            const user = await User.findOne({ where: { name }});
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ name: user.name, id: user.id }, secretKey);
            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" })
        }
        
    },

    // create and save a message
    createMessage: async (req, res) => {
        // check for validation errors
        try {
            await Promise.all([
                check('messageText').notEmpty().withMessage("Message Text is required").run(req),
                check('senderId').notEmpty().withMessage("SenderId is required").run(req),
                check('receiverId').optional().run(req)
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
    }
}

module.exports = UserController;
