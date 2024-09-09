import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import styles from './Notification.module.scss';
import closeNotification from '../../images/svg/closeNotification.svg';

const NotificationFriends = ({ sender }) => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user);

    const onClose = () => {

    }

    return (
        <div className={styles.notification} style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 99}}>
            <div className={styles.avatar}>
                <img src='/images/cap.png' alt=""/>
            </div>
            <div className={styles.mainContent}>
                <p>Пользователь <span>{sender.name} {sender.surname}</span> хочет добавить вас в список друзей</p>
                <div style={{display: 'flex', gap: '12px'}}>
                    <button className={styles.acceptButton}>
                        Принять
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

export default NotificationFriends;
