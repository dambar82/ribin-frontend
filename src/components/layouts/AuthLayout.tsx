import React, {ReactNode, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import AuthHeader from "../headers/AuthHeader/AuthHeader";
import Footer from "../Footer/Footer";
import NotificationFriends from "../Notification/NotificationFriends";


interface AuthLayoutProps {
    children: ReactNode;
    notificationFriend: {visible: boolean, data: any}
    setNotificationFriend: any;
    autoCloseTimeout: any;
    setAutoCloseTimeout: any;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, notificationFriend, setNotificationFriend, autoCloseTimeout, setAutoCloseTimeout }) => {

    useEffect(() => {
        console.log(notificationFriend)
    }, [notificationFriend])


    const handleCloseNotification = () => {
        setNotificationFriend({ visible: false, data: null });
    };

    const handleMouseEnter = () => {
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
            setAutoCloseTimeout(null); // Очищаем таймер
        }
    };

    // Возобновляем таймер при уходе курсора
    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setNotificationFriend({ visible: false, data: null });
        }, 2000); // Возобновляем таймер на 2 секунды
        setAutoCloseTimeout(timeout);
    };

    return (<>
        <div className='content'>
            <AuthHeader></AuthHeader>
            <main>
                {children}
                {notificationFriend.visible && (<NotificationFriends
                    sender={notificationFriend.data.client}
                    onClose={handleCloseNotification} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                />)}
            </main>
        </div>
        <Footer />
    </>);
};

export default AuthLayout;