import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import FeatureGrid from "./components/FeatureGrid";
import GrowthCalculator from "./components/GrowthCalculator";
import ProtocolSnapshot from "./components/ProtocolSnapshot";
import WhitepaperIntelligence from "./components/WhitepaperIntelligence";
import ScrambleText from "./components/ScrambleText";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import ForgeScene from "./components/ForgeScene";
import PresalePage from "./components/PresalePage";
import RewardsPage from "./components/RewardsPage";
import { popIn, riseSoft, stagger, viewport } from "./lib/motion";
import coinImage from "./components/assets/images/coin.png";

const IS_PRESALE = window.location.pathname === "/presale";
const IS_REWARDS = window.location.pathname === "/rewards";

const LOADER_DURATION_MS = 4000;
const LOADER_EXIT_MS = 420;

export default function App() {
  if (IS_PRESALE) return <PresalePage />;
  if (IS_REWARDS) return <RewardsPage />;
  return <MainApp />;
}

function MainApp() {
  const [loaderPhase, setLoaderPhase] = useState("active");
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const exitTimerId = window.setTimeout(() => {
      setLoaderPhase("exiting");
    }, LOADER_DURATION_MS);

    const revealTimerId = window.setTimeout(() => {
      setShowApp(true);
      setLoaderPhase("hidden");
    }, LOADER_DURATION_MS + LOADER_EXIT_MS);

    return () => {
      window.clearTimeout(exitTimerId);
      window.clearTimeout(revealTimerId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showApp ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showApp]);

  return (
    <>
      {loaderPhase !== "hidden" ? (
        <LoadingScreen durationMs={LOADER_DURATION_MS} isExiting={loaderPhase === "exiting"} />
      ) : null}

      {showApp ? (
        <div className="ih-app">
          <ForgeScene />
          <div className="ih-bgNoise" aria-hidden="true" />
          <div className="ih-bgOverlay" aria-hidden="true" />
          <Navbar />
          <main>
            <Hero />

            <Section
              id="calculator"
              tone="gunmetal"
              eyebrow="CALCULATOR"
              titleClassName="ih-goldTextStrong"
              title="Mechanics-first projection model."
            >
              <GrowthCalculator />
              <div className="ih-calcSnapshotWrap">
                <ProtocolSnapshot />
              </div>
            </Section>

            <Section
              id="whitepaper"
              tone="steel"
              eyebrow="WHITEPAPER"
              titleClassName="ih-goldTextStrong"
              title="Whitepaper"
            >
              <WhitepaperIntelligence />
            </Section>

            <Section
              id="foundation"
              tone="gunmetal"
              eyebrow="FOUNDATION"
              title={
                <ScrambleText
                  text="Infrastructure-grade presence."
                  className="ih-foundationScramble ih-foundationScramble--gold"
                />
              }
            >
              <div className="ih-foundationCopy">
                <p className="ih-body">
                  Ironhold is designed to feel like a private capital interface - calm, engineered, and permanent. No
                  hype. No noise. Just structure.
                </p>
                <p className="ih-body ih-foundationBodySecondary">
                  Every surface is meant to feel deliberate: restrained motion, vault-like spacing, and a visual tone
                  that suggests durability over spectacle.
                </p>
              </div>
              <img className="ih-foundationCoin" src={coinImage} alt="" aria-hidden="true" />
            </Section>

            <Section
              id="capabilities"
              tone="steel"
              eyebrow="CAPABILITIES"
              titleClassName="ih-goldTextStrong"
              title="Built like a vault UI."
            >
              <FeatureGrid />
            </Section>

            <Section
              id="data"
              tone="gunmetal"
              eyebrow="DATA"
              titleClassName="ih-goldTextStrong"
              title="Minimal. Terminal-like. Controlled."
            >
              <motion.div
                className="ih-dataPanel"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
              >
                <div className="ih-dataHeader">
                  <span className="ih-chip">Stability Index</span>
                  <span className="ih-chip">Protocol Health</span>
                  <span className="ih-chip">$IHOLD</span>
                </div>

                <motion.div className="ih-miniChart" aria-label="Decorative chart" variants={riseSoft}>
                  <svg viewBox="0 0 900 220" className="ih-svg">
                    <path
                      d="M20 160 C 110 140, 180 175, 260 150 S 410 120, 520 130 S 690 155, 820 95"
                      fill="none"
                      stroke="rgba(214,220,227,0.75)"
                      strokeWidth="1"
                    />
                    <path
                      d="M20 185 C 140 165, 220 205, 330 175 S 520 150, 640 160 S 760 175, 870 135"
                      fill="none"
                      stroke="rgba(159,168,178,0.45)"
                      strokeWidth="1"
                    />
                    <line
                      x1="20"
                      y1="200"
                      x2="880"
                      y2="200"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  </svg>

                  <div className="ih-miniLabels">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                  </div>
                </motion.div>

                <div className="ih-dataFooter">
                  <motion.div className="ih-kpi" variants={popIn} whileHover={{ y: -4 }}>
                    <div className="ih-kpiLabel">Latency</div>
                    <div className="ih-kpiValue">low</div>
                  </motion.div>
                  <motion.div className="ih-kpi" variants={popIn} whileHover={{ y: -4 }}>
                    <div className="ih-kpiLabel">Volatility</div>
                    <div className="ih-kpiValue">controlled</div>
                  </motion.div>
                  <motion.div className="ih-kpi" variants={popIn} whileHover={{ y: -4 }}>
                    <div className="ih-kpiLabel">Integrity</div>
                    <div className="ih-kpiValue">high</div>
                  </motion.div>
                </div>
              </motion.div>
            </Section>
          </main>

          <Footer />
        </div>
      ) : null}
    </>
  );
}

