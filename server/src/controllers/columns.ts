import { Response, NextFunction } from "express";
import { ExpressRequest } from "../types/express-request.interface";
import ColumnModel from "../models/column";
import { Server } from "socket.io";
import { Socket } from "../types/socket-request.interface";
import { SocketEvents } from "../enums/socket-events.enum";
import { getErrorMessage } from "../helpers/helper";
import { ColumnDocument } from "../types/column.interface";

export const getColumns = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const columns = await ColumnModel.find({ boardId: req.params.boardId });

    if (!columns) {
      return res.sendStatus(404);
    }

    res.send(columns);
  } catch (error) {
    next(error as Error);
  }
};

export const createColumn = async (
  io: Server,
  socket: Socket,
  data: { title: string; boardId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEvents.COLUMNS_CREATE_FAILURE,
        "User is not authorized"
      );
      return;
    }

    const columnsLength = (await ColumnModel.find({ boardId: data.boardId }))
      .length;

    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id,
      orderNumber: columnsLength,
    });

    const savedColumn = await newColumn.save();
    io.to(data.boardId).emit(SocketEvents.COLUMNS_CREATE_SUCCESS, savedColumn);
  } catch (error) {
    socket.emit(SocketEvents.COLUMNS_CREATE_FAILURE, getErrorMessage(error));
  }
};

export const updateColumns = async (
  io: Server,
  socket: Socket,
  data: { id: string; boardId: string; title: string; orderNumber: number }[]
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEvents.COLUMNS_UPDATE_FAILURE,
        "User is not authorized"
      );
      return;
    }
    const returnedArr: ColumnDocument[] = [];


    for (let index = 0; index < data.length; index++) {
      const column = data[index];
      const doc = await ColumnModel.findByIdAndUpdate(column.id, { orderNumber: column.orderNumber },
        {
          new: true,
        }
      );
      returnedArr.push(doc as ColumnDocument);
    }

    io.to(data[0].boardId).emit(SocketEvents.COLUMNS_UPDATE_SUCCESS, returnedArr);
  } catch (error) {
    socket.emit(SocketEvents.COLUMNS_UPDATE_FAILURE, getErrorMessage(error));
  }
};
