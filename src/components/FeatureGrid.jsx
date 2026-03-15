import React from "react";
import { motion } from "framer-motion";
import { popIn, stagger, viewport } from "../lib/motion";

const features = [
  {
    title: "Fixed-Supply Core",
    desc: "Designed with 1B total supply and no minting, rebasing, or inflation-based emissions.",
    tag: "Core / 01",
    metric: "1B fixed"
  },
  {
    title: "30-Min Cycle Engine",
    desc: "Distribution cadence runs every 30 minutes with proportional allocation across holders.",
    tag: "Cadence / 02",
    metric: "48/day"
  },
  {
    title: "Flow-Driven Rewards",
    desc: "Reward mechanics depend on token flow and participation, not artificial supply expansion.",
    tag: "Rewards / 03",
    metric: "Proportional"
  },
  {
    title: "10% Liquidity Tax",
    desc: "Buy/sell tax is directed to strengthen liquidity and improve long-term market depth.",
    tag: "Liquidity / 04",
    metric: "10% tx"
  },
  {
    title: "LP Ratio Targeting",
    desc: "Framework targets roughly 12% LP-to-market-cap to support steadier price behavior.",
    tag: "Depth / 05",
    metric: "~12% LP"
  },
  {
    title: "No Lockup Access",
    desc: "Holders retain control of tokens while participating in ongoing reward mechanics.",
    tag: "Access / 06",
    metric: "Unlocked"
  }
];

export default function FeatureGrid() {
  return (
    <motion.div
      className="ih-grid"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {features.map((f) => {
        return (
          <motion.div
            className="ih-card"
            key={f.title}
            variants={popIn}
            whileHover={{ y: -4, scale: 1.005 }}
            transition={{ duration: 0.45, ease: [0.2, 0.75, 0.2, 1] }}
          >
            <div className="ih-cardHead">
              <span className="ih-cardTag">{f.tag}</span>
              <span className="ih-cardMetric">{f.metric}</span>
            </div>

            <div className="ih-cardIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="ih-icon">
                <path
                  d="M7 11h10M7 15h6M9 3h6l2 4H7l2-4Zm-2 6h10v12H7V9Z"
                  fill="none"
                  stroke="rgba(214,220,227,0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="ih-cardTitle">
              <span className="ih-goldTextStrong">{f.title}</span>
            </div>
            <div className="ih-cardDesc">{f.desc}</div>
            <div className="ih-cardLine" />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
