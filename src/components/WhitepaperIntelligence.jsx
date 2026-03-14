import React from "react";
import { motion } from "framer-motion";
import { popIn, riseSoft, stagger, viewport } from "../lib/motion";

const summaryCards = [
  {
    title: "Reward Mechanics",
    points: [
      "30-minute distribution cadence",
      "Proportional allocation by wallet size",
      "No lockups required for participation"
    ]
  },
  {
    title: "Supply & Liquidity",
    points: [
      "Fixed total supply: 1,000,000,000 $IHOLD",
      "No minting, no rebasing, no inflation",
      "10% buy/sell tax supports liquidity depth"
    ]
  },
  {
    title: "Risk Context",
    points: [
      "APY is token-denominated, not USD-guaranteed",
      "Market value remains supply-and-demand driven",
      "Mechanics are transparent, outcomes are variable"
    ]
  }
];

export default function WhitepaperIntelligence() {
  return (
    <motion.div className="ih-wpSummary" variants={stagger} initial="hidden" whileInView="show" viewport={viewport}>
      <motion.div className="ih-wpSummaryIntro" variants={popIn}>
        <motion.div className="ih-wpBadge" variants={riseSoft}>Whitepaper</motion.div>
        <motion.h3 className="ih-wpSummaryTitle" variants={riseSoft}>
          Protocol mechanics
        </motion.h3>
        <motion.p className="ih-wpLead" variants={riseSoft}>
          Ironhold is built around fixed-supply structure, proportional distribution, and liquidity-first design.
          This section keeps only the core points needed for fast evaluation.
        </motion.p>
      </motion.div>

      <motion.div className="ih-wpSummaryGrid" variants={stagger}>
        {summaryCards.map((card) => (
          <motion.article className="ih-wpSummaryCard" key={card.title} variants={popIn}>
            <h4>{card.title}</h4>
            <ul>
              {card.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>

      <motion.div className="ih-wpSummaryNotice" variants={popIn}>
        <p>
          This summary is informational and mechanics-focused. It does not represent guaranteed USD outcomes and is
          not financial advice.
        </p>
        <button className="ih-btn ih-btn--secondary" type="button">Read Full Whitepaper</button>
      </motion.div>
    </motion.div>
  );
}
