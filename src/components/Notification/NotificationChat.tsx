import React, {useEffect} from 'react';
import styles from "./Notification.module.scss";
import closeNotification from "../../images/svg/closeNotification.svg";

const NotificationChat = ({ sender }) => {

    const onClose = () => {

    }

    return (
        <div className={styles.notification} style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 99}}>
            <div className={styles.avatar}>
                <img src='/images/cap.png' alt=""/>
            </div>
            <div className={styles.mainContent}>
                <p>У вас новое сообщение от <span>{sender.name}</span>. Проверьте диалог и не забудьте ответить.</p>
                <div style={{display: 'flex', gap: '12px'}}>
                    <button className={styles.acceptButton}>
                        Ответить
                    </button>
                    <button className={styles.declineButton}>
                        Отклонить
                    </button>
                </div>
            </div>
            <img
                onClick={onClose}
                style={{display: 'block', cursor: "pointer", marginBottom: 'auto'}}
                src={closeNotification} alt=""/>
        </div>
    );
};

export default NotificationChat;
