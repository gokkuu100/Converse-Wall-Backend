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

app.use(bodyParser.json());
app.use(express.json());
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
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8080;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
