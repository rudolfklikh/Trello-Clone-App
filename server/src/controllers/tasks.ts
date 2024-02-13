import { Response, NextFunction } from "express";
import { ExpressRequest } from "../types/express-request.interface";
import TaskModel from '../models/task';
import { Server } from "socket.io";
import { Socket } from "../types/socket-request.interface";
import { SocketEvents } from "../enums/socket-events.enum";
import { getErrorMessage } from "../helpers/helper";
import { Task, TaskDocument } from "../types/task.interface";

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

        const tasksLength = (await TaskModel.find({ columnId: data.columnId })).length;

        const newTask = new TaskModel({
            title: data.title,
            orderNumber: tasksLength,
            columnId: data.columnId,
            userId: socket.user.id,
        });

        const savedTask = await newTask.save();

        io.to(data.boardId).emit(SocketEvents.TASK_CREATE_SUCCESS, savedTask);

    } catch (error) {
        socket.emit(SocketEvents.TASK_CREATE_FAILURE, getErrorMessage(error));
    }
};

export const updateTasks = async (
  io: Server,
  socket: Socket,
  data: { tasks: { id: string, orderNumber: string }[], boardId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEvents.TASKS_UPDATE_FAILURE,
        "User is not authorized"
      );
      return;
    }
    const returnedArr: TaskDocument[] = [];


    for (let index = 0; index < data.tasks.length; index++) {
      const task = data.tasks[index];
      const doc = await TaskModel.findByIdAndUpdate(task.id, { orderNumber: task.orderNumber },
        {
          new: true,
        }
      );
      returnedArr.push(doc as TaskDocument);
    }

    console.log(returnedArr);

    io.to(data.boardId).emit(SocketEvents.TASKS_UPDATE_SUCCESS, returnedArr);
  } catch (error) {
    socket.emit(SocketEvents.TASKS_UPDATE_FAILURE, getErrorMessage(error));
  }
};
