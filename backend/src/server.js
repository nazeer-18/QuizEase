require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const http = require('http');
const https = require('https');
const allowedOrigins = ['http://localhost:3000']
app.use(cors())
const { URL } = require('url');
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json())
const keepAlive = () => {
    const url = new URL(process.env.SERVER_URL);
    const protocol = url.protocol === 'https:' ? https : http;
    protocol.get(process.env.SERVER_URL);
};

setInterval(keepAlive, 180000);

const server = http.createServer(app);
const connectDB = require('./db');
connectDB.then(() => {
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.log('Error connecting to MongoDB:', err.message);
});

const quizRoute = require('./routes/quizRoute')
app.use('/api/quizRoute', quizRoute)

const questionRoute = require('./routes/questionRoute')
app.use('/api/questionRoute', questionRoute)

const authRoute = require('./routes/authRoute')
app.use('/api/authRoute', authRoute)

const leaderboardRoute = require('./routes/leaderboardRoute')
app.use('/api/leaderboardRoute',leaderboardRoute)