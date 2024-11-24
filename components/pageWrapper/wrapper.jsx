import React from "react";

const Wrapper = ({ children, className = "" }) => {
  return <div className={`m-auto px-4 sm:px-8 ${className}`}>{children}</div>;
};

export default Wrapper;
