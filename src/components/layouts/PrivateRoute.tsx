import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.user);

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;