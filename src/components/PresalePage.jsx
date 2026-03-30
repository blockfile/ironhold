import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRESALE_CLOSED_LABEL, PRESALE_IS_OPEN } from "../lib/presale";
import "../styles/presale.css";
import owlImg from "./assets/images/owl.png";
import coinImg from "./assets/images/logo.png";

const FLAMES = [
  { x: "4%", delay: "0s", dur: "2.4s", w: "26px", h: "68px" },
  { x: "14%", delay: "1.1s", dur: "2.9s", w: "38px", h: "100px" },
  { x: "27%", delay: "0.5s", dur: "2.2s", w: "22px", h: "56px" },
  { x: "41%", delay: "1.7s", dur: "2.7s", w: "32px", h: "84px" },
  { x: "56%", delay: "0.3s", dur: "2.0s", w: "28px", h: "72px" },
  { x: "70%", delay: "1.4s", dur: "3.1s", w: "42px", h: "110px" },
  { x: "82%", delay: "0.8s", dur: "2.5s", w: "24px", h: "62px" },
  { x: "91%", delay: "2.0s", dur: "2.3s", w: "34px", h: "88px" },
];

const SMOKES = [
  { x: "8%", delay: "0.6s", dur: "5.5s", size: "52px" },
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

const PRESALE_WALLET = "DZppXmrs1zD2xXV7V3qPnqXqR1SJCK5j7MriNXA6x7tZ";
const TOTAL_SUPPLY = 1_000_000_000;
const MARKET_CAP_USD = 100_000;
const TOKEN_PRICE_USD = MARKET_CAP_USD / TOTAL_SUPPLY;

function formatNumber(value, decimals = 0) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals }).format(value);
}

function formatUsd(value) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function getPhantomProvider() {
  const provider = window?.phantom?.solana ?? window?.solana;
  return provider?.isPhantom ? provider : null;
}

export default function PresalePage() {
  const [solAmount, setSolAmount] = useState("");
  const [solPrice, setSolPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [txStatus, setTxStatus] = useState("idle");
  const [txSignature, setTxSignature] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!PRESALE_IS_OPEN) {
      setPriceLoading(false);
      return undefined;
    }

    let isActive = true;

    fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
      .then((response) => response.json())
      .then((data) => {
        if (isActive) setSolPrice(data?.solana?.usd ?? null);
      })
      .catch(() => {
        if (isActive) setSolPrice(null);
      })
      .finally(() => {
        if (isActive) setPriceLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const parsedSol = useMemo(() => {
    const amount = parseFloat(solAmount);
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }, [solAmount]);

  const usdValue = useMemo(() => {
    if (!parsedSol || !solPrice) return 0;
    return parsedSol * solPrice;
  }, [parsedSol, solPrice]);

  const iholdAmount = useMemo(() => {
    if (!usdValue) return 0;
    return usdValue / TOKEN_PRICE_USD;
  }, [usdValue]);

  const isSubmitting = txStatus === "connecting" || txStatus === "sending";
  const isPresaleClosed = !PRESALE_IS_OPEN;
  const showSuccessState = PRESALE_IS_OPEN && txStatus === "success";

  async function handleBuy() {
    setErrorMsg("");

    if (isPresaleClosed) {
      setTxStatus("idle");
      setErrorMsg("Presale is closed. Buying has been disabled.");
      return;
    }

    if (!parsedSol) {
      setErrorMsg("Please enter a valid SOL amount.");
      return;
    }

    const phantom = getPhantomProvider();
    if (!phantom) {
      window.open("https://phantom.app/", "_blank");
      setErrorMsg("Phantom wallet not found. Install Phantom and refresh the page.");
      return;
    }

    const web3 = window.solanaWeb3;
    if (!web3) {
      setErrorMsg("Solana SDK not loaded. Please refresh the page.");
      return;
    }

    try {
      setTxStatus("sending");

      const { publicKey: fromPubkey } = await phantom.connect();
      const rpcUrls = [
        "https://rpc.ankr.com/solana",
        "https://solana.publicnode.com",
        "https://api.mainnet-beta.solana.com",
      ];

      let connection;
      let blockhash;

      for (const url of rpcUrls) {
        try {
          const conn = new web3.Connection(url, "confirmed");
          const latestBlockhash = await conn.getLatestBlockhash();
          connection = conn;
          blockhash = latestBlockhash.blockhash;
          break;
        } catch {}
      }

      if (!connection) {
        throw new Error("Unable to reach Solana network. Please try again shortly.");
      }

      const lamports = Math.round(parsedSol * web3.LAMPORTS_PER_SOL);

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey,
          toPubkey: new web3.PublicKey(PRESALE_WALLET),
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const { signature } = await phantom.signAndSendTransaction(transaction);
      setTxSignature(signature);
      setTxStatus("success");
    } catch (error) {
      console.error(error);
      const isRejected =
        error?.code === 4001 ||
        error?.message?.toLowerCase().includes("user rejected") ||
        error?.message?.toLowerCase().includes("cancelled");

      setErrorMsg(
        isRejected ? "Transaction cancelled." : (error?.message || "Transaction failed. Please try again.")
      );
      setTxStatus("idle");
    }
  }

  const btnLabel = isPresaleClosed
    ? PRESALE_CLOSED_LABEL
    : txStatus === "sending"
      ? "Awaiting approval..."
      : "Buy $IHOLD";

  return (
    <div className="ih-presale">
      <div className="ih-pf" aria-hidden="true">
        <div className="ih-pfBase" />
        <div className="ih-pfLavaCrack" />
        {FLAMES.map((flame, index) => (
          <div
            key={index}
            className="ih-pfFlame"
            style={{ "--x": flame.x, "--delay": flame.delay, "--dur": flame.dur, "--w": flame.w, "--h": flame.h }}
          />
        ))}
        {SMOKES.map((smoke, index) => (
          <div
            key={index}
            className="ih-pfSmoke"
            style={{ "--x": smoke.x, "--delay": smoke.delay, "--dur": smoke.dur, "--size": smoke.size }}
          />
        ))}
        {EMBERS.map((ember, index) => (
          <div
            key={index}
            className="ih-pfEmber"
            style={{ "--x": ember.x, "--delay": ember.delay, "--dur": ember.dur }}
          />
        ))}
      </div>
      <div className="ih-bgNoise" aria-hidden="true" />

      <div className="ih-presaleOwlGhost" aria-hidden="true">
        <img src={owlImg} alt="" />
      </div>

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
          <a href="/" className="ih-presaleBack">&larr; Back to Home</a>
        </div>
      </header>

      <main className="ih-presaleMain">
        <motion.div
          className="ih-presaleInner"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ih-presaleTitleBlock">
            <div className="ih-presaleCoinWrap" aria-hidden="true">
              <div className="ih-presaleCoinGlow" />
              <img src={coinImg} alt="" className="ih-presaleCoin" />
            </div>

            <div className="ih-presaleEyebrow">{isPresaleClosed ? "Presale Closed" : "Limited Offering"}</div>
            <h1 className="ih-presaleTitle ih-goldTextStrong">IRONHOLD PRESALE</h1>
            <p className="ih-presaleSubtitle">
              {isPresaleClosed ? (
                <>The presale page remains available, but buying is now disabled.</>
              ) : (
                <>
                  Secure your <strong>$IHOLD</strong> allocation before public launch.
                </>
              )}
            </p>
          </div>

          <motion.div
            className="ih-presaleStats"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ih-presaleStat">
              <div className="ih-presaleStatLabel">Launch Market Cap</div>
              <div className="ih-presaleStatValue ih-goldTextStrong">$100,000</div>
            </div>
            <div className="ih-presaleStatDivider" aria-hidden="true" />
            <div className="ih-presaleStat">
              <div className="ih-presaleStatLabel">Total Supply</div>
              <div className="ih-presaleStatValue">1,000,000,000</div>
            </div>
            <div className="ih-presaleStatDivider" aria-hidden="true" />
            <div className="ih-presaleStat">
              <div className="ih-presaleStatLabel">Price per $IHOLD</div>
              <div className="ih-presaleStatValue">$0.0001</div>
            </div>
          </motion.div>

          <motion.div
            className="ih-presalePanel"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {showSuccessState ? (
                <motion.div
                  key="success"
                  className="ih-presaleSuccess"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ih-presaleSuccessIcon" aria-hidden="true">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <circle cx="28" cy="28" r="27" stroke="rgba(184,150,84,0.45)" strokeWidth="1.5" />
                      <circle cx="28" cy="28" r="21" fill="rgba(184,150,84,0.07)" />
                      <path d="M17 28.5L24 35.5L40 20" stroke="#dfbd78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <h2 className="ih-presaleSuccessTitle ih-goldTextStrong">
                    Your purchase has been successful.
                  </h2>

                  <p className="ih-presaleSuccessBody">
                    You will receive your <strong>$IHOLD</strong> tokens within 48 hours.
                  </p>

                  <p className="ih-presaleSuccessBody">
                    Subscribe to{" "}
                    <a
                      href="https://t.me/ironholdannouncements"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ih-presaleLink"
                    >
                      @ironholdannouncements
                    </a>{" "}
                    to stay tuned with official announcements.
                  </p>

                  {txSignature && (
                    <a
                      className="ih-presaleTxLink"
                      href={`https://solscan.io/tx/${txSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View transaction on Solscan -&gt;
                    </a>
                  )}
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  <div className="ih-presalePanelHeader">
                    <div className="ih-presalePanelTitle ih-goldTextStrong">
                      {isPresaleClosed ? PRESALE_CLOSED_LABEL : "Purchase $IHOLD"}
                    </div>
                    <div className="ih-presalePanelSub">
                      {isPresaleClosed
                        ? "Buying disabled"
                        : priceLoading
                          ? "Fetching SOL price..."
                          : solPrice
                            ? `1 SOL ~= ${formatUsd(solPrice)}`
                            : "SOL price unavailable"}
                    </div>
                  </div>

                  <div className="ih-presaleField">
                    <label className="ih-presaleFieldLabel" htmlFor="ih-sol-amount">
                      Amount of SOL to spend
                    </label>
                    <div className="ih-presaleInputRow">
                      <input
                        id="ih-sol-amount"
                        className="ih-presaleInput"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={solAmount}
                        onChange={(event) => setSolAmount(event.target.value)}
                        disabled={isSubmitting || isPresaleClosed}
                        autoComplete="off"
                      />
                      <span className="ih-presaleInputUnit">SOL</span>
                    </div>
                  </div>

                  <div className="ih-presaleOutput">
                    <div className="ih-presaleOutputLabel">You will receive</div>
                    <div className={`ih-presaleOutputValue${iholdAmount > 0 ? " ih-goldTextStrong" : " ih-presaleOutputEmpty"}`}>
                      {formatNumber(iholdAmount, 0)}
                    </div>
                    <div className="ih-presaleOutputUnit">$IHOLD</div>
                    {usdValue > 0 && !isPresaleClosed && (
                      <div className="ih-presaleOutputUsd">~= {formatUsd(usdValue)} at current SOL price</div>
                    )}
                  </div>

                  <div className="ih-presaleSep" aria-hidden="true" />

                  <button
                    className="ih-btn ih-btn--primary ih-presaleCta"
                    type="button"
                    onClick={handleBuy}
                    disabled={isPresaleClosed || isSubmitting || !parsedSol}
                  >
                    {btnLabel}
                  </button>

                  {isPresaleClosed && (
                    <div className="ih-presaleDisclaimer">
                      The presale is closed. This page is still available for reference, but purchases are disabled.
                    </div>
                  )}

                  {!isPresaleClosed && txStatus === "sending" && (
                    <div className="ih-presalePhantomHint">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="rgba(184,150,84,0.6)" strokeWidth="1.2" />
                        <path d="M8 4.5v4M8 10.5v1" stroke="#dfbd78" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                      Check your Phantom wallet. An approval popup should appear in your browser extension.
                    </div>
                  )}

                  {errorMsg && (
                    <div className="ih-presaleError" role="alert">{errorMsg}</div>
                  )}

                  {!isPresaleClosed && (
                    <div className="ih-presaleDisclaimer">
                      This is a presale. No tokens are minted at this time. $IHOLD will be
                      distributed manually to your wallet one day before the public launch.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="ih-presaleFootNote">
            &copy; {new Date().getFullYear()} Ironhold. All rights reserved.
          </div>
        </motion.div>
      </main>
    </div>
  );
}
