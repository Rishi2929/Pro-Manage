import React, { useContext, useState } from "react";

import axios from "axios";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsThreeDots } from "react-icons/bs";
import { BiSolidChevronDownSquare } from "react-icons/bi";
import { BiSolidChevronUpSquare } from "react-icons/bi";
import toast from "react-hot-toast";
// import Moment from 'react-moment';
import "moment-timezone"

import styles from '../styles/Card.module.scss';

import Pink from '../assets/pinkDot.png';
import Green from '../assets/greenDot.png';
import Blue from '../assets/blueDot.png';
import DropUp from '../assets/dropUp.png';
import DropDown from '../assets/dropdown.png';
// import EditTodo from "../EditTodo/EditTodo";
import { server } from "../main";
import AllTodosContext from "../context/allTodosData/AllTodosContext";


const Card = ({ todo, openedChecklists, setOpenedChecklists }) => {
    const [smallModelOpen, setSmallModelOpen] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [openEditModel, setOpenEditModel] = useState(false);

    const { allTodos, setAllTodos } = useContext(AllTodosContext);

    console.log("allTodos card.jsx: ", allTodos);

    const handleStatusClick = (value, todoId) => {
        setAllTodos(prev => prev.map((todo) => todo._id === todoId ? { ...todo, status: value } : todo));
        setOpenedChecklists(prev => prev.filter(id => id !== todoId));
    };

    const handleDeleteClick = () => {
        setOpenDeleteModel(true);
    };

    const handleDeleteTodoClick = async (todoId) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.delete(`${FRONTEND_URL}/todo/deleteTodo/${todoId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            // console.log("response: ", response);

            toast.success(response?.data?.message);
            if (response?.data?.success) {
                setAllTodos(prev => prev.filter(todo => todo?._id !== todoId));
            }
            setOpenDeleteModel(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = () => {
        setOpenEditModel(true);
    };

    const onEditClose = () => {
        setOpenEditModel(false);
    };

    const handleChange = (e, taskId, isCompleted) => {
        const { name, value } = e.target;
        console.log("name, value:  todoCard ", name, value, taskId);
        if (name === "isCompleted") {

            updateIsCompleted(taskId, isCompleted);
            // setAllTodos(prev => prev.map(toDo => toDo?._id === todo?._id ? { ...toDo, checklist: toDo?.checklist?.map(task => task?._id === taskId ? { ...task, isCompleted: !isCompleted } : task) } : toDo));
        }
    };

    const updateIsCompleted = async (taskId, isCompleted) => {
        try {
            // console.log("isCompleted: ", isCompleted);
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post(`${FRONTEND_URL}/todo/updateStatusAndIsCompleted`, { _id: todo?._id, taskId: taskId, isCompleted: !isCompleted },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            console.log("response: ", response);

            if (response?.data?.success) {
                setAllTodos(prev => prev.map(toDo => toDo?._id === todo?._id ? { ...toDo, checklist: toDo?.checklist?.map(task => task?._id === taskId ? { ...task, isCompleted: !isCompleted } : task) } : toDo));
            }

            // toast.success(response?.data?.message);
        } catch (error) {
            // toast.error(error?.response?.data?.message)
            console.error(error);
        }
    };

    const updateStatus = async (value) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post(`${FRONTEND_URL}/todo/updateStatusAndIsCompleted`, { _id: todo?._id, status: value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            console.log("response: ", response);

            // if (response?.data?.success) {
            // setAllTodos(prev => prev.map((toDo) => toDo?._id === todo?._id ? { ...todo, status: value } : todo));
            // }

            // toast.success(response?.data?.message);
        } catch (error) {
            // toast.error(error?.response?.data?.message)
            console.error(error);
        }
    };

    const handleShareClick = () => {

    };

    const smallPopupClose = () => {
        setSmallModelOpen(false);
    };

    const isDatePassed = (dueDate) => {
        dueDate = new Date(dueDate);
        let currentDate = new Date();
        // console.log("dueDate: ", dueDate, "currentDate: ", currentDate);
        if (dueDate > currentDate) {
            return false;
        }
        return true;
    };

    return (
        <>
            <div className={styles.todoCardContainer}>
                <div className={styles.header}>
                    <div className={styles.colorAndPriority}>
                        {todo.priority === "low" ?
                            <>
                                <img src={Green} alt="green dot" />
                                <span>LOW PRIORITY</span>
                            </> :
                            todo.priority === "moderate" ?
                                <>
                                    <img src={Blue} alt="blue dot" />
                                    <span>MODERATE PRIORITY</span>
                                </> :
                                <>
                                    <img src={Pink} alt="high dot" />
                                    <span>HIGH PRIORITY</span>
                                </>
                        }
                    </div>
                    <span className={styles.threeDots} onClick={() => setSmallModelOpen(true)}><BsThreeDots /></span>
                    {smallModelOpen ?
                        <OutsideClickHandler handleClose={smallPopupClose}>
                            <div className={styles.smallMenu}>
                                <span onClick={() => handleEditClick(todo._id)}>Edit</span>
                                <CopyToClipboard
                                    text={`${window.location.origin}/todo/${todo?._id}`}
                                    onCopy={() => {
                                        toast.success("Link Copied", {
                                            style: {
                                                position: 'relative',
                                                top: '0px',
                                                left: '40%',
                                                zIndex: '9999'
                                            }
                                        });
                                        smallPopupClose();
                                    }}
                                    className={styles["btn-div"]}
                                >
                                    <span onClick={() => handleShareClick(todo._id)}>Share</span>
                                </CopyToClipboard>
                                <span onClick={() => handleDeleteClick()}>Delete</span>
                            </div>
                        </OutsideClickHandler>
                        : ""
                    }
                </div>


                {openEditModel ?
                    <EditTodo onClose={onEditClose} setAllTodos={setAllTodos} todoId={todo?._id} /> : ""
                }

                <h1>{todo.title}</h1>

                <div className={styles.checklistHeader}>
                    <h4>Checklist{todo?.checklist?.length ? `${todo?.checklist?.filter(task => task?.isCompleted)?.length}/${todo?.checklist?.length}` : 0 / 0}</h4>
                    {openedChecklists?.includes(todo?._id) ?
                        <img onClick={() => setOpenedChecklists(prev => prev.filter(id => id != todo?._id))} src={DropUp} /> :
                        <img onClick={() => setOpenedChecklists(prev => ([...prev, todo?._id]))} src={DropDown} />
                    }
                </div>


                {openedChecklists?.includes(todo?._id) &&
                    <div className={styles.tasksContainer}>
                        {todo.checklist?.map((task, index) => {
                            return (
                                <div className={styles.task} key={index}>
                                    <div className={styles.checkboxInputContainer}>
                                        <input
                                            name="isCompleted"
                                            type="checkbox"
                                            checked={task.isCompleted}
                                            className={styles.checkbox}
                                            onChange={(e) => handleChange(e, task._id, task?.isCompleted)}
                                        />
                                        <input
                                            name="description"
                                            type="text"
                                            placeholder="Task to be done"
                                            className={styles.taskInput}
                                            value={task.description}
                                            disabled={true}
                                        // onChange={(e) => handleChange(e, task._id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }

                <div className={styles.footer}>
                    {/* <div>
                        {todo?.dueDate && todo?.status !== "DONE" && isDatePassed(todo?.dueDate) ?
                            <button className={`${styles.date} ${styles.dateRedBackground}`}><Moment format="MMM Do" tz="Asia/Kolkata" parse="ddd, DD MMM YYYY HH:mm:ss [GMT]">{todo?.dueDate}</Moment> </button> :
                            todo?.dueDate && todo?.status !== "DONE" && !isDatePassed(todo?.dueDate) ?
                                <button className={`${styles.date} ${styles.dateGreyBackground}`}><Moment format="MMM Do" tz="Asia/Kolkata" parse="ddd, DD MMM YYYY HH:mm:ss [GMT]">{todo?.dueDate}</Moment></button> :
                                todo?.dueDate && todo?.status === "DONE" ?
                                    <button className={`${styles.date} ${styles.dateGreenBackground}`}><Moment format="MMM Do" tz="Asia/Kolkata" parse="ddd, DD MMM YYYY HH:mm:ss [GMT]">{todo?.dueDate}</Moment></button> :
                                    ""
                        }
                    </div> */}

                    <div className={styles.statusContainer}>
                        {todo?.status === "TO-DO" ?
                            <>
                                <button onClick={() => {
                                    updateStatus("BACKLOG");
                                    handleStatusClick("BACKLOG", todo?._id);
                                }}>BACKLOG</button>
                                <button onClick={() => {
                                    updateStatus("PROGRESS");
                                    handleStatusClick("PROGRESS", todo?._id);
                                }}>PROGRESS</button>
                                <button onClick={() => {
                                    updateStatus("DONE");
                                    handleStatusClick("DONE", todo?._id);
                                }}>DONE</button>
                            </> :
                            todo?.status === "BACKLOG" ?
                                <>
                                    <button onClick={() => {
                                        updateStatus("TO-DO");
                                        handleStatusClick("TO-DO", todo?._id);
                                    }}>TO-DO</button>
                                    <button onClick={() => {
                                        updateStatus("PROGRESS");
                                        handleStatusClick("PROGRESS", todo?._id);
                                    }}>PROGRESS</button>
                                    <button onClick={() => {
                                        updateStatus("DONE");
                                        handleStatusClick("DONE", todo?._id);
                                    }}>DONE</button>
                                </> :
                                todo?.status === "PROGRESS" ?
                                    <>
                                        <button onClick={() => {
                                            updateStatus("TO-DO");
                                            handleStatusClick("TO-DO", todo?._id);
                                        }}>TO-DO</button>
                                        <button onClick={() => {
                                            updateStatus("BACKLOG");
                                            handleStatusClick("BACKLOG", todo?._id);
                                        }}>BACKLOG</button>
                                        <button onClick={() => {
                                            updateStatus("DONE");
                                            handleStatusClick("DONE", todo?._id);
                                        }}>DONE</button>
                                    </> :
                                    <>
                                        <button onClick={() => {
                                            updateStatus("TO-DO");
                                            handleStatusClick("TO-DO", todo?._id);
                                        }}>TO-DO</button>
                                        <button onClick={() => {
                                            updateStatus("BACKLOG");
                                            handleStatusClick("BACKLOG", todo?._id);
                                        }}>BACKLOG</button>
                                        <button onClick={() => {
                                            updateStatus("PROGRESS");
                                            handleStatusClick("PROGRESS", todo?._id);
                                        }}>PROGRESS</button>
                                    </>
                        }
                    </div>
                </div>

                {openDeleteModel ?
                    <BackgroundBlur>
                        <OutsideClickHandler handleClose={() => setOpenDeleteModel(false)}>
                            <div className={styles.deleteModal}>
                                <h2>Are you sure you want to Delete?</h2>
                                <button onClick={() => handleDeleteTodoClick(todo._id)} className={styles.confirm}>Yes, Delete</button>
                                <button onClick={() => setOpenDeleteModel(false)} className={styles.cancel}>Cancel</button>
                            </div>
                        </OutsideClickHandler>
                    </BackgroundBlur>
                    : ""
                }

            </div>
        </>
    );
};

export default Card;