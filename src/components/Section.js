import React from "react";
import { motion } from "framer-motion";
import { rise, riseSoft, viewport } from "../lib/motion";

export default function Section({ id, tone = "black", eyebrow, title, titleClassName = "", children }) {
  const renderedTitle = typeof title === "string" && titleClassName
    ? <span className={`ih-sectionTitleText ${titleClassName}`.trim()}>{title}</span>
    : title;

  return (
    <motion.section
      id={id}
      className={`ih-section ih-section--${tone}`}
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <div className="ih-container">
        <motion.div className="ih-sectionTop" variants={riseSoft}>
          <div className="ih-sectionBeam" aria-hidden="true" />
          <div className="ih-eyebrow">{eyebrow}</div>
          <h2 className="ih-h2">{renderedTitle}</h2>
        </motion.div>
        <motion.div className="ih-sectionBody" variants={riseSoft}>
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}
