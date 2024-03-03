import React, { useState } from 'react';

import { VscCollapseAll } from "react-icons/vsc";
import { LuPlus } from "react-icons/lu";

import styles from '../styles/StatusSection.module.scss';
import Card from './Card';
import { useActionData } from 'react-router-dom';

const StatusSection = ({ sectionType, allTodos, setAllTodos, title, collapseClickCallback, plusClickCallBac }) => {
    const [collapseSection, setCollapseSection] = useState({
        backlog: [],
        todo: [],
        progress: [],
        done: [],
    });

    const handleCollapseSection = (sectionType) => {

    };

    return (
        <div className={styles.statusSectionContainer}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <div className={styles.headerEndContainer}>
                    {sectionType === "todo" &&
                        < LuPlus />
                    }
                    <VscCollapseAll />
                </div>
            </div>

            <div className={styles.sectionBody}>
                <div className={styles.scroll}>
                    {allTodos?.map((t, index) => {
                        return (
                            t.status.toLowerCase() === sectionType.toLowerCase() &&
                            <div className={styles.cardOne} key={index}>
                                <Card
                                    todo={t}
                                    handleCollapseSection={handleCollapseSection}
                                    collapseSection={collapseSection}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default StatusSection;