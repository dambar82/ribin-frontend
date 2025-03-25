import React, {useEffect, useState} from 'react';
import styles from "./Notification.module.scss";
import closeNotification from "../../images/svg/closeNotificationWhite.svg";

const NotificationPost = ({data, onClose, onMouseEnter, onMouseLeave}) => {

    const [bgColor, setBgColor] = useState('#48903A')

    useEffect(() => {
        console.log('data type', data.data[0].type)
        if (data.data[0]?.type === 'rubicks_more') {
            setBgColor('#48903A')
        } else if (data.data[0]?.type === 'rubicks_less') {
            setBgColor('#E11F1F')
        }
    }, [data])

    return (
        <div
            className={styles.notification}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 99,
                backgroundColor: bgColor
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={styles.avatar}>
                <img src='/images/rubikPlus.png' alt=""/>
            </div>
            <div className={styles.mainContent}>
                {
                    bgColor === '#48903A' ? (
                        <h2 style={{color: 'white'}}>
                            Ура, Ваш баланс пополнился!
                        </h2>
                    ) : (
                        <h2 style={{color: 'white'}}>
                            С вашего баланса списаны рубики!
                        </h2>
                    )
                }
                <p style={{color: "white"}}>{data.data[0]?.message}</p>
            </div>
            <img
                onClick={onClose}
                style={{display: 'block', cursor: "pointer", marginBottom: 'auto'}}
                src={closeNotification} alt=""/>
        </div>
    );
};

export default NotificationPost;