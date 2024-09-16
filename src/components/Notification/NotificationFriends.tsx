import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import styles from './Notification.module.scss';
import closeNotification from '../../images/svg/closeNotification.svg';
import axios from "axios";
import {fetchFriends} from "../../store/friendsSlice";
import {useAppDispatch} from "../../store/hooks";

interface INotification {
    sender: any;
    onClose: any;
    onMouseEnter: any;
    onMouseLeave: any;
}

const NotificationFriends = ({sender, onClose, onMouseEnter, onMouseLeave }) => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();


    const handleAcceptFriendship = async (event, friendship: number) => {
        const config: any = {}
        const token = JSON.parse(localStorage.getItem('token') || '');

        onClose();

        const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/accept/${friendship}`;

        await axios.post(friendsUrl, {friendshipId: friendship}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    const handleDeleteFriendship = async (event, receiverId: number) => {
        const token = JSON.parse(localStorage.getItem('token') || '')

        const friendsUrl = `https://api-rubin.multfilm.tatar/api/friends/remove/${receiverId}`;

        await axios.delete(friendsUrl, {headers: {Authorization: `Bearer ${token}`}});

        onClose();
    }

    return (
        <div
            className={styles.notification}
            style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 99}}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={styles.avatar}>
                <img src={sender.image} alt=""/>
            </div>
            <div className={styles.mainContent}>
                <p>Пользователь <span>{sender.name} {sender.surname}</span> хочет добавить вас в список друзей</p>
                <div style={{display: 'flex', gap: '12px'}}>
                    <button className={styles.acceptButton} onClick={(event) => handleAcceptFriendship(event, sender.id)}>
                        Принять
                    </button>
                    <button className={styles.declineButton} onClick={(event) => handleDeleteFriendship(event, sender.id)}>
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
