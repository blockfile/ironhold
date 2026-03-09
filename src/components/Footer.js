import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="ih-footer">
      <div className="ih-footerTopLine" />
      <div className="ih-container ih-footerInner">
        <a className="ih-footerBrand" href="#top" aria-label="Ironhold Home">
          <span className="ih-footerLogoMark">
            <img className="ih-footerLogoImage" src="/logo2.png" alt="Ironhold logo" width="92" height="92" />
          </span>
          <div className="ih-footerLogo">IRONHOLD</div>
        </a>

        <div className="ih-footerLinks">
          <a href="#calculator">Calculator</a>
          <a href="#whitepaper">Whitepaper</a>
          <a href="#foundation">Foundation</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#data">Data</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="ih-footerMeta">
          Copyright {new Date().getFullYear()} Ironhold. All structure.
        </div>
      </div>
    </footer>
  );
}
