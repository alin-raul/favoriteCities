"use client";

import { useInView } from "react-intersection-observer";

const LazyLoad = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger only once when the component is in view
    threshold: 0.1, // 10% of the component needs to be visible
  });

  return (
    <div ref={ref}>
      {inView ? children : null} {/* Only render when in view */}
    </div>
  );
};

export default LazyLoad;
