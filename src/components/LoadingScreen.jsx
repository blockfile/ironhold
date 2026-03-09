import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import owlMascot from "./assets/images/owl.png";

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

export default function LoadingScreen({ durationMs = 2400, isExiting = false }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const auraRings = useMemo(
    () => [
      { size: 300, top: "50%", left: "50%", delay: 0, duration: 2.8 },
      { size: 380, top: "48%", left: "53%", delay: 0.55, duration: 3.4 },
      { size: 340, top: "53%", left: "46%", delay: 1.05, duration: 3.1 },
      { size: 430, top: "50%", left: "50%", delay: 1.35, duration: 3.8 }
    ],
    []
  );
  const glowNodes = useMemo(
    () => [
      { size: 160, top: "46%", left: "43%", delay: 0.1, duration: 4.4 },
      { size: 220, top: "52%", left: "58%", delay: 0.85, duration: 5.2 },
      { size: 120, top: "58%", left: "49%", delay: 1.4, duration: 4.8 }
    ],
    []
  );

  useEffect(() => {
    const startedAt = window.performance.now();
    let frameId = 0;

    const tick = () => {
      const elapsed = window.performance.now() - startedAt;
      const next = Math.min(elapsed / durationMs, 1);
      setProgress(Math.round(easeOutCubic(next) * 100));

      if (next < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs]);

  return (
    <motion.div
      className="ih-loader"
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      animate={
        isExiting
          ? { opacity: 0, transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] } }
          : { opacity: 1 }
      }
    >
      <div className="ih-loaderAura" aria-hidden="true">
        {glowNodes.map((glow, index) => (
          <motion.span
            className="ih-loaderGlow"
            key={`glow-${index}`}
            style={{
              width: glow.size,
              height: glow.size,
              top: glow.top,
              left: glow.left
            }}
            animate={
              reduceMotion
                ? { opacity: 0.18 }
                : {
                    opacity: [0.1, 0.26, 0.12],
                    scale: [0.84, 1.12, 0.94],
                    x: [0, index % 2 === 0 ? -10 : 12, 0],
                    y: [0, index % 2 === 0 ? 12 : -10, 0]
                  }
            }
            transition={{
              duration: glow.duration,
              delay: glow.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {auraRings.map((ring, index) => (
          <motion.span
            className="ih-loaderRing"
            key={`ring-${index}`}
            style={{
              width: ring.size,
              height: ring.size,
              top: ring.top,
              left: ring.left
            }}
            animate={
              reduceMotion
                ? { opacity: 0.16, scale: 1 }
                : {
                    opacity: [0.08, 0.34, 0.1],
                    scale: [0.72, 1.06, 0.88],
                    borderColor: [
                      "rgba(215, 223, 232, 0.08)",
                      "rgba(215, 223, 232, 0.38)",
                      "rgba(184, 150, 84, 0.14)"
                    ]
                  }
            }
            transition={{
              duration: ring.duration,
              delay: ring.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="ih-loaderCore">
        <motion.img
          className="ih-loaderOwl"
          src={owlMascot}
          alt="Ironhold owl"
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [8, 0, 5], scale: [0.96, 1, 0.985] }}
          transition={reduceMotion ? { duration: 0.2 } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="ih-loaderMeta">
          <div className="ih-loaderLabel">Initializing Ironhold</div>
          <div className="ih-loaderBar" aria-hidden="true">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: Math.max(progress / 100, 0.02) }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="ih-loaderPercent">{progress}%</div>
        </div>
      </div>
    </motion.div>
  );
}
