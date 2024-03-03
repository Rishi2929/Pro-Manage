import React, { useRef, useEffect } from "react";
import styles from '../styles/CommonComponents.module.scss';

const CloseOnOutsideClick = ({ children, onClose }) => {
    const wrapperRef = useRef(null);

    function handleClickOutside(event) {
        if (
            wrapperRef.current &&
            !wrapperRef.current.contains(event.target) &&
            onClose
        )
            onClose();
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return <div className={styles.closeOnOutsideClick} ref={wrapperRef}>{children}</div>;
};

export default CloseOnOutsideClick;