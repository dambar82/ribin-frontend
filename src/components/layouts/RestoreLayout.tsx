import React, { ReactNode } from 'react';
import RestoreHeader from "../headers/RestoreHeader/RestoreHeader";

interface UnauthLayoutProps {
    children: ReactNode;
}

const RestoreLayout: React.FC<UnauthLayoutProps> = ({ children }) => {
    return (
        <div className='content__restore'>
            <RestoreHeader/>
            <main>{children}</main>
        </div>
    );
};

export default RestoreLayout;