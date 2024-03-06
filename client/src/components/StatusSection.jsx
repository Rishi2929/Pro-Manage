import React, { useState } from 'react';

import { VscCollapseAll } from "react-icons/vsc";
import { LuPlus } from "react-icons/lu";

import styles from '../styles/StatusSection.module.scss';
import Card from './Card';
import { useActionData } from 'react-router-dom';
import Create from './Create';

const StatusSection = ({ sectionType, allTodos, setAllTodos, title, collapseClickCallback, plusClickCallBac }) => {
    const [collapseSection, setCollapseSection] = useState({    // if drop down or drop up is clicked we push or remove that todo card ids according
        BACKLOG: [],
        TODO: [],
        PROGRESS: [],
        DONE: [],
    });

    const [isCreateTodoShowing, setIsCreateTodoShowing] = useState(false);

    const handleCollapseSection = (todo_id, clickType, sectionType) => {
        if(clickType === "dropDownClick") {
            setCollapseSection({...collapseSection, [sectionType]: [...collapseSection[sectionType], todo_id]})
        }
        else if(clickType === "dropUpClick") {
            setCollapseSection({...collapseSection, [sectionType]: [...collapseSection[sectionType].filter(id => id !== todo_id)]})
        }
    };

    const handleSectionCollapseAll = (sectionType) => {
        setCollapseSection({...collapseSection, [sectionType]: []}) // remove all ids for that section type
    }

    const handleClose = () => {
        setIsCreateTodoShowing(false);
    };

    return (
        <div className={styles.statusSectionContainer}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <div className={styles.headerEndContainer}>
                    {sectionType === "TODO" &&
                        < LuPlus onClick={() => setIsCreateTodoShowing(true)} />
                    }
                    <VscCollapseAll onClick={() => handleSectionCollapseAll(sectionType)} />
                </div>
            </div>

            <div className={styles.sectionBody}>
                <div className={styles.scroll}>
                    {allTodos?.map((todo, index) => {
                        return (
                            todo?.status.toLowerCase() === sectionType.toLowerCase() &&
                            <div className={styles.cardOne} key={index}>
                                <Card
                                    todo={todo}
                                    handleCollapseSection={handleCollapseSection}
                                    collapseSection={collapseSection}
                                    sectionType = {sectionType}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {
                isCreateTodoShowing &&
                <Create
                    handleClose={handleClose}
                />
            }

        </div>
    );
};

export default StatusSection;