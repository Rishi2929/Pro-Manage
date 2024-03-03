import React from 'react';
import styles from '../styles/CommonComponents.module.scss';
import BgBlack from './BgBlack';
import CloseOnOutsideClick from './CloseOnOutsideClick';

const ChoiceModel = ({ message, firstBtnText, secondBtnText, onConfirm, onClose }) => {
    return (
        <BgBlack>
            <CloseOnOutsideClick onClose={onClose}>
            <div className={styles.choiceModelContainer}>
                <h1>{message}</h1>
                <button className={styles.yesBtn} onClick={() => onConfirm()}>{firstBtnText}</button>
                <button className={styles.noBtn} onClick={() => onClose()}>{secondBtnText}</button>
            </div>
            </CloseOnOutsideClick>
        </BgBlack>
    );
};

export default ChoiceModel;