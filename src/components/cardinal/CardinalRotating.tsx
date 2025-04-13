"use client";

import React, { useEffect, useRef, memo, useMemo } from "react";
import { useTheme } from "next-themes";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorPalette {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}

const mapSize = 2048;
const imgSize = 1024;

const useHeightMaps = () => {
  const heightMap1 = useMemo(() => {
    const map: number[] = [];
    const distance = (x: number, y: number) => Math.sqrt(x * x + y * y);
    for (let u = 0; u < mapSize; u++) {
      for (let v = 0; v < mapSize; v++) {
        const cx = u - mapSize / 2;
        const cy = v - mapSize / 2;
        const d = distance(cx, cy);
        const stretch = (3 * Math.PI) / (mapSize / 2);
        const ripple = Math.sin(d * stretch);
        const normalized = (ripple + 1) / 2;
        map[u * mapSize + v] = Math.floor(normalized * 128);
      }
    }
    return map;
  }, []);

  const heightMap2 = useMemo(() => {
    const map: number[] = [];
    const distance = (x: number, y: number) => Math.sqrt(x * x + y * y);
    for (let u = 0; u < mapSize; u++) {
      for (let v = 0; v < mapSize; v++) {
        const cx = u - mapSize / 2;
        const cy = v - mapSize / 2;
        const d1 = distance(0.8 * cx, 1.3 * cy) * 0.022;
        const d2 = distance(1.35 * cx, 0.45 * cy) * 0.022;
        const s = Math.sin(d1);
        const c = Math.cos(d2);
        const h = s + c;
        const normalized = (h + 2) / 4;
        map[u * mapSize + v] = Math.floor(normalized * 127);
      }
    }
    return map;
  }, []);

  return { heightMap1, heightMap2 };
};

const CardinalRotating: React.FC<{ invert: boolean; position: string }> = memo(
  ({ invert, position }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rotationRef = useRef<number>(0);
    const scrollYRef = useRef<number>(0);
    const { theme, resolvedTheme } = useTheme();
    const { heightMap1, heightMap2 } = useHeightMaps();

    const colors = useMemo<ColorPalette>(() => {
      const currentTheme =
        (theme === "system" ? resolvedTheme : theme) === "dark"
          ? "dark"
          : "light";
      return {
        color1: currentTheme === "dark" ? "#3730cc" : "#c29dff",
        color2: currentTheme === "dark" ? "#000000" : "#ffc99d",
        color3: currentTheme === "dark" ? "#79208f" : "#a2c6fc",
        color4: currentTheme === "dark" ? "#3730cc" : "#baabff",
      };
    }, [theme, resolvedTheme]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        canvasRef.current?.style?.setProperty("opacity", "1");
      }, 100);
      return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const image = ctx.createImageData(imgSize, imgSize);
      image.data.fill(0);
      image.data.forEach((_, i) => {
        if (i % 4 === 3) image.data[i] = 255;
      });

      // Color processing
      const hexToRgb = (hex: string): RGB => ({
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      });

      const interpolate = (c1: RGB, c2: RGB, f: number): RGB => ({
        r: Math.floor(c1.r + (c2.r - c1.r) * f),
        g: Math.floor(c1.g + (c2.g - c1.g) * f),
        b: Math.floor(c1.b + (c2.b - c1.b) * f),
      });

      const makeGradient = (c1: RGB, c2: RGB, c3: RGB, c4: RGB): RGB[] => {
        const g: RGB[] = [];
        for (let i = 0; i < 256; i++) {
          let c: RGB;
          if (i < 64) c = interpolate(c1, c2, i / 64);
          else if (i < 128) c = interpolate(c2, c3, (i - 64) / 64);
          else if (i < 192) c = interpolate(c3, c4, (i - 128) / 64);
          else c = interpolate(c4, c4, (i - 192) / 64);
          g.push(c);
        }
        return g;
      };

      const palette = makeGradient(
        hexToRgb(colors.color1),
        hexToRgb(colors.color2),
        hexToRgb(colors.color3),
        hexToRgb(colors.color4)
      );

      // Animation variables
      let dx1 = 0,
        dy1 = 0,
        dx2 = 0,
        dy2 = 0;
      let animationFrameId: number;
      let animationRotationId: number;

      const moveHeightMaps = (t: number) => {
        const timeFactor = invert ? -0.00004 : 0.00004;
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
            const h = heightMap1[i] + heightMap2[k];
            const c = palette[h];
            image.data.set([c.r, c.g, c.b, 255], j);
          }
        }
      };

      const tick = (time: number) => {
        moveHeightMaps(time);
        updateImageData();
        ctx.putImageData(image, 0, 0);
        animationFrameId = requestAnimationFrame(tick);
      };

      const animateRotation = () => {
        rotationRef.current += invert ? 0.02 : -0.02;
        const scrollRotation = scrollYRef.current * (invert ? -0.04 : 0.04);
        canvas.style.transform = `rotate(${
          rotationRef.current + scrollRotation
        }deg)`;
        animationRotationId = requestAnimationFrame(animateRotation);
      };

      // Start animations
      animationFrameId = requestAnimationFrame(tick);
      animationRotationId = requestAnimationFrame(animateRotation);

      // Scroll handler
      const handleScroll = () => (scrollYRef.current = window.scrollY);
      window.addEventListener("scroll", handleScroll);

      // Cleanup
      return () => {
        window.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(animationFrameId);
        cancelAnimationFrame(animationRotationId);
      };
    }, [colors, heightMap1, heightMap2, invert]);

    return (
      <div className={`blur-lg opacity-90 w-96 h-96 my-auto ${position}`}>
        <canvas
          ref={canvasRef}
          style={{
            height: "100%",
            width: "100%",
            clipPath:
              "polygon(50% 10%, 60% 40%, 90% 50%, 60% 60%, 50% 90%, 40% 60%, 10% 50%, 40% 40%)",
            transform: "rotate(0deg)",
            opacity: 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>
    );
  }
);

// --- FIX: Add this line ---
CardinalRotating.displayName = "CardinalRotating";
// ---------------------------

export default CardinalRotating;
