import { Document, Schema } from "mongoose";

export interface Task {
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId; // ID inside mongoose
    columnId: Schema.Types.ObjectId; // ID inside mongoose
}

export interface TaskDocument extends Task, Document {}