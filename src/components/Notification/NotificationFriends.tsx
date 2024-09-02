import React, {useEffect} from 'react';
import './Notification.css';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

const Notification = ({ sender, message, onClose }) => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user);
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Уведомление исчезает через 5 секунд

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '10%', height: 80, zIndex: 99, backgroundColor: 'beige'}}>
            <p>
                <strong>{sender}:</strong> {message}
            </p>
            <button onClick={()=>    navigate('/user/'+userId)}>Просмотр</button>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default Notification;
