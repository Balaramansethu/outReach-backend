require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ENV } = require('././utils/env');
const connectToDatabase = require('./database/connection');
const authRoute = require('./routes/authRoute.js');

const app = express();

app.use(cors({
    origin: ENV.CORS_ORIGIN_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Server is running successfully');
});

app.use('/api/v1/auth', authRoute);

connectToDatabase()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(error => {
        console.log(`Error while connecting to database: ${error}`);
    });

const port = ENV.PORT || 3000;
app.listen(port, () => {
    console.log(`🟢 Server running at http://localhost:${port}`);
});

module.exports = app;
