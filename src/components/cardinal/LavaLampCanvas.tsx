"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type Colors = {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
};

const LavaLampCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  const [colors, setColors] = useState<Colors>({
    color1: theme.theme === "dark" ? "#3730cc" : "#c29dff",
    color2: theme.theme === "dark" ? "#000000" : "#fff",
    color3: theme.theme === "dark" ? "#cb6ad8" : "#a2c6fc",
    color4: theme.theme === "dark" ? "#000000" : "#fff",
  });

  useEffect(() => {
    setColors({
      color1: theme.theme === "dark" ? "#3730cc" : "#c29dff",
      color2: theme.theme === "dark" ? "#000000" : "#fff",
      color3: theme.theme === "dark" ? "#cb6ad8" : "#a2c6fc",
      color4: theme.theme === "dark" ? "#000000" : "#fff",
    });
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");

    if (!c) return;

    const imgSize = 512;
    const mapSize = 1024;

    canvas.width = imgSize;
    canvas.height = imgSize;
    const scaleFactor = 2;

    const image = c.createImageData(imgSize, imgSize);
    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = 0;
      image.data[i + 1] = 0;
      image.data[i + 2] = 0;
      image.data[i + 3] = 255;
    }

    const distance = (x: number, y: number) => Math.sqrt(x * x + y * y);

    const heightMap1: number[] = [];
    for (let u = 0; u < mapSize; u++) {
      for (let v = 0; v < mapSize; v++) {
        const i = u * mapSize + v;
        const cx = u - mapSize / 2;
        const cy = v - mapSize / 2;
        const d = distance(cx, cy);
        const stretch = (3 * Math.PI) / (mapSize / 2);
        const ripple = Math.sin(d * stretch);
        const normalized = (ripple + 1) / 2;
        heightMap1[i] = Math.floor(normalized * 128);
      }
    }

    const heightMap2: number[] = [];
    for (let u = 0; u < mapSize; u++) {
      for (let v = 0; v < mapSize; v++) {
        const i = u * mapSize + v;
        const cx = u - mapSize / 2;
        const cy = v - mapSize / 2;
        const d1 = distance(0.8 * cx, 1.3 * cy) * 0.022;
        const d2 = distance(1.35 * cx, 0.45 * cy) * 0.022;
        const s = Math.sin(d1);
        const c = Math.cos(d2);
        const h = s + c;
        const normalized = (h + 2) / 4;
        heightMap2[i] = Math.floor(normalized * 127);
      }
    }

    const interpolate = (
      c1: { r: number; g: number; b: number },
      c2: { r: number; g: number; b: number },
      f: number
    ) => {
      return {
        r: Math.floor(c1.r + (c2.r - c1.r) * f),
        g: Math.floor(c1.g + (c2.g - c1.g) * f),
        b: Math.floor(c1.b + (c2.b - c1.b) * f),
      };
    };

    // Convert hex color to RGB object
    const hexToRgb = (hex: string) => {
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      };
    };

    // Create gradient with 4 defined colors
    const makeGradient = (
      c1: { r: number; g: number; b: number },
      c2: { r: number; g: number; b: number },
      c3: { r: number; g: number; b: number },
      c4: { r: number; g: number; b: number }
    ) => {
      const g: { r: number; g: number; b: number }[] = [];
      for (let i = 0; i < 64; i++) {
        const f = i / 64;
        g[i] = interpolate(c1, c2, f);
      }
      for (let i = 64; i < 128; i++) {
        const f = (i - 64) / 64;
        g[i] = interpolate(c2, c3, f);
      }
      for (let i = 128; i < 192; i++) {
        const f = (i - 128) / 64;
        g[i] = interpolate(c3, c4, f);
      }
      for (let i = 192; i < 256; i++) {
        const f = (i - 192) / 64;
        g[i] = interpolate(c4, c4, f); // Loop back to c4
      }
      return g;
    };

    const color1Rgb = hexToRgb(colors.color1);
    const color2Rgb = hexToRgb(colors.color2);
    const color3Rgb = hexToRgb(colors.color3);
    const color4Rgb = hexToRgb(colors.color4);

    const palette = makeGradient(color1Rgb, color2Rgb, color3Rgb, color4Rgb);

    let dx1 = 0;
    let dy1 = 0;
    let dx2 = 0;
    let dy2 = 0;

    const moveHeightMaps = (t: number) => {
      const timeFactor = 0.00004;

      dx1 = Math.floor(
        (((Math.cos(t * timeFactor + 0.4 + Math.PI) + 1) / 2) * mapSize) / 2
      );
      dy1 = Math.floor(
        (((Math.cos(t * timeFactor - 0.1) + 1) / 2) * mapSize) / 2
      );
      dx2 = Math.floor(
        (((Math.cos(t * -timeFactor + 1.2) + 1) / 2) * mapSize) / 2
      );
      dy2 = Math.floor(
        (((Math.cos(t * -timeFactor - 0.8 + Math.PI) + 1) / 2) * mapSize) / 2
      );
    };

    const updateImageData = () => {
      for (let u = 0; u < imgSize; u++) {
        for (let v = 0; v < imgSize; v++) {
          const i = (u + dy1) * mapSize + (v + dx1);
          const k = (u + dy2) * mapSize + (v + dx2);
          const j = u * imgSize * 4 + v * 4;
          let h = heightMap1[i] + heightMap2[k];
          let c = palette[h];
          image.data[j] = c.r;
          image.data[j + 1] = c.g;
          image.data[j + 2] = c.b;
        }
      }
    };

    const tick = (time: number) => {
      moveHeightMaps(time);
      updateImageData();
      c.putImageData(image, 0, 0);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      // Cleanup if necessary
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", padding: 0, margin: 0 }}
    />
  );
};

export default LavaLampCanvas;
