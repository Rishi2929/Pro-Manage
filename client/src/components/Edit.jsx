import React, { useContext, useEffect, useState } from "react";

import blueDotImg from '../assets/blueDot.png';
import greenDotImg from '../assets/greenDot.png';
import pinkDotImg from '../assets/pinkDot.png';
import BgBlack from "../common-components/BgBlack";
import CloseOnClick from "../common-components/CloseOnClick";
import styles from '../styles/CreateEditTodo.module.scss';
import AllTodosContextProvider from "../context/allTodosData/AllTodosContextProvider";
import AllTodosContext from "../context/allTodosData/AllTodosContext";


import { GoPlus } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import Moment from 'moment-timezone';
import moment from 'moment';
import { server } from "../main";
import axios from "axios";
import CustomLoader from "../common-components/CustomLoader";


const CreateTodoHeader = ({ handleChange, titleText, value }) => {
    return (
        <div className={styles.createHeader}>
            <div className={styles.headingStarContainer}>
                <h2>{titleText}</h2>
                <span className={styles.star}>*</span>
            </div>
            <input
                name="title"
                type="text"
                placeholder="Enter Task Title"
                value={value}
                onChange={(e) => handleChange(e)}
            />
        </div>
    );
};

const PriorityButton = ({ handlePriority, priorityType, title, imgSrc, todo }) => {
    return (
        <button onClick={() => handlePriority(priorityType)} style={{ background: todo.priority === priorityType ? "#EEECEC" : "" }}>
            <img src={imgSrc} alt="Pink" />
            <h4>{title}</h4>
        </button>
    );
};

const TaskField = ({ handleChange, isCompleted, description, handleDeleteTask, keyId, task }) => {
    return (
        <div className={styles.task} key={keyId}>
            <div className={styles.checkboxInputWrapper}>
                <input
                    name="isCompleted"
                    type="checkbox"
                    checked={isCompleted}
                    className={styles.checkbox}
                    onChange={(e) => handleChange(e, task._id)}
                />
                <input
                    name="description"
                    type="text"
                    placeholder="Task to be done"
                    className={styles.taskInput}
                    value={description}
                    onChange={(e) => handleChange(e, task._id)}
                />
            </div>
            <button className={styles.dltBtn} onClick={() => handleDeleteTask(task._id)}>
                <MdDelete />
            </button>
        </div>
    );
};


const Edit = ({ handleClose, todoId }) => {
    const [isCalendarShowing, setIsCalendarShowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [checklistCompletedText, setChecklistCompletedText] = useState("");

    const [todo, setTodo] = useState({
        status: "TODO",
        checklist: [],
        priority: "",
        dueDate: "",
        title: ""
    });

    const { allTodos, setAllTodos } = useContext(AllTodosContext);

    useEffect(() => {
        if (todo?.checklist?.length) {
            const isCompletedTrueTodos = todo?.checklist?.filter(task => task?.isCompleted);
            const isCompletedTrueTodosLength = isCompletedTrueTodos?.length;
            setChecklistCompletedText(`${isCompletedTrueTodosLength}/${todo?.checklist?.length}`);
        } else {
            setChecklistCompletedText('0/0');
        }
    }, [todo?.checklist]);

    useEffect(() => {
        if (todoId)
            getCurrentTodo(todoId);
    }, []);

    const getCurrentTodo = async (todoId) => {
        try {
            setIsLoading(true);
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.get(`${server}/todo/todo/${todoId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            toast.success(response?.data?.message);
            setTodo(response?.data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getFormattedDate = (date) => {
        // console.log("date: ", date);
        const formattedDate = moment(date).format("DD/MM/YYYY");
        return formattedDate;
    };

    const handlePriority = (priorityType) => {
        todo.priority != priorityType && setTodo({ ...todo, priority: priorityType });
    };

    console.log("create todo: ", todo);

    const handleSubmit = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post(`${server}/todo/saveTodo`, todo,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            toast.success(response?.data?.message);
            const currentTodo = allTodos?.find(_todo => _todo?._id === todo?._id);
            setAllTodos([...allTodos?.map(_todo => _todo?._id === currentTodo?._id ? todo : _todo)]);
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message);
        }
    };



    const handleCalendarDate = (date) => {
        const todayDate = new Date();
        if (date >= todayDate)
            todo.dueDate = date.toUTCString();

        setIsCalendarShowing(false);
    };

    const handleChange = (event, task_id) => {
        let name = event.target.name;
        let value = event.target.value;
        if (name == "title") {
            setTodo({ ...todo, title: value });
        }
        else if (name == "isCompleted") {
            setTodo({ ...todo, checklist: todo.checklist?.map(task => task._id === task_id ? { ...task, isCompleted: !task?.isCompleted } : task) });
        }
        else if (name == "description") {
            setTodo({ ...todo, checklist: todo.checklist?.map(task => task._id === task_id ? { ...task, description: value } : task) });
        }
    };

    const handlePlusTask = () => {
        let taskObj = { _id: uuid(), description: "", isCompleted: false };

        setTodo({ ...todo, checklist: [...todo.checklist, taskObj] });
    };

    const handleDeleteTask = (task_id) => {
        setTodo({ ...todo, checklist: todo.checklist?.filter(task => task?._id != task_id) });
    };


    return (
        <BgBlack>
            {isLoading ? <CustomLoader isLoading={isLoading} /> :
                <div className={styles.createContainer}>
                    <>
                        <CreateTodoHeader
                            value={todo.title}
                            titleText="Title"
                            handleChange={(e) => handleChange(e)}
                        />

                        <div className={styles.priorityBody}>
                            <div className={styles.headingStarContainer}>
                                <h2>Select Priority</h2>
                                <span className={styles.star}>*</span>
                            </div>
                            <PriorityButton
                                priorityType="high"
                                title="HIGH PRIORITY"
                                imgSrc={pinkDotImg}
                                handlePriority={handlePriority}
                                todo={todo}
                            />
                            <PriorityButton
                                priorityType="moderate"
                                title="MODERATE PRIORITY"
                                imgSrc={blueDotImg}
                                handlePriority={handlePriority}
                                todo={todo}
                            />
                            <PriorityButton
                                priorityType="low"
                                title="LOW PRIORITY"
                                imgSrc={greenDotImg}
                                handlePriority={handlePriority}
                                todo={todo}
                            />
                        </div>

                        <div className={styles.checklistWrapper}>
                            <div className={styles.tasksWrapper}>
                                <div className={styles.headingStarContainer}>
                                    <h2>Checklist ({checklistCompletedText ? (checklistCompletedText) : 0 / 0})</h2>
                                    <span className={styles.star}>*</span>
                                </div>
                                <div className={styles.tasks}>
                                    {todo.checklist?.map((task, index) => {
                                        return (
                                            <TaskField
                                                isCompleted={task?.isCompleted}
                                                description={task?.description}
                                                handleChange={handleChange}
                                                handleDeleteTask={handleDeleteTask}
                                                keyId={index}
                                                task={task}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <button className={styles.plusIconTask} onClick={() => handlePlusTask()}>
                                <GoPlus />
                                <h3> Add New</h3>
                            </button>
                        </div>

                        <div className={styles.endContainer}>
                            <button className={styles.date} onClick={() => setIsCalendarShowing(true)}>
                                {todo.dueDate ? getFormattedDate(todo?.dueDate) : "Select Due Date"}
                            </button>
                            <div className={styles.actionContainer}>
                                <button className={styles.cancelBtn} onClick={handleClose}>Cancel</button>
                                <button className={styles.saveBtn} onClick={() => handleSubmit()}>Save</button>
                            </div>
                        </div>

                        {isCalendarShowing &&
                            // <BgBlack>
                            <CloseOnClick onClose={() => setIsCalendarShowing(false)}>
                                <div className={styles.calenderContainer}>
                                    <Calendar
                                        onChange={(date) => handleCalendarDate(date)}
                                        value={todo.dueDate}
                                    />
                                </div>
                            </CloseOnClick>
                            // </BgBlack>
                        }
                    </>
                </div>
            }
        </BgBlack>
    );
};

export default Edit;