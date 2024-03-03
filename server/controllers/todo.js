import {Todo} from '../models/todo.js'
import mongoose from "mongoose";
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

        delete body?._id;
        body?.checklist?.forEach(task => {
            task._id = new objId();
        });

        body.userId = userId;

        const todo = await Todo(body).save();

        res.status(200).json({ success: true, message: "Data saved successfully", data: todo });
    } catch (error) {
        console.log("createTask: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const getTodos = async (req, res) => {
    try {
        // console.log("sad")
        const { user } = req;

        // let userId = user?._id;

        const todo = await Todo.find({ userId: user._id }).lean();
        // console.log("todo: ", todo)

        res.status(200).json({ success: true, message: "All Todos fetched successfully for you", data: todo });
    } catch (error) {
        console.log("getTodos: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { body, params, user } = req;
        const id = params?.id;
        console.log(222222, body, params, user);
        if (id) {
            const response = await Todo.deleteOne({ _id: id });
            console.log("res: ", response);
            if (response) {
                res.status(200).json({ success: true, message: "Data Deleted successfully", data: response });
                return {};
            }
        }

        res.status(400).json({ success: false, message: "Deletion Failed" });
    } catch (error) {
        console.log("deleteTodo: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const getTodoById = async (req, res) => {
    try {
        const { body, params, user } = req;
        let id = params?.id;
        console.log("params: ", params);
        // id = JSON.parse(id);
        let todo = {};
        // if(user)
        todo = await Todo.findOne({ _id: id }).lean();
        // if(user === undefined)  //for users with the todo link
        //     todo = await Todo.findOne({ _id: id }).lean();


        // console.log("todo: ", todo)

        res.status(200).json({ success: true, message: "Todo fetched successfully for you", data: todo });
    } catch (error) {
        console.log("getTodos: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

// export const updateTodo = async (req, res) => {
//     try {
//         const { body, user } = req;
//         console.log("body: ", body);
//         if (!body.title) {
//             res.status(400).json({ success: false, message: "Title missing" });
//             return {};
//         } else if (!body.priority) {
//             res.status(400).json({ success: false, message: "Priority missing" });
//             return {};
//         } else if (!body.checklist || !body.checklist.length) {
//             res.status(400).json({ success: false, message: "Checklist missing" });
//             return {};
//         }

//         const objId = mongoose.Types.ObjectId;

//         body?.checklist?.forEach(task => {
//             task._id = new objId();
//         });

//         let todo = null;
//         if (body?._id)
//             todo = await Todo.updateOne({ _id: body?._id }, { $set: body }).lean();

//         res.status(200).json({ success: true, message: "Data updated successfully", data: todo });
//     } catch (error) {
//         console.log("updateTodo: ", error);
//         res.status(400).json({ success: false, message: "Something Went Wrong" });
//     }
// };

export const statusAndIsCompletedUpdate = async (req, res) => {
    try {
        let { body, user } = req;

        console.log("body: ", body);

        let dataObj = {};

        let todo = null;
        todo = await Todo.findOne({ _id: body._id }).lean();

        if (body.status) {
            dataObj.status = body.status;
            todo.status = body.status;
        }
        if (body.taskId) {
            dataObj.isCompleted = body.isCompleted;
        }

        console.log("todo: ", todo, "dataObj: ", dataObj);

        if (body?._id && body?.taskId) {
            todo = await Todo.updateOne({ _id: body._id, "checklist._id": body.taskId }, { $set: { "checklist.$.isCompleted": dataObj.isCompleted } });
        } else if (body?._id && body?.status) {
            todo = await Todo.updateMany({ _id: body._id }, { $set: todo });
        }

        let message = "";
        if (todo) message = body.status ? "status" : "isCompleted";

        res.status(200).json({ success: true, message: `${message} updated successfully`, data: todo });
    } catch (error) {
        console.log("updateStatusAndIsCompleted: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        // console.log("sad")
        const { user } = req;
        let todo = null;
        
        if(user)
            todo = await Todo.find({ userId: user._id }, { checklist: 0 }).lean();
        // console.log("todo: ", todo)

        res.status(200).json({ success: true, message: "All Todos fetched successfully for you", data: todo });
    } catch (error) {
        console.log("getTodos: ", error);
        res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
};
