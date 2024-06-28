import React, {ReactNode} from 'react';
import MainUnauthorizedHeader from "../headers/MainUnauthorizedHeader/MainUnauthorizedHeader";
import Footer from "../Footer/Footer";

interface MainUnauthorizedLayoutProps {
    children: ReactNode;
}


const MainUnauthorizedLayout: React.FC<MainUnauthorizedLayoutProps> = ({children}) => {
    return (
        <div>
            <MainUnauthorizedHeader/>
            <main>{children}</main>
            <Footer></Footer>
        </div>
    );
};

export default MainUnauthorizedLayout;