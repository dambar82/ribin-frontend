import React, {useEffect} from 'react';
import './Notification.css';

const Notification = ({ sender, message, onClose }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Уведомление исчезает через 5 секунд

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification">
            <p>
                <strong>{sender}:</strong> {message}
            </p>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default Notification;
