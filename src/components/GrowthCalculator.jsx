import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { popIn, riseSoft, stagger, viewport } from "../lib/motion";

const APY_PERCENT = 10000;
const CYCLES_PER_DAY = 48;
const CYCLES_PER_YEAR = 365 * CYCLES_PER_DAY;
const ANNUAL_MULTIPLIER = 1 + APY_PERCENT / 100;
const PER_CYCLE_RATE = Math.pow(ANNUAL_MULTIPLIER, 1 / CYCLES_PER_YEAR) - 1;

function parsePositiveNumber(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(parsed, 0);
}

function formatNumber(value, maxDigits = 2) {
  if (!Number.isFinite(value)) return "Overflow";
  if (Math.abs(value) >= 1e15) return value.toExponential(2);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: maxDigits }).format(value);
}

export default function GrowthCalculator() {
  const [startingBalance, setStartingBalance] = useState("1000");
  const [projectionYears, setProjectionYears] = useState("1");

  const metrics = useMemo(() => {
    const principal = parsePositiveNumber(startingBalance);
    const years = parsePositiveNumber(projectionYears);
    const projectedBalance = principal * Math.pow(1 + PER_CYCLE_RATE, Math.round(years * CYCLES_PER_YEAR));
    const netTokenGrowth = projectedBalance - principal;
    const growthMultiple = principal > 0 ? projectedBalance / principal : 0;

    return {
      projectedBalance,
      netTokenGrowth,
      growthMultiple
    };
  }, [projectionYears, startingBalance]);

  return (
    <motion.div
      className="ih-calcWrap"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <div className="ih-calcDecor" aria-hidden="true">
        <span className="ih-calcBeam ih-calcBeam--a" />
        <span className="ih-calcBeam ih-calcBeam--b" />
        <span className="ih-calcDot ih-calcDot--a" />
        <span className="ih-calcDot ih-calcDot--b" />
      </div>

      <motion.div className="ih-calcCopy" variants={popIn}>
        <motion.div className="ih-calcMetaTitle" variants={riseSoft}>
          Ironhold Growth Projection Calculator
        </motion.div>
        <motion.h3 className="ih-calcHeadline" variants={riseSoft}>
          Model Your $IHOLD Balance
        </motion.h3>
        <motion.p className="ih-calcSubhead" variants={riseSoft}>
          Quick projection based on 30-minute proportional distribution mechanics.
        </motion.p>

        <div className="ih-calcPills" aria-label="Core mechanics">
          <span>Fixed total supply</span>
          <span>30-minute distribution cycles</span>
          <span>Proportional redistribution</span>
        </div>

        <ul className="ih-calcKeyList">
          <li>Compounding updates every 30 minutes.</li>
          <li>Rewards are token-denominated, not USD-guaranteed.</li>
          <li>No inflationary minting or rebasing model.</li>
        </ul>
      </motion.div>

      <motion.aside className="ih-calcPanel" aria-label="Ironhold growth projection calculator" variants={popIn}>
        <div className="ih-calcPanelHeader">
          <div>
            <div className="ih-calcPanelTitle">Projection Inputs</div>
            <div className="ih-calcPanelRate">APY Assumption: 10,000%</div>
          </div>
        </div>

        <div className="ih-calcInputGrid">
          <label className="ih-calcField">
            <span>Starting $IHOLD balance</span>
            <input
              type="number"
              min="0"
              step="1"
              value={startingBalance}
              onChange={(event) => setStartingBalance(event.target.value)}
            />
          </label>

          <label className="ih-calcField">
            <span>Projection horizon (years)</span>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={projectionYears}
              onChange={(event) => setProjectionYears(event.target.value)}
            />
          </label>
        </div>

        <motion.div
          className="ih-calcStat ih-calcStat--hero"
          whileHover={{ y: -2, scale: 1.005 }}
          transition={{ duration: 0.45, ease: [0.2, 0.75, 0.2, 1] }}
        >
          <div className="ih-calcStatLabel">Projected $IHOLD balance</div>
          <div className="ih-calcStatValue">{formatNumber(metrics.projectedBalance, 4)}</div>
        </motion.div>

        <div className="ih-calcStatsGrid">
          <motion.div
            className="ih-calcStat"
            whileHover={{ y: -2, scale: 1.005 }}
            transition={{ duration: 0.45, ease: [0.2, 0.75, 0.2, 1] }}
          >
            <div className="ih-calcStatLabel">Net token growth</div>
            <div className="ih-calcStatValue">{formatNumber(metrics.netTokenGrowth, 4)}</div>
          </motion.div>
          <motion.div
            className="ih-calcStat"
            whileHover={{ y: -2, scale: 1.005 }}
            transition={{ duration: 0.45, ease: [0.2, 0.75, 0.2, 1] }}
          >
            <div className="ih-calcStatLabel">Growth multiple</div>
            <div className="ih-calcStatValue">{formatNumber(metrics.growthMultiple, 4)}x</div>
          </motion.div>
        </div>

        <div className="ih-calcFormula">
          <span>Per-cycle rate:</span> {formatNumber(PER_CYCLE_RATE * 100, 6)}%
        </div>
      </motion.aside>

    </motion.div>
  );
}
