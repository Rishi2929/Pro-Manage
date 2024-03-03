import React from "react";
import styles from '../styles/CommonComponents.module.scss';

const BgBlack = ({ children }) => {
    return (
        <div className={styles.bgBlackContainer}>
                {children}
        </div>
    );
};

export default BgBlack;