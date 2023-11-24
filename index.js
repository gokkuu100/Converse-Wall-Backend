const express = require('express');
const cors = require('cors');
const router = require('./app/routes/routes')
const bodyParser = require('body-parser');


const app = express()
app.use(cors())

const db = require('./app/models');
const controller = require('./app/controllers/users.controller');

db.sequelize.sync().then(() => {
    console.log("Database synced successfully");
});

db.sequelize.sync();

app.use(bodyParser.json())

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



