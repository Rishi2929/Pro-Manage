import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String },
    isCompleted: { type: Boolean }
});

const schema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    priority: { type: String },
    dueDate: { type: String },
    checklist: [checklistSchema],
    status: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Todo = mongoose.model('todo', schema);