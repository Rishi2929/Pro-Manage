import React, { useContext, useEffect, useState } from 'react';

import { MdKeyboardArrowDown } from "react-icons/md";

import styles from "../styles/DashboardPage.module.scss";
import AllTodosContext from '../context/allTodosData/AllTodosContext';
import StatusSection from '../components/StatusSection';
import UserContext from '../context/user/UserContext';
import useUserLocalStorage from '../hooks/useUserLocalStorage';
import CustomLoader from '../common-components/CustomLoader';
import CloseOnClick from '../common-components/CloseOnClick';

const Dashboard = () => {
    const [isFilterPopupShowing, setIsFilterPopupShowing] = useState(false);
    const [user, setUser] = useState(null);

    const { allTodos, setAllTodos, selectedFilter, setSelectedFilter, allTodosLoading, getAllTodos } = useContext(AllTodosContext);

    console.log("user: ", user);

    useEffect(() => {
        console.log("dashboardddddddddddddddddd mounted");
        getUserFromLocal();
        getAllTodos();
    }, []);

    const getUserFromLocal = () => {
        const user = JSON.parse(localStorage.getItem("user")) || null;
        setUser(user);
    };

    const handleFilter = (value) => {
        setSelectedFilter(value);
        setIsFilterPopupShowing(false);
    };

    return (
        <div className={styles.dashboardContainer}>
            {allTodosLoading ? <CustomLoader isLoading={allTodosLoading} /> :
                <>
                    <div className={styles.header}>
                        <h2>Welcome! {user?.name}</h2>
                        <h3>12th Jan, 2024</h3>
                        <div className={styles.titleFilterContainer}>
                            <h1>Board</h1>
                            <CloseOnClick onClose={() => setIsFilterPopupShowing(false)} >
                                <div className={styles.filterContainer} onClick={() => setIsFilterPopupShowing(prev => !prev)}>
                                    {selectedFilter === "thisWeek" ?
                                        <span>This week</span> :
                                        selectedFilter === "thisMonth" ?
                                            <span>This month</span> :
                                            <span>This day</span>
                                    }
                                    <MdKeyboardArrowDown />
                                </div>
                            </CloseOnClick>
                            {
                                isFilterPopupShowing &&
                                <div className={styles.smallPopup}>
                                    <span onClick={() => handleFilter("today")}>Today</span>
                                    <span onClick={() => handleFilter("thisWeek")}>This Week</span>
                                    <span onClick={() => handleFilter("thisMonth")}>This Month</span>
                                </div>
                            }
                        </div>
                    </div>

                    <div className={styles.statusSectionsContainer}>
                        <div className={styles.scroll}>
                            {/* <div className={styles.scroll2}> */}
                            <StatusSection
                                sectionType="BACKLOG"
                                allTodos={allTodos}
                                setAllTodos={setAllTodos}
                                title="Backlog"
                            />
                            <StatusSection
                                sectionType="TODO"
                                allTodos={allTodos}
                                setAllTodos={setAllTodos}
                                title="To do"
                            />
                            <StatusSection
                                sectionType="PROGRESS"
                                allTodos={allTodos}
                                setAllTodos={setAllTodos}
                                title="In Progress"
                            />
                            <StatusSection
                                sectionType="DONE"
                                allTodos={allTodos}
                                title="Done"
                            />
                        </div>
                        {/* </div> */}
                    </div>
                </>
            }
        </div>
    );
};

export default Dashboard;