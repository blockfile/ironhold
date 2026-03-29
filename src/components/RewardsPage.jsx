import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/presale.css";
import "../styles/rewards.css";
import owlImg from "./assets/images/owl.png";
import coinImg from "./assets/images/logo.png";

// ── Particle config (same atmosphere as presale) ─────────────────────
const FLAMES = [
  { x: "4%",  delay: "0s",   dur: "2.4s", w: "26px", h: "68px"  },
  { x: "14%", delay: "1.1s", dur: "2.9s", w: "38px", h: "100px" },
  { x: "27%", delay: "0.5s", dur: "2.2s", w: "22px", h: "56px"  },
  { x: "41%", delay: "1.7s", dur: "2.7s", w: "32px", h: "84px"  },
  { x: "56%", delay: "0.3s", dur: "2.0s", w: "28px", h: "72px"  },
  { x: "70%", delay: "1.4s", dur: "3.1s", w: "42px", h: "110px" },
  { x: "82%", delay: "0.8s", dur: "2.5s", w: "24px", h: "62px"  },
  { x: "91%", delay: "2.0s", dur: "2.3s", w: "34px", h: "88px"  },
];
const SMOKES = [
  { x: "8%",  delay: "0.6s", dur: "5.5s", size: "52px" },
  { x: "30%", delay: "2.4s", dur: "6.8s", size: "68px" },
  { x: "55%", delay: "1.0s", dur: "5.2s", size: "58px" },
  { x: "78%", delay: "3.2s", dur: "7.0s", size: "48px" },
];
const EMBERS = [
  { x: "10%", delay: "0.4s", dur: "3.5s" },
  { x: "22%", delay: "1.8s", dur: "4.2s" },
  { x: "38%", delay: "0.9s", dur: "3.8s" },
  { x: "51%", delay: "2.6s", dur: "3.3s" },
  { x: "65%", delay: "1.2s", dur: "4.6s" },
  { x: "80%", delay: "0.2s", dur: "4.0s" },
  { x: "94%", delay: "2.1s", dur: "3.7s" },
];

const REWARD_RATE = 0.00026345; // 0.026345% per distribution
const INTERVAL_SECONDS = 30 * 60; // 30 minutes

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTokens(n) {
  if (!Number.isFinite(n) || n <= 0) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(n);
}

function formatUsd(n) {
  if (!Number.isFinite(n) || n <= 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(n);
}

// Derive seconds remaining in the current 30-min window, aligned to clock time
function getSecondsRemaining() {
  const now = Math.floor(Date.now() / 1000);
  return INTERVAL_SECONDS - (now % INTERVAL_SECONDS);
}

export default function RewardsPage() {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsRemaining);
  const [balance, setBalance]       = useState("");
  const [tokenPrice, setTokenPrice] = useState("");

  // Tick every second, re-sync to wall clock each cycle
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(getSecondsRemaining());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mins = pad(Math.floor(secondsLeft / 60));
  const secs = pad(secondsLeft % 60);

  // Progress 0→1 as time elapses within the 30-min window
  const progress = 1 - secondsLeft / INTERVAL_SECONDS;

  const parsedBalance   = useMemo(() => { const n = parseFloat(balance);     return Number.isFinite(n) && n > 0 ? n : 0; }, [balance]);
  const parsedPrice     = useMemo(() => { const n = parseFloat(tokenPrice);  return Number.isFinite(n) && n > 0 ? n : 0; }, [tokenPrice]);
  const nextReward      = useMemo(() => parsedBalance * REWARD_RATE,          [parsedBalance]);
  const nextRewardUsd   = useMemo(() => (parsedPrice ? nextReward * parsedPrice : 0), [nextReward, parsedPrice]);

  return (
    <div className="ih-presale ih-rewards">

      {/* ── Fire particles ── */}
      <div className="ih-pf" aria-hidden="true">
        <div className="ih-pfBase" />
        <div className="ih-pfLavaCrack" />
        {FLAMES.map((f, i) => (
          <div key={i} className="ih-pfFlame"
            style={{ "--x": f.x, "--delay": f.delay, "--dur": f.dur, "--w": f.w, "--h": f.h }} />
        ))}
        {SMOKES.map((s, i) => (
          <div key={i} className="ih-pfSmoke"
            style={{ "--x": s.x, "--delay": s.delay, "--dur": s.dur, "--size": s.size }} />
        ))}
        {EMBERS.map((e, i) => (
          <div key={i} className="ih-pfEmber"
            style={{ "--x": e.x, "--delay": e.delay, "--dur": e.dur }} />
        ))}
      </div>
      <div className="ih-bgNoise" aria-hidden="true" />

      {/* ── Owl ghost ── */}
      <div className="ih-presaleOwlGhost" aria-hidden="true">
        <img src={owlImg} alt="" />
      </div>

      {/* ── Header ── */}
      <header className="ih-presaleHeader">
        <div className="ih-container ih-presaleHeaderInner">
          <a href="/" className="ih-logo" aria-label="Back to Ironhold home">
            <span className="ih-logoMark">
              <picture>
                <source media="(max-width: 767px)" srcSet="/logo-mark.png" />
                <img className="ih-logoImage" src="/logo2.png" alt="Ironhold logo" width="72" height="72" />
              </picture>
            </span>
            <span className="ih-logoText">IRONHOLD</span>
          </a>
          <a href="/" className="ih-presaleBack">← Back to Home</a>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="ih-presaleMain">
        <motion.div
          className="ih-presaleInner"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Title ── */}
          <div className="ih-presaleTitleBlock">
            <div className="ih-presaleCoinWrap" aria-hidden="true">
              <div className="ih-presaleCoinGlow" />
              <img src={coinImg} alt="" className="ih-presaleCoin" />
            </div>
            <div className="ih-presaleEyebrow">Automated Distributions</div>
            <h1 className="ih-presaleTitle ih-goldTextStrong">$IHOLD REWARDS</h1>
            <p className="ih-presaleSubtitle">
              Holders earn <strong>0.026345%</strong> of their balance every 30 minutes, distributed automatically.
            </p>
          </div>

          {/* ── Timer panel ── */}
          <motion.div
            className="ih-presalePanel ih-rwTimerPanel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ih-rwTimerLabel ih-goldTextStrong">Next Reward Distribution In</div>

            <div className="ih-rwClock" aria-live="polite" aria-label={`${mins} minutes ${secs} seconds remaining`}>
              <span className="ih-rwClockDigits">{mins}</span>
              <span className="ih-rwClockColon">:</span>
              <span className="ih-rwClockDigits">{secs}</span>
            </div>

            {/* Progress bar */}
            <div className="ih-rwProgressTrack" aria-hidden="true">
              <div className="ih-rwProgressBar" style={{ width: `${progress * 100}%` }} />
            </div>

            <div className="ih-rwTimerNote">
              Rewards are distributed every 30 minutes around the clock.
            </div>
          </motion.div>

          {/* ── Calculator panel ── */}
          <motion.div
            className="ih-presalePanel ih-rwCalcPanel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ih-presalePanelHeader">
              <div className="ih-presalePanelTitle ih-goldTextStrong">Reward Calculator</div>
              <div className="ih-presalePanelSub">See exactly what you'll earn next distribution</div>
            </div>

            {/* Balance input */}
            <div className="ih-presaleField">
              <label className="ih-presaleFieldLabel" htmlFor="rw-balance">
                $IHOLD Balance
              </label>
              <div className="ih-presaleInputRow">
                <input
                  id="rw-balance"
                  className="ih-presaleInput"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  autoComplete="off"
                />
                <span className="ih-presaleInputUnit">$IHOLD</span>
              </div>
            </div>

            {/* Reward result */}
            <div className="ih-rwResultRow">
              <div className="ih-rwResultLabel">Next Reward</div>
              <div className="ih-rwResultValue">
                <span className={nextReward > 0 ? "ih-goldTextStrong" : "ih-presaleOutputEmpty"}>
                  {formatTokens(nextReward)}
                </span>
                {nextReward > 0 && <span className="ih-rwResultUnit">$IHOLD</span>}
              </div>
              {nextReward > 0 && (
                <div className="ih-rwResultSub">
                  = 0.026345% of your balance
                </div>
              )}
            </div>

            <div className="ih-presaleSep" aria-hidden="true" />

            {/* Price input */}
            <div className="ih-presaleField">
              <label className="ih-presaleFieldLabel" htmlFor="rw-price">
                $IHOLD Price (USD)
              </label>
              <div className="ih-presaleInputRow">
                <span className="ih-rwPricePrefix">$</span>
                <input
                  id="rw-price"
                  className="ih-presaleInput ih-rwPriceInput"
                  type="number"
                  min="0"
                  step="0.000001"
                  placeholder="0.0001"
                  value={tokenPrice}
                  onChange={(e) => setTokenPrice(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* USD reward result */}
            <div className="ih-rwResultRow">
              <div className="ih-rwResultLabel">Next Reward Value (USD)</div>
              <div className="ih-rwResultValue">
                <span className={nextRewardUsd > 0 ? "ih-goldTextStrong" : "ih-presaleOutputEmpty"}>
                  {nextRewardUsd > 0 ? formatUsd(nextRewardUsd) : "—"}
                </span>
              </div>
            </div>

            {/* Summary block */}
            {parsedBalance > 0 && (
              <motion.div
                className="ih-rwSummary"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="ih-rwSummaryRow">
                  <span>$IHOLD Balance</span>
                  <strong>{formatTokens(parsedBalance)}</strong>
                </div>
                <div className="ih-rwSummaryRow">
                  <span>Next Reward</span>
                  <strong className="ih-goldTextStrong">{formatTokens(nextReward)} $IHOLD</strong>
                </div>
                {parsedPrice > 0 && (
                  <div className="ih-rwSummaryRow">
                    <span>Next Reward Value</span>
                    <strong className="ih-goldTextStrong">{formatUsd(nextRewardUsd)}</strong>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          <div className="ih-presaleFootNote">
            © {new Date().getFullYear()} Ironhold. All rights reserved.
          </div>
        </motion.div>
      </main>
    </div>
  );
}
