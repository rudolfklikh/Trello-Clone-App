import { Document, Schema } from "mongoose";

export interface Board {
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: Schema.Types.ObjectId; // ID inside mongoose
}

export interface BoardDocument extends Board, Document {}