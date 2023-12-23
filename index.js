const express = require('express');
const cors = require('cors');
const http = require('http');  // Import http module
const socketIO = require('socket.io');
const router = require('./app/routes/routes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());

const db = require('./app/models');
db.sequelize.sync().then(() => {
    console.log("Database synced successfully");
});

app.use(bodyParser.json({ limit: "5mb"}));
app.use(express.json({ limit: "5mb"}));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router.router);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

const server = http.createServer(app); 

// Use server instance for Socket.IO
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8,
});

const connectedUsers = {}; 
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (senderId) => {
        connectedUsers[senderId] = socket.id;
        socket.join(senderId); // Join a room with the user's ID
    });

    socket.on('send_message', (data) => {
        const { senderId, receiverId, message, type } = data;
        
        // Send the message to the receiver's room
        io.to(connectedUsers[receiverId]).emit('receive_message', {
            senderId,
            message,
            type: "received"
        });

        // broadcast messages to sender's room
        io.to(connectedUsers[senderId]).emit('receive_message', {
            senderId,
            message,
            type,
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove user from the connected users list on disconnect
        const userId = Object.keys(connectedUsers).find(
            (key) => connectedUsers[key] === socket.id
        );
        if (userId) {
            delete connectedUsers[userId];
        }
    });
});

const PORT = process.env.PORT || 8080;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
