const dotenv = require('dotenv').config();
const path = require('path');
const port = process.env.APP_PORT || 3005;
const mongoose = require('./database');
const bodyParser = require('body-parser');
const router = require('./router');
const { engine } = require('express-handlebars')
const socketListener = require('./socket');

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer, { cors: { origin: '*' }, allowEIO3: true });
const { message } = require('./socket');

// LISTEN ON SOCKET SERVER
io.on('connection', (socket) => {
    message(socket, io);
});

// SETUP DB
mongoose.connect();

// BRING IN BODYPARSER
app.use(bodyParser.urlencoded({ extended: false }));

// DEFINE TEMPLATING ENGINE
app.engine('.hbs', engine({ extname: '.hbs', layoutsDir: path.join(__dirname, '/views/layouts') }));
app.set('view engine', 'hbs');
app.set('views', './views');

// ROUTE REQUESTS
app.use(router);

// POINT PUBLIC DIRECTORY
app.use(express.static(path.join(__dirname, 'public')));

// START SERVERT
httpServer.listen(port, () => {
    console.log(`🚀 Server is up and running on port ${port}!`);
});
