import { Request, Response, NextFunction } from "express";
import { ExpressRequest } from "../types/express-request.interface";
import BoardModel from "../models/board";

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
      userId: req.user.id
    });

    const savedBoard = await newBoard.save();

    res.send(savedBoard);
  } catch (error) {
    next(error as Error);
  }
};
