"use client";

import { useInView } from "react-intersection-observer";
import React from "react";

interface LazyLoadProps {
  children: React.ReactNode; // Change this line
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return <div ref={ref}>{inView ? children : null}</div>;
};

export default LazyLoad;
