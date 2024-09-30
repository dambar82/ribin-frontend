import React, {ReactNode, useEffect} from 'react';
import UnauthHeader from "../headers/UnauthHeader/UnauthHeader";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import AuthHeader from "../headers/AuthHeader/AuthHeader";
import Footer from "../Footer/Footer";
import NotificationFriends from "../Notification/NotificationFriends";

interface UnauthLayoutProps {
    children: ReactNode;
    notificationFriend: {visible: boolean, data: any};
    setNotificationFriend: any;
    autoCloseTimeout: any;
    setAutoCloseTimeout: any;
}

const UnauthLayout: React.FC<UnauthLayoutProps> = ({ children, notificationFriend, setNotificationFriend, autoCloseTimeout, setAutoCloseTimeout }) => {
    const user = useSelector((state: RootState) => state.user.user);

    const isAuth = !!user?.email_confirmed

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
        }, 5000); // Возобновляем таймер на 2 секунды
        setAutoCloseTimeout(timeout);
    };


    return (
        <div className='content'>
            <AuthHeader />
            <main>
                {children}
                {notificationFriend.visible && <NotificationFriends friendship={notificationFriend.data.friendship} onClose={handleCloseNotification}
                                                            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                                            sender={notificationFriend.data.client}></NotificationFriends>}
            </main>
            <Footer></Footer>
        </div>
    );
};

export default UnauthLayout;
