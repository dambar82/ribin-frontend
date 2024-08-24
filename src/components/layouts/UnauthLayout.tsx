import React, { ReactNode } from "react";
import UnauthHeader from "../headers/UnauthHeader/UnauthHeader";

interface UnauthLayoutProps {
  children: ReactNode;
}

const UnauthLayout: React.FC<UnauthLayoutProps> = ({ children }) => {
  return (
    <div className="content">
      <UnauthHeader />
      <main>{children}</main>
    </div>
  );
};

export default UnauthLayout;
