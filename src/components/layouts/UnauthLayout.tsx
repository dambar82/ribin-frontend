import React, { ReactNode } from 'react';
import UnauthHeader from "../headers/UnauthHeader/UnauthHeader";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import AuthHeader from "../headers/AuthHeader/AuthHeader";
import Footer from "../Footer/Footer";

interface UnauthLayoutProps {
    children: ReactNode;
}

const UnauthLayout: React.FC<UnauthLayoutProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user.user);

    const isAuth = !!user?.email_confirmed

    return (
        <div className='content'>
            <AuthHeader />
            <main>{children}</main>
            <Footer></Footer>
        </div>
    );
};

export default UnauthLayout;
