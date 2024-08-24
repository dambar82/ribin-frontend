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
      </div>
      <main>{children}</main>
      {/* <div className={`content`}> */}
      <Footer></Footer>
      {/* </div> */}
    </div>
  );
};

export default MainAuthorizedLayout;
