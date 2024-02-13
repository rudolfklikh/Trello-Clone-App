import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { createServer } from 'http';
import { Server } from 'socket.io';

import authMiddleware from './middlewares/auth';
import jwt from 'jsonwebtoken';
import User from './models/user';

import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import * as columnsController from './controllers/columns';
import * as tasksController from './controllers/tasks';

import { SocketEvents } from './enums/socket-events.enum';
import { secret } from './config';
import { Socket } from './types/socket-request.interface';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('toJSON', {
    virtuals: true,
    transform: (_, converted) => {
        delete converted._id;
    },
});

app.get('/', (req, res) =>  {
    res.send('API is UP');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard);
app.post('/api/boards', authMiddleware, boardsController.createBoard);

app.get('/api/boards/:boardId/columns', authMiddleware, columnsController.getColumns);

app.get('/api/boards/:columnId/tasks', authMiddleware, tasksController.getTasks)

io.use(async (socket: Socket, next) => {
    try {
        const token = (socket.handshake.auth.token as string) ?? '';
        const data = jwt.verify(token, secret) as { id: string; email: string};
        const user = await User.findById(data.id);

        if (!user) {
            return next(new Error('Authentication error'));
        }

        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
}).on('connection', (socket) => {
    socket.on(SocketEvents.BOARDS_JOIN, (data) => {
        boardsController.joinBoard(io, socket, data);
    });

    socket.on(SocketEvents.BOARDS_LEAVE, (data) => {
        boardsController.leaveBoard(io, socket, data);
    });

    socket.on(SocketEvents.COLUMNS_CREATE, (data) => {
        columnsController.createColumn(io, socket, data);
    });

    
    socket.on(SocketEvents.COLUMNS_UPDATE, (data) => {
        columnsController.updateColumns(io, socket, data);
    });

    socket.on(SocketEvents.TASK_CREATE, (data) => {
        tasksController.createTask(io, socket, data);
    })

    socket.on(SocketEvents.TASKS_UPDATE, (data) => {
        tasksController.updateTasks(io, socket, data);
    })
});


mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    console.log('connected to mongodb');

    httpServer.listen(4001, () => {
        console.log(`API is listening on port ${4001}`);
    });
});
