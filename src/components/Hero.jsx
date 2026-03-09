import React from "react";
import { motion } from "framer-motion";
import { riseSoft, stagger } from "../lib/motion";
import owlMascot from "./assets/images/owl.png";

export default function Hero() {
  return (
    <section id="top" className="ih-hero">
      <div className="ih-heroRadial" aria-hidden="true" />
      <div className="ih-heroBackdrop" aria-hidden="true" />
      <div className="ih-heroBeams" aria-hidden="true">
        <span className="ih-heroBeam ih-heroBeam--a" />
        <span className="ih-heroBeam ih-heroBeam--b" />
      </div>
      <div className="ih-noise" aria-hidden="true" />
      <div className="ih-heroLogoGhost" aria-hidden="true">
        <img src={owlMascot} alt="" />
      </div>

      <div className="ih-container ih-heroGrid">
        <motion.div className="ih-heroLeft" variants={stagger} initial="hidden" animate="show">
          <motion.div className="ih-eyebrow" variants={riseSoft}>PRIVATE PROTOCOL INFRASTRUCTURE</motion.div>
          <motion.h1
            className="ih-heroTitle ih-metalGradient ih-metalShine"
            variants={riseSoft}
            data-text="IRONHOLD"
          >
            IRONHOLD
          </motion.h1>
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
