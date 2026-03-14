import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/ironhold.css";
import "./styles/forge-overrides.css";

const userAgent = window.navigator.userAgent;
const isChrome = /Chrome|Chromium|CriOS/.test(userAgent) && !/Edg|OPR|Opera|Firefox|FxiOS/.test(userAgent);
const isSafari = /Safari/.test(userAgent) && !/Chrome|Chromium|CriOS|Edg|OPR|Opera|Firefox|FxiOS/.test(userAgent);

if (isChrome && !isSafari) {
  document.documentElement.classList.add("ih-browser-chrome");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
