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

import styles from '../styles/SharePage.module.scss';

import logoImg from '../assets/logo.png';
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
import Edit from "../components/Edit";
import { useParams } from "react-router-dom";


const DotPriorityContainer = ({ imgSrc, text }) => {
    return (
        <>
            <img src={imgSrc} alt="pink dot" />
            <span>{text}</span>
        </>
    );
};


const SharePage = ({ handleCollapseSection, collapseSection, sectionType, setOpenedChecklists, openedChecklists }) => {
    const [isDeleteDialogueShowing, setIsDeleteDialogueShowing] = useState(false);
    const [isMenuShowing, setIsMenuShowing] = useState(false);
    const [checklistCompletedText, setChecklistCompletedText] = useState("");
    const [isEditModelShowing, setIsEditModelShowing] = useState(false);
    const [todo, setTodo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { allTodos, setAllTodos } = useContext(AllTodosContext);

    // console.log("allTodos card.jsx: ", allTodos);

    const { id } = useParams();

    useEffect(() => {
        if (id)
            getTodoById();
    }, [id]);

    const getTodoById = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${server}/todo/todo/${id}`);
            console.log("response: ", response);

            if (response?.data?.data)
                setTodo(response?.data?.data);
            toast.success(response?.data?.message);
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <img src={logoImg} alt="Logo img" />
                    <h1>Pro Manage</h1>
                </div>
                <div className={styles.todoSection}>
                    <div className={styles.todoSectionContainer}>
                        <div className={styles.priorityDot}>
                            {todo?.priority === "low" ?
                                <>
                                    <img src={GreenDotImg} alt="green dot" />
                                    <span>LOW PRIORITY</span>
                                </> :
                                todo?.priority === "moderate" ?
                                    <>
                                        <img src={BlueDotImgue} alt="blue dot" />
                                        <span>MODERATE PRIORITY</span>
                                    </> :
                                    <>
                                        <img src={PinkDotImg} alt="high dot" />
                                        <span>HIGH PRIORITY</span>
                                    </>
                            }
                        </div>


                        <h1>{todo?.title}</h1>

                        <div className={styles.checklistSection}>
                            <div className={styles.checklistUp}>
                            <h4>Checklist({checklistCompletedText ? (checklistCompletedText) : (0 / 0)})</h4>
                            </div>

                            <div className={styles.tasks}>
                                {todo?.checklist?.map((task, index) => {
                                    return (
                                        <div className={styles.task} key={index}>
                                            <div className={styles.checkboxInputWrapper}>
                                                <input
                                                    name="isCompleted"
                                                    type="checkbox"
                                                    checked={task?.isCompleted}
                                                    className={styles.checkbox}
                                                />
                                                <p className={styles.inp}>{task?.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {
                            todo?.dueDate &&
                            <div className={styles.down}>
                                <span>Due Date</span>
                                <button className={`${styles.date} ${styles.dateBg}`}>{moment(todo?.dueDate).format("MMM Do")}</button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
};

export default SharePage;