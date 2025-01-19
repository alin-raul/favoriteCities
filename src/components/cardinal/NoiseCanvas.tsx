"use client";

import React, { useEffect, useRef } from "react";

interface NoiseCanvasProps {
  children: React.ReactNode;
  color?: string;
}

const NoiseCanvas: React.FC<NoiseCanvasProps> = ({
  children,
  color = "rgba(255, 255, 255, 0.1)",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
  };

  const generateNoise = (ctx: CanvasRenderingContext2D, color: string) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const iData = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(iData.data.buffer);
    const len = buffer32.length;

    const [r, g, b, a] = color
      .replace(/[^\d,]/g, "")
      .split(",")
      .map((val) => parseFloat(val.trim()));

    for (let i = 0; i < len; i++) {
      const noiseValue = Math.random() < 0.5 ? 1 : 0;
      const noiseColor =
        noiseValue === 1 ? (r << 24) | (g << 16) | (b << 8) | (a * 255) : 0;

      buffer32[i] = noiseColor;
    }

    ctx.putImageData(iData, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const loop = () => {
      generateNoise(ctx, color);
      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color]);

  return (
    <div style={{ position: "fixed", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", zIndex: 1, opacity: "0.1" }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};

export default NoiseCanvas;
