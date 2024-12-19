"use client";

import React, { useEffect, useRef } from "react";

const NoiseCanvas = ({ children, color = "rgba(255, 255, 255, 0.1)" }) => {
  const canvasRef = useRef(null);

  // Function to resize the canvas based on window dimensions
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
  };

  // Function to generate and render noise on the canvas
  const generateNoise = (ctx, color) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const iData = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(iData.data.buffer);
    const len = buffer32.length;

    // Parse the color into RGBA values
    const [r, g, b, a] = color
      .replace(/[^\d,]/g, "")
      .split(",")
      .map((val) => parseFloat(val.trim()));

    for (let i = 0; i < len; i++) {
      // Randomly generate noise
      const noiseValue = Math.random() < 0.5 ? 1 : 0; // Black or Transparent

      // Create the noise color with opacity
      const noiseColor =
        noiseValue === 1
          ? (r << 24) | (g << 16) | (b << 8) | (a * 255) // Apply opacity to alpha channel
          : 0;

      buffer32[i] = noiseColor;
    }

    ctx.putImageData(iData, 0, 0);
  };

  // useEffect hook to run when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set initial canvas size
    resizeCanvas();

    // Set up window resize listener to adjust canvas size
    window.addEventListener("resize", resizeCanvas);

    // Function to continuously update the noise on the canvas
    const loop = () => {
      generateNoise(ctx, color);
      requestAnimationFrame(loop);
    };

    // Start the loop
    loop();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color]); // Re-run when color prop changes

  return (
    <div style={{ position: "fixed", width: "100%", height: "100%" }}>
      {/* Canvas element for noise */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", zIndex: 1, opacity: "0.1" }}
      />

      {/* Children elements */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};

export default NoiseCanvas;
