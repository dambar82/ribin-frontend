import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
    children: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.user);

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
