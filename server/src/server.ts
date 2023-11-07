import express from 'express';
import mongoose from 'mongoose';

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


app.get('/', (req, res) =>  {
    res.send('API is UP');
});

io.on('connection', () => {
    console.log('Sockets connected');
});


mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    console.log('connected to mongodb');

    httpServer.listen(4001, () => {
        console.log(`API is listening on port ${4001}`);
    });
});
