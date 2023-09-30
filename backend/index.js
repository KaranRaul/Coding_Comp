const express = require('express');
const mongoose = require('mongoose');
const connectToMongo = require('./db');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const PORT = 2121;
const cors = require('cors');
connectToMongo();

app.use(cors());
app.use(express.json());
// app.use(io, require('./routes/routes.js'))
app.use('/api', require('./routes/routes.js'));
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
server.listen(PORT, () => {
    console.log('APP IS LISTNING ON PORT ' + PORT);

})

