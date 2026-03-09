import React from "react";
import { motion } from "framer-motion";
import { popIn, viewport } from "../lib/motion";

export default function ProtocolSnapshot() {
  return (
    <motion.div
      className="ih-protocolSnapshot ih-heroPanel"
      variants={popIn}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <div className="ih-heroPanelTitle">Protocol Snapshot</div>

      <ul className="ih-heroPanelList ih-protocolList">
        <li>1,000,000,000 fixed total supply</li>
        <li>30-minute proportional distribution cadence</li>
        <li>Liquidity-first transaction routing model</li>
        <li>No lockups. No rebasing. No supply inflation.</li>
      </ul>

      <div className="ih-protocolMeta" aria-label="Model assumptions">
        <div className="ih-protocolMetaItem">
          <div className="ih-protocolMetaKey">Distribution Cadence</div>
          <div className="ih-protocolMetaValue">48 cycles per day</div>
        </div>
        <div className="ih-protocolMetaItem">
          <div className="ih-protocolMetaKey">Compounding Basis</div>
          <div className="ih-protocolMetaValue">Token-denominated growth</div>
        </div>
        <div className="ih-protocolMetaItem">
          <div className="ih-protocolMetaKey">Outcome Scope</div>
          <div className="ih-protocolMetaValue">Illustrative, not USD-guaranteed</div>
        </div>
      </div>
    </motion.div>
  );
}
