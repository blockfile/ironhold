import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function ScrambleText({ text, intervalMs = 28, revealStep = 0.68, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return undefined;

    if (reduceMotion) {
      setDisplay(text);
      setDone(true);
      return undefined;
    }

    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      const revealIndex = Math.floor(step * revealStep);

      const next = text
        .split("")
        .map((char, index) => {
          if (!/[A-Za-z0-9]/.test(char)) return char;
          return index <= revealIndex ? char : randomGlyph();
        })
        .join("");

      setDisplay(next);

      if (revealIndex >= text.length) {
        setDisplay(text);
        setDone(true);
        window.clearInterval(timer);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [inView, intervalMs, reduceMotion, revealStep, text]);

  return (
    <span
      ref={ref}
      className={`ih-scramble ${done ? "is-done" : ""} ${className}`.trim()}
      aria-label={text}
    >
      <span className="ih-scrambleSizer" aria-hidden="true">{text}</span>
      <span className="ih-scrambleLive" aria-hidden="true">{display}</span>
    </span>
  );
}
