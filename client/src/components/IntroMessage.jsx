import React from 'react';
import childImg from '../assets/child.png';
import styles from '../styles/IntroMessage.module.scss';

const IntroMessage = () => {
    return (
        <div className={styles.introMessageContainer}>
            <div className={styles.body}>
                <div className={styles.object}>
                    <div className={styles.darkCircle}></div>
                    <img src={childImg} alt="childImg" />
                </div>
                <div className={styles.textContainer}>
                    <h1>Welcome aboard my friend</h1>
                    <p>just a couple of clicks and we start</p>
                </div>
            </div>

        </div>
    );
};

export default IntroMessage;