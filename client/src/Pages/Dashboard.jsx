import React, { useContext, useEffect, useState } from 'react';

import { MdKeyboardArrowDown } from "react-icons/md";

import styles from "../styles/DashboardPage.module.scss";
import AllTodosContext from '../context/allTodosData/AllTodosContext';
import StatusSection from '../components/StatusSection';
import UserContext from '../context/user/UserContext';
import useUserLocalStorage from '../hooks/useUserLocalStorage';

const Dashboard = () => {
    const [selectedFilter, setSelectedFilter] = useState("thisWeek");
    const [isFilterPopupShowing, setIsFilterPopupShowing] = useState(false);
    const [user, setUser] = useState(null);

    const { allTodos, setAllTodos } = useContext(AllTodosContext);
    // const {loggedInUser, setLoggedInUser} = useUserLocalStorage();

    console.log("user: ", user)

    useEffect(() => {
        // console.log("dashboard mounted");
        getUserFromLocal();
    }, []);

    const getUserFromLocal = () => {
        const user =JSON.parse(localStorage.getItem("user")) || null;
        setUser(user);
    }

    const collapseClickCallback = (sectionType) => {

    };

    const plusClickCallBac = (sectionType) => {

    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h2>Welcome! {user?.name}</h2>
                <h3>12th Jan, 2024</h3>
                <div className={styles.titleFilterContainer}>
                    <h1>Board</h1>
                    <div className={styles.filterContainer} onClick={() => setIsFilterPopupShowing(prev => !prev)}>
                        <span>This week</span>
                        <MdKeyboardArrowDown />
                    </div>
                    {
                        isFilterPopupShowing &&
                        <div className={styles.smallPopup}>
                            <span onClick={() => setSelectedFilter("today")}>Today</span>
                            <span onClick={() => setSelectedFilter("thisWeek")}>This Week</span>
                            <span onClick={() => setSelectedFilter("thisMonth")}>This Month</span>
                        </div>
                    }
                </div>
            </div>

            <div className={styles.statusSectionsContainer}>
                <div className={styles.scroll}>
                    {/* <div className={styles.scroll2}> */}
                    <StatusSection
                        sectionType="backlog"
                        allTodos={allTodos}
                        setAllTodos={setAllTodos}
                        title="Backlog"
                        collapseClickCallback={collapseClickCallback}
                        plusClickCallBac={plusClickCallBac}
                    />
                    <StatusSection
                        sectionType="todo"
                        allTodos={allTodos}
                        setAllTodos={setAllTodos}
                        title="To do"
                        collapseClickCallback={collapseClickCallback}
                        plusClickCallBac={plusClickCallBac}
                    />
                    <StatusSection
                        sectionType="progress"
                        allTodos={allTodos}
                        setAllTodos={setAllTodos}
                        title="In Progress"
                        collapseClickCallback={collapseClickCallback}
                        plusClickCallBac={plusClickCallBac}
                    />
                    <StatusSection
                        sectionType="done"
                        allTodos={allTodos}
                        title="Done"
                        collapseClickCallback={collapseClickCallback}
                        plusClickCallBac={plusClickCallBac}
                    />
                </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Dashboard;