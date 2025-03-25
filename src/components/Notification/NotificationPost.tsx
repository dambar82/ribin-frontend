import React, {useEffect, useState} from 'react';
import styles from "./Notification.module.scss";
import closeNotification from "../../images/svg/closeNotificationWhite.svg";

const NotificationPost = ({data, onClose, onMouseEnter, onMouseLeave}) => {

    const [bgColor, setBgColor] = useState('#48903A')

    useEffect(() => {
        console.log('data type', data.data[0])
        if (data.data[0]?.type === 'rubicks_more') {
            setBgColor('#48903A')
        } else if (data.data[0]?.type === 'rubicks_less') {
            setBgColor('#E11F1F')
        } else if (data.data[0]?.type === 'add_post_info') {
            setBgColor('#48903A');
        } else if (data.data[0]?.type === 'delete_post_info') {
            setBgColor('#48903A');
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
                    data.data[0]?.type === 'rubicks_more' ? (
                        <h2 style={{color: 'white'}}>
                            Ура, Ваш баланс пополнился!
                        </h2>
                    ) : data.data[0]?.type === 'rubicks_less' ? (
                        <h2 style={{color: 'white'}}>
                            С вашего баланса списаны рубики!
                        </h2>
                    ) : data.data[0]?.type === 'add_post_info' ? (
                        <h2 style={{color: 'white'}}>
                            Новый пост добавлен!
                        </h2>
                    ) : data.data[0]?.type === 'delete_post_info' && (
                        <h2 style={{color: 'white'}}>
                            Пост удалён!
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