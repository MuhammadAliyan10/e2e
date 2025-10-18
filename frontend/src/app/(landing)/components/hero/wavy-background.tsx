"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);

  const [isSafari, setIsSafari] = useState(false);

  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: CanvasRenderingContext2D | null,
    canvas: HTMLCanvasElement | null;

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  // Responsive wave width based on screen size
  const getResponsiveWaveWidth = () => {
    if (typeof window === "undefined") return waveWidth || 50;

    const width = window.innerWidth;
    if (width < 640) {
      // Mobile
      return waveWidth ? waveWidth * 0.6 : 30;
    } else if (width < 1024) {
      // Tablet
      return waveWidth ? waveWidth * 0.8 : 40;
    } else {
      // Desktop
      return waveWidth || 50;
    }
  };

  // Responsive blur based on screen size
  const getResponsiveBlur = () => {
    if (typeof window === "undefined") return blur;

    const width = window.innerWidth;
    if (width < 640) {
      // Mobile
      return Math.max(blur * 0.7, 5);
    } else if (width < 1024) {
      // Tablet
      return Math.max(blur * 0.85, 7);
    } else {
      // Desktop
      return blur;
    }
  };

  // Responsive wave count based on screen size
  const getResponsiveWaveCount = () => {
    if (typeof window === "undefined") return 5;

    const width = window.innerWidth;
    if (width < 640) {
      // Mobile
      return 3;
    } else if (width < 1024) {
      // Tablet
      return 4;
    } else {
      // Desktop
      return 5;
    }
  };

  // Responsive noise scale based on screen size
  const getResponsiveNoiseScale = () => {
    if (typeof window === "undefined") return 800;

    const width = window.innerWidth;
    if (width < 640) {
      // Mobile
      return 400;
    } else if (width < 1024) {
      // Tablet
      return 600;
    } else {
      // Desktop
      return 800;
    }
  };

  // Responsive wave amplitude based on screen size
  const getResponsiveAmplitude = () => {
    if (typeof window === "undefined") return 100;

    const width = window.innerWidth;
    if (width < 640) {
      // Mobile
      return 60;
    } else if (width < 1024) {
      // Tablet
      return 80;
    } else {
      // Desktop
      return 100;
    }
  };

  const handleResize = useCallback(() => {
    if (!canvas || !ctx) return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Update canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
    w = newWidth;
    h = newHeight;

    // Update canvas style dimensions for proper display
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    // Apply responsive blur
    const responsiveBlur = getResponsiveBlur();
    ctx.filter = `blur(${responsiveBlur}px)`;

    // Update state
  }, []);

  const init = useCallback(() => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial dimensions
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    // Apply responsive blur
    const responsiveBlur = getResponsiveBlur();
    ctx.filter = `blur(${responsiveBlur}px)`;

    nt = 0;

    // Add resize listener
    window.addEventListener("resize", handleResize);

    render();
  }, [handleResize]);

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const drawWave = (n: number) => {
    if (!ctx) return;

    nt += getSpeed();
    const responsiveWaveWidth = getResponsiveWaveWidth();
    const responsiveNoiseScale = getResponsiveNoiseScale();
    const responsiveAmplitude = getResponsiveAmplitude();

    // Responsive step size based on screen width
    const stepSize = w < 640 ? 8 : w < 1024 ? 6 : 5;

    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = responsiveWaveWidth;
      ctx.strokeStyle = waveColors[i % waveColors.length];

      for (x = 0; x < w; x += stepSize) {
        const y =
          noise(x / responsiveNoiseScale, 0.3 * i, nt) * responsiveAmplitude;
        ctx.lineTo(x, y + h * 0.5);
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    if (!ctx) return;

    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);

    const responsiveWaveCount = getResponsiveWaveCount();
    drawWave(responsiveWaveCount);

    animationIdRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    // Safari detection
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      init();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [init, handleResize]);

  // Handle orientation change on mobile devices
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        handleResize();
      }, 100); // Small delay to ensure proper dimensions after orientation change
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [handleResize]);

  return (
    <div
      className={cn(
        "h-screen w-full flex flex-col items-center justify-center relative overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          ...(isSafari ? { filter: `blur(${getResponsiveBlur()}px)` } : {}),
        }}
      />
      <div
        className={cn(
          "relative z-10 w-full h-full flex flex-col items-center justify-center",
          "px-4 sm:px-6 lg:px-8", // Responsive padding
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default WavyBackground;
