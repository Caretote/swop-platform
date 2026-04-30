"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({ value, duration = 1200, decimals = 0, prefix = "", suffix = "", className }: Props) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = display;
    const end = value;
    startRef.current = null;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
