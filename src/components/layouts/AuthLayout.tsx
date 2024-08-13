import React, {ReactNode, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import AuthHeader from "../headers/AuthHeader/AuthHeader";
import Footer from "../Footer/Footer";


interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null; // или можно вернуть индикатор загрузки
    }

    return (<>
        <div className='content'>
            <AuthHeader></AuthHeader>
            <main>{children}</main>
        </div>
        <Footer />
    </>);
};

export default AuthLayout;