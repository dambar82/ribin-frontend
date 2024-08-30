import React, { ReactNode } from 'react';
import RestoreHeader from "../headers/RestoreHeader/RestoreHeader";

interface UnauthLayoutProps {
    children: ReactNode;
}

const RestoreLayout: React.FC<UnauthLayoutProps> = ({ children }) => {
    return (
        <div style={{ padding: '0 20px' }} >
            <RestoreHeader/>
            <main>{children}</main>
        </div>
    );
};

export default RestoreLayout;