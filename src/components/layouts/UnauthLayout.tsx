import React, { ReactNode } from 'react';
import UnauthHeader from "../headers/UnauthHeader/UnauthHeader";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import AuthHeader from "../headers/AuthHeader/AuthHeader";
import Footer from "../Footer/Footer";
import NotificationFriends from "../Notification/NotificationFriends";

interface UnauthLayoutProps {
    children: ReactNode;
    notificationFriend: boolean;
}

const UnauthLayout: React.FC<UnauthLayoutProps> = ({ children, notificationFriend }) => {
    const user = useSelector((state: RootState) => state.user.user);

    const isAuth = !!user?.email_confirmed

    return (
        <div className='content'>
            <AuthHeader />
            <main>
                {children}
                {/*{notificationFriend && <NotificationFriends sender='dsds'></NotificationFriends>}*/}
            </main>
            <Footer></Footer>
        </div>
    );
};

export default UnauthLayout;
