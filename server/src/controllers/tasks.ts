import { Response, NextFunction } from "express";
import { ExpressRequest } from "../types/express-request.interface";
import TaskModel from '../models/task';
import { Server } from "socket.io";
import { Socket } from "../types/socket-request.interface";
import { SocketEvents } from "../enums/socket-events.enum";
import { getErrorMessage } from "../helpers/helper";

export const getTasks = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const tasks = await TaskModel.find({ columnId: req.params.columnId });

    if (!tasks) {
      return res.sendStatus(404);
    }

    res.send(tasks);

  } catch (error) {
    next(error as Error);
  }
};

export const createTask = async (
  io: Server,
  socket: Socket,
  data: { title: string, columnId: string, boardId: string }
) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEvents.TASK_CREATE_FAILURE, 'User is not authorized');
            return;
        }

        const newTask = new TaskModel({
            title: data.title,
            columnId: data.columnId,
            userId: socket.user.id,
        });

        const savedTask = await newTask.save();

        io.to(data.boardId).emit(SocketEvents.TASK_CREATE_SUCCESS, savedTask);

    } catch (error) {
        socket.emit(SocketEvents.TASK_CREATE_FAILURE, getErrorMessage(error));
    }
};
