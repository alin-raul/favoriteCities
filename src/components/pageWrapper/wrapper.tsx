import React, { ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
  className?: string;
};

const Wrapper: React.FC<WrapperProps> = ({ children, className = "" }) => {
  return <div className={`m-auto px-4 sm:px-4 ${className}`}>{children}</div>;
};

export default Wrapper;
