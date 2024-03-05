import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsThreeDots } from "react-icons/bs";
import { BiSolidChevronDownSquare } from "react-icons/bi";
import { BiSolidChevronUpSquare } from "react-icons/bi";
import toast from "react-hot-toast";
// import Moment from 'react-moment';
import "moment-timezone";
import moment from 'moment';

import styles from '../styles/Card.module.scss';

import PinkDotImg from '../assets/pinkDot.png';
import GreenDotImg from '../assets/greenDot.png';
import BlueDotImg from '../assets/blueDot.png';
import DropUp from '../assets/dropUp.png';
import DropDown from '../assets/dropdown.png';
// import EditTodo from "../EditTodo/EditTodo";
import { server } from "../main";
import AllTodosContext from "../context/allTodosData/AllTodosContext";
import CloseOnClick from "../common-components/CloseOnClick";
import BgBlack from "../common-components/BgBlack";
import Edit from "./Edit";


const DotPriorityContainer = ({ imgSrc, text }) => {
    return (
        <>
            <img src={imgSrc} alt="pink dot" />
            <span>{text}</span>
        </>
    );
};


const Card = ({ todo, handleCollapseSection, collapseSection, sectionType, setOpenedChecklists, openedChecklists }) => {
    const [isDeleteDialogueShowing, setIsDeleteDialogueShowing] = useState(false);
    const [isMenuShowing, setIsMenuShowing] = useState(false);
    const [checklistCompletedText, setChecklistCompletedText] = useState("");
    const [isEditModelShowing, setIsEditModelShowing] = useState(false);

    const { allTodos, setAllTodos } = useContext(AllTodosContext);

    // console.log("allTodos card.jsx: ", allTodos);

    useEffect(() => {
        if (todo?.checklist?.length) {
            const isCompletedTrueTodos = todo?.checklist?.filter(task => task?.isCompleted);
            const isCompletedTrueTodosLength = isCompletedTrueTodos?.length;
            setChecklistCompletedText(`${isCompletedTrueTodosLength}/${todo?.checklist?.length}`);
        } else {
            setChecklistCompletedText('0/0');
        }
    }, [todo?.checklist]);

    const handleStatusBtnClick = (statusValue, todo_id) => {
        saveStatusInDB(statusValue, todo_id);
    };

    const saveStatusInDB = async (statusValue, todo_id) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post(`${server}/todo/status-isCompleted-update`, { _id: todo_id, status: statusValue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            // console.log("response: ", response);

            // if (response?.data?.success) {
            setAllTodos(allTodos.map((todo) => todo._id === todo_id ? { ...todo, status: statusValue } : todo));
            handleCollapseSection(todo_id, "dropUpClick", sectionType);
            // }

        } catch (error) {
            console.error(error);
            // toast.error(error?.response?.data?.message);
        }
    };

    const isDatePassed = (dueDate) => {
        dueDate = new Date(dueDate);
        let currentDate = new Date();
        if (dueDate > currentDate) {
          return false;
        }
        return true;
      };

    const handleYesDeleteClick = async (todo_id) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.delete(`${server}/todo/delete-todo/${todo_id}`,
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
                setAllTodos(allTodos.filter(todo => todo?._id !== todo_id));
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message);
        } finally {
            setIsDeleteDialogueShowing(false);
        }
    };

    const handleCheckboxChange = async (clickType, task_id, prevIsCompleted) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post(`${server}/todo/status-isCompleted-update`, { _id: todo?._id, taskId: task_id, isCompleted: !prevIsCompleted },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );
            console.log("response: ", response);

            // if (response?.data?.success) {
            let currentTodo = allTodos?.find(_todo => _todo?._id === todo?._id);
            const newChecklist = currentTodo?.checklist?.map(task => {
                if (task?._id === task_id) {
                    task.isCompleted = !prevIsCompleted;
                }
                return task;
            });
            currentTodo["checklist"] = newChecklist;
            setAllTodos(allTodos.map(todo => todo?._id === currentTodo?._id ? currentTodo : todo));
            // }

            // toast.success(response?.data?.message);
        } catch (error) {
            console.error(error);
            // toast.error(error?.response?.data?.message);
        }
    };

    return (
        <>
            <div className={styles.cardContainer}>
                <div className={styles.upperCard}>
                    <div className={styles.priorityDotContainer}>
                        {todo.priority === "low" ?
                            <DotPriorityContainer
                                imgSrc={GreenDotImg}
                                text="LOW PRIORITY"
                            /> :
                            todo.priority === "moderate" ?
                                <DotPriorityContainer
                                    imgSrc={BlueDotImg}
                                    text="MODERATE PRIORITY"
                                /> :
                                <DotPriorityContainer
                                    imgSrc={PinkDotImg}
                                    text="HIGH PRIORITY"
                                />
                        }
                    </div>
                    <span onClick={() => setIsMenuShowing(true)}><BsThreeDots /></span>
                    {isMenuShowing ?
                        <CloseOnClick onClose={() => setIsMenuShowing(false)}>
                            <div className={styles.menu}>
                                <span onClick={() => setIsEditModelShowing(true)}>Edit</span>
                                <CopyToClipboard
                                    text={`${window.location.origin}/sharePage/${todo?._id}`}
                                    onCopy={() => {
                                        toast.success("Link Copied", {
                                            style: {
                                                position: 'relative',
                                                top: '0px',
                                                left: '44%',
                                                zIndex: '9999'
                                            }
                                        });
                                        setIsMenuShowing(false);
                                    }}
                                >
                                    <span>Share</span>
                                </CopyToClipboard>
                                <span onClick={() => setIsDeleteDialogueShowing(true)}>Delete</span>
                            </div>
                        </CloseOnClick>
                        : ""
                    }
                </div>


                {isEditModelShowing ?
                    <Edit handleClose={() => setIsEditModelShowing(false)} setAllTodos={setAllTodos} todoId={todo?._id} /> : ""
                }

                <h1>{todo.title}</h1>

                <div className={styles.checklistContainer}>
                    <h4>Checklist ({checklistCompletedText ? (checklistCompletedText) : 0 / 0})</h4>
                    {collapseSection[sectionType]?.includes(todo?._id) ?
                        <img onClick={() => handleCollapseSection(todo?._id, "dropUpClick", sectionType)} src={DropUp} /> :
                        <img onClick={() => handleCollapseSection(todo?._id, "dropDownClick", sectionType)} src={DropDown} />
                    }
                </div>


                {collapseSection[sectionType]?.includes(todo?._id) &&
                    <div className={styles.tasks}>
                        {todo.checklist?.map((task, index) => {
                            return (
                                <div className={styles.task} key={index}>
                                    <div className={styles.checkboxInputWrapper}>
                                        <input
                                            onChange={(e) => handleCheckboxChange("checkbox", task._id, task?.isCompleted)}
                                            name="isCompleted"
                                            type="checkbox"
                                            checked={task.isCompleted}
                                            className={styles.checkbox}
                                        />
                                        <input
                                            name="description"
                                            type="text"
                                            placeholder="Task to be done"
                                            disabled={true}
                                            className={styles.taskInput}
                                            value={task.description}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }

                <div className={styles.cardBottom}>
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
                    <div>
                        {todo?.dueDate && todo?.status !== "DONE" && isDatePassed(todo?.dueDate) ?
                            <button className={`${styles.date} ${styles.dateRedBackground}`}>
                                {moment(todo?.dueDate).format("MMM Do")}
                            </button> :
                            todo?.dueDate && todo?.status !== "DONE" && !isDatePassed(todo?.dueDate) ?
                                <button className={`${styles.date} ${styles.dateGreyBackground}`}>
                                    {moment(todo?.dueDate).format("MMM Do")}
                                </button> :
                                todo?.dueDate && todo?.status === "DONE" ?
                                    <button className={`${styles.date} ${styles.dateGreenBackground}`}>
                                        {moment(todo?.dueDate).format("MMM Do")}
                                    </button> :
                                    ""
                        }
                    </div>

                    <div className={styles.statuses}>
                        {todo?.status === "TODO" ?
                            <>
                                <button onClick={() => { handleStatusBtnClick("BACKLOG", todo?._id); }}>BACKLOG</button>
                                <button onClick={() => { handleStatusBtnClick("PROGRESS", todo?._id); }}>PROGRESS</button>
                                <button onClick={() => { handleStatusBtnClick("DONE", todo?._id); }}>DONE</button>
                            </> :
                            todo?.status === "BACKLOG" ?
                                <>
                                    <button onClick={() => { handleStatusBtnClick("TODO", todo?._id); }}>TO-DO</button>
                                    <button onClick={() => { handleStatusBtnClick("PROGRESS", todo?._id); }}>PROGRESS</button>
                                    <button onClick={() => { handleStatusBtnClick("DONE", todo?._id); }}>DONE</button>
                                </> :
                                todo?.status === "PROGRESS" ?
                                    <>
                                        <button onClick={() => { handleStatusBtnClick("BACKLOG", todo?._id); }}>BACKLOG</button>
                                        <button onClick={() => { handleStatusBtnClick("TODO", todo?._id); }}>TO-DO</button>
                                        <button onClick={() => { handleStatusBtnClick("DONE", todo?._id); }}>DONE</button>
                                    </> :
                                    <>
                                        <button onClick={() => { handleStatusBtnClick("BACKLOG", todo?._id); }}>BACKLOG</button>
                                        <button onClick={() => { handleStatusBtnClick("TODO", todo?._id); }}>TO-DO</button>
                                        <button onClick={() => { handleStatusBtnClick("PROGRESS", todo?._id); }}>PROGRESS</button>
                                    </>
                        }
                    </div>
                </div>

                {isDeleteDialogueShowing ?
                    <BgBlack>
                        <div className={styles.deleteQuestion}>
                            <h2>Are you sure you want to Delete?</h2>
                            <button onClick={() => handleYesDeleteClick(todo._id)} className={styles.yes}>Yes, Delete</button>
                            <button onClick={() => setIsDeleteDialogueShowing(false)} className={styles.no}>Cancel</button>
                        </div>
                    </BgBlack>
                    : ""
                }

            </div>
        </>
    );
};

export default Card;