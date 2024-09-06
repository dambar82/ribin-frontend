import UnauthHeader from "../headers/UnauthHeader/UnauthHeader";
import React, { ReactNode } from 'react';

interface UnauthLayoutProps {
    children: ReactNode;
}

const UnauthLayoutRegister: React.FC<UnauthLayoutProps> = ({ children }) => {

    return (
        <div className='content'>
            <UnauthHeader />
            <main>{children}</main>
        </div>
    );
};

export default UnauthLayoutRegister;