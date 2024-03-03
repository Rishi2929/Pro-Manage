import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { createUpdateTask, deleteTodo, getAnalytics, getTodoById, getTodos, statusAndIsCompletedUpdate } from '../controllers/todo.js';

const router = express.Router();

//with middleware
router.post('/todo', isAuthenticated, createUpdateTask);
router.get('/get-todos', isAuthenticated, getTodos);
router.get('/get-analytics', isAuthenticated, getAnalytics);
router.delete('/delete-todo/:id', isAuthenticated, deleteTodo);
// router.post('/updateTodo', verifyJwt, updateTodo);
router.post('/status-isCompleted-update', isAuthenticated, statusAndIsCompletedUpdate);

//without middleware, for world wide users
router.get('/todo/:id', getTodoById);

export default router;