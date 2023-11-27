const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const router = require('./app/routes/routes')
const bodyParser = require('body-parser');
require('dotenv').config();



const app = express()
app.use(cors())

const db = require('./app/models');
db.sequelize.sync().then(() => {
    console.log("Database synced successfully");
});
db.sequelize.sync();

app.use(bodyParser.json())

const server = http.createServer(app) // creates http server instance
const io = socketIO(server); // attaches socket.io to the server

// parse request for content-type application/json
app.use(express.json())

// parse requests of content-type -application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/api', router.router);

// simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Socket.IO logiv
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast the message to all connected clients
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});




