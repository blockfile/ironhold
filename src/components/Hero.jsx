import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { riseSoft, stagger } from "../lib/motion";
import owlMascot from "./assets/images/owl.png";

export default function Hero() {
  const sectionRef = useRef(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ghost = ghostRef.current;
    if (!section || !ghost) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let ticking = false;

    const updateParallax = () => {
      ticking = false;

      if (reducedMotion.matches) {
        ghost.style.transform = "translate3d(0, -102px, 0) scale(1)";
        ghost.style.opacity = "";
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.max(-1, Math.min(1, (viewportHeight * 0.5 - rect.top) / viewportHeight));
      const translateY = -102 + (progress * 54);
      const scale = 1 + (Math.max(0, progress) * 0.035);
      const opacity = 0.96 - (Math.max(0, progress) * 0.08);

      ghost.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      ghost.style.opacity = String(opacity);
    };

    const queueParallax = () => {
      if (ticking) return;

      ticking = true;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", queueParallax, { passive: true });
    window.addEventListener("resize", queueParallax);

    return () => {
      window.removeEventListener("scroll", queueParallax);
      window.removeEventListener("resize", queueParallax);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section id="top" className="ih-hero" ref={sectionRef}>
      <div className="ih-heroRadial" aria-hidden="true" />
      <div className="ih-heroBackdrop" aria-hidden="true" />
      <div className="ih-heroBeams" aria-hidden="true">
        <span className="ih-heroBeam ih-heroBeam--a" />
        <span className="ih-heroBeam ih-heroBeam--b" />
      </div>
      <div className="ih-noise" aria-hidden="true" />
      <div className="ih-heroLogoGhost" aria-hidden="true" ref={ghostRef}>
        <img src={owlMascot} alt="" />
      </div>

      <div className="ih-container ih-heroGrid">
        <motion.div className="ih-heroLeft" variants={stagger} initial="hidden" animate="show">
          <motion.div className="ih-eyebrow" variants={riseSoft}>PRIVATE PROTOCOL INFRASTRUCTURE</motion.div>
          <motion.div className="ih-heroTitleBlock" variants={riseSoft}>
            <h1 className="ih-heroTitle ih-metalGradient ih-metalShine" data-text="IRONHOLD">
              IRONHOLD
            </h1>
            <span className="ih-slashAccent" aria-hidden="true" />
          </motion.div>
          <motion.p className="ih-heroStatement ih-heroStatement--thin" variants={riseSoft}>Built to Hold.</motion.p>
          <motion.p className="ih-heroStatement ih-heroStatement--heavy ih-metalGradient" variants={riseSoft}>
            Engineered for Stability.
          </motion.p>
          <motion.div className="ih-microline" variants={riseSoft} />
          <motion.p className="ih-body ih-heroNote" variants={riseSoft}>
            Fixed-supply mechanics, measured liquidity design, and transparent distribution logic for long-horizon
            structure.
          </motion.p>

          <motion.div className="ih-heroCtas" variants={riseSoft}>
            <button className="ih-btn ih-btn--primary">Buy $IHOLD</button>
            <button className="ih-btn ih-btn--secondary">Read Whitepaper</button>
          </motion.div>
        </motion.div>
      </div>

      <div className="ih-heroScrollCue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
