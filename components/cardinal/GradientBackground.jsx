"use client";

import React, { useEffect, useRef } from "react";
import { Gradient } from "./Gradient";
import { useTheme } from "next-themes";

const GradientBackground = () => {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0); // Ref to store rotation angle
  const scrollYRef = useRef(0); // Ref to store the scroll position

  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;

    const dpr = window.devicePixelRatio || 1; // Account for high-DPI screens
    const scaleFactor = 0.1; // Render at 50% of the screen resolution

    const width = window.innerWidth * scaleFactor * dpr;
    const height = window.innerHeight * scaleFactor * dpr;

    canvas.width = width;
    canvas.height = height;

    // Use CSS to stretch the canvas to full-screen
    canvas.style.width = "1800px";
    canvas.style.height = "1800px";

    // Initialize the gradient
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");

    // ** 1. Continuous rotation and scale logic **
    const animateRotation = () => {
      rotationRef.current += 0.05; // Self-rotation speed (increase this for faster rotation)
      const scrollRotation = scrollYRef.current * 0.1; // Scroll-based rotation
      const scrollY = scrollYRef.current;

      // ** Scroll-based scaling logic **
      const scaleFactor = 1 + scrollY * 0.001; // Scale grows as the user scrolls (customizable)

      // ** Transform the canvas **
      canvas.style.transform = `
        rotate(${rotationRef.current + scrollRotation}deg)
        translateY(${scrollY * 0.5}px) 
        scale(${scaleFactor})
      `;

      requestAnimationFrame(animateRotation); // Run continuously
    };
    animateRotation(); // Start animation

    // ** 2. Scroll event logic **
    const handleScroll = () => {
      scrollYRef.current = window.scrollY; // Store the scroll position
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme]);

  return (
    <div className="flex justify-center blur-3xl fixed z-[-1]">
      <canvas
        id="gradient-canvas"
        ref={canvasRef}
        data-transition-in
        style={{
          height: "100%",
          width: "100%",
          clipPath:
            "polygon(50% 10%, 60% 40%, 90% 50%, 60% 60%, 50% 90%, 40% 60%, 10% 50%, 40% 40%)",
          transform: "rotate(0deg)", // Initial rotation
        }}
      />
    </div>
  );
};

export default GradientBackground;
