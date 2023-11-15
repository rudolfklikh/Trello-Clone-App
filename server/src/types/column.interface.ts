import { Document, Schema } from "mongoose";

export interface Column {
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId; // ID inside mongoose
    boardId: Schema.Types.ObjectId; // ID inside mongoose
}

export interface ColumnDocument extends Column, Document {}