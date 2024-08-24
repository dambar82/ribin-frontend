import React, { ReactNode } from "react";
import MainUnauthorizedHeader from "../headers/MainUnauthorizedHeader/MainUnauthorizedHeader";
import Footer from "../Footer/Footer";
import AuthHeader from "../headers/AuthHeader/AuthHeader";

interface MainAuthorizedLayoutProps {
  children: ReactNode;
}

const MainAuthorizedLayout: React.FC<MainAuthorizedLayoutProps> = ({
  children,
}) => {
  return (
    <div>
      <div className={`content`}>
        <AuthHeader />
        <main>{children}</main>
      </div>
      {/* <div className={`content`}> */}
      <Footer></Footer>
      {/* </div> */}
    </div>
  );
};

export default MainAuthorizedLayout;
