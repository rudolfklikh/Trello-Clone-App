import { Request, Response, NextFunction } from "express";
import { ExpressRequest } from "../types/express-request.interface";
import BoardModel from "../models/board";
import ColumnModel from '../models/column';
import { Server } from "socket.io";
import { Socket } from "../types/socket-request.interface";

export const getBoards = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userId: req.user.id });
    res.send(boards);
  } catch (error) {
    next(error as Error);
  }
};

export const createBoard = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id,
    });

    const savedBoard = await newBoard.save();

    res.send(savedBoard);
  } catch (error) {
    next(error as Error);
  }
};

export const getBoard = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const board = await BoardModel.findOne({ _id: req.params.boardId });
    res.send(board);
  } catch (error) {
    next(error as Error);
  }
};

export const joinBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  console.log("server socket to join", socket.user);
  socket.join(data.boardId);
};

export const leaveBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  console.log("server socket to leave", socket.user);
  socket.leave(data.boardId);
};
