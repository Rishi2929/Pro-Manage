import { Todo } from '../models/todo.js';
import mongoose from "mongoose";
import moment from 'moment';
const objectId = mongoose.Types.ObjectId;

export const createUpdateTask = async (req, res) => {
    try {
        const { body, user } = req;
        const userId = user?._id;

        if (!body.title) {
            res.status(400).json({ success: false, message: "Title missing" });
            return {};
        } else if (!body.priority) {
            res.status(400).json({ success: false, message: "Priority missing" });
            return {};
        } else if (!body.checklist || !body.checklist.length) {
            res.status(400).json({ success: false, message: "Checklist missing" });
            return {};
        } else if (body?.checklist?.length) {
            let isMissing = false;
            body?.checklist?.forEach(task => {
                if (!task?.description) {
                    isMissing = true;
                }
            });
            if (isMissing) {
                res.status(400).json({ success: false, message: "Task Description missing" });
                return {};
            }
        }

        body?.checklist?.forEach(task => {
            task._id = new objectId();
        });

        body.userId = userId;
        let todo = {};

        if (body?._id) {     //edit todo
            todo = await Todo.updateOne({ _id: body._id }, { $set: body });
        } else {        // _id not exist means create todo
            todo = await Todo(body).save();
        }


        res.status(200).json({ success: true, message: "Data saved successfully", data: todo });
    } catch (error) {
        console.log("createTask: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const getTodos = async (req, res) => {
    try {
        const { user } = req;
        console.log("req.query: ", req.query);
        let query = { userId: user._id };

        let currentDate = new Date();

        switch (req?.query?.filter) {
            case 'thisWeek':
                query.createdAt = {
                    // $gte: moment().startOf('week').toDate(),
                    $gte: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
                    $lte: new Date()
                };
                break;
            case 'today':
                query.createdAt = {
                    $gte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000),
                    $lte: new Date()
                };
                break;
            case 'thisMonth':
                query.createdAt = {
                    $gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
                    $lte: new Date()
                };
                break;
            default:
                break;
        }
        
        console.log("getTodos query: ", query);

        const todo = await Todo.find(query).lean();

        res.status(200).json({ success: true, message: "Todos are fetched successfully", data: todo });
    } catch (error) {
        console.log("getTodos: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { body, params, user } = req;
        if (params?.id) {
            const response = await Todo.deleteOne({ _id: params?.id });
            if (response) {
                return res.status(200).json({ success: true, message: "Successfully Deleted", data: response });
            }
        }

        return res.status(400).json({ success: false, message: "Delete failed" });
    } catch (error) {
        console.log("deleteTodo: ", error);
        return res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const getTodoById = async (req, res) => {
    try {
        const { params } = req;
        let id = params?.id;
        let todo = {};
        todo = await Todo.findOne({ _id: id }).lean();
        res.status(200).json({ success: true, message: "Todo fetched successfully for you", data: todo });
    } catch (error) {
        console.log("getTodos: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const statusAndIsCompletedUpdate = async (req, res) => {
    try {
        const body = req.body;
        const todoId = body._id;

        const updateQuery = {};

        if (body.status) {
            updateQuery.status = body.status;
        }

        if (body.taskId && typeof body.isCompleted === 'boolean') {
            updateQuery['checklist.$[element].isCompleted'] = body.isCompleted;
        }

        let updateResult;

        if (Object.keys(updateQuery).length > 0) {
            if (body.taskId) {
                const options = { arrayFilters: [{ 'element._id': body.taskId }] };
                updateResult = await Todo.updateOne({ _id: todoId }, { $set: updateQuery }, options);
            } else {
                updateResult = await Todo.updateMany({ _id: todoId }, { $set: updateQuery });
            }
        }

        let message = "";
        if (updateResult) message = body.status ? "status" : "isCompleted";

        res.status(200).json({ success: true, message: `${message} successfully updated`, data: updateResult });
    } catch (error) {
        console.log("updateStatusAndIsCompleted: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};


export const getAnalytics = async (req, res) => {
    try {
        const { user } = req;
        let todo = null;

        if (user)
            todo = await Todo.find({ userId: user._id }, { checklist: 0 }).lean();

        res.status(200).json({ success: true, message: "Data successfully fetched", data: todo });
    } catch (error) {
        console.log("getTodos: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};
