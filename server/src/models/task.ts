import { Schema, model } from "mongoose";
import { TaskDocument } from "../types/task.interface";

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    columnId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    orderNumber: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export default model<TaskDocument>("Task", taskSchema);
