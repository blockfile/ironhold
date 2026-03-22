import React from "react";

const socialLinks = [
  {
    label: "YouTube",
    handle: "@IRONHOLDHQ",
    href: "https://www.youtube.com/@IRONHOLDHQ",
    icon: "youtube",
  },
  {
    label: "Telegram",
    handle: "@ironholdcommunity",
    href: "https://t.me/ironholdcommunity",
    icon: "telegram",
  },
  {
    label: "Instagram",
    handle: "@ironholdhq",
    href: "https://www.instagram.com/ironholdhq/",
    icon: "instagram",
  },
  {
    label: "X",
    handle: "@IronholdHQ",
    href: "https://x.com/IronholdHQ",
    icon: "x",
  },
  {
    label: "TikTok",
    handle: "@ironholdhq",
    href: "https://www.tiktok.com/@ironholdhq",
    icon: "tiktok",
  },
];

function SocialIcon({ icon, className }) {
  switch (icon) {
    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.04 7.19a2.8 2.8 0 0 0-1.97-1.98C17.33 4.75 12 4.75 12 4.75s-5.33 0-7.07.46A2.8 2.8 0 0 0 2.96 7.2 29.37 29.37 0 0 0 2.5 12c0 1.64.15 3.24.46 4.8a2.8 2.8 0 0 0 1.97 1.98c1.74.47 7.07.47 7.07.47s5.33 0 7.07-.47a2.8 2.8 0 0 0 1.97-1.97c.31-1.57.46-3.17.46-4.81s-.15-3.24-.46-4.81ZM10.25 15.58V8.42L16.4 12l-6.15 3.58Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m19.62 5.31-15.1 5.82c-1.03.42-1.02 1 .19 1.37l3.88 1.21 1.5 4.78c.2.56.1.78.69.78.45 0 .65-.2.9-.44l2.19-2.13 4.55 3.36c.84.46 1.44.22 1.65-.78l2.57-12.11c.31-1.23-.47-1.79-1.51-1.32Zm-9.8 8.12-.33 4.05-.73-2.41-2.71-.84 11.81-4.67-8.04 3.87Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.25 2.75h9.5a4.5 4.5 0 0 1 4.5 4.5v9.5a4.5 4.5 0 0 1-4.5 4.5h-9.5a4.5 4.5 0 0 1-4.5-4.5v-9.5a4.5 4.5 0 0 1 4.5-4.5Zm0 1.5A3 3 0 0 0 4.25 7.25v9.5a3 3 0 0 0 3 3h9.5a3 3 0 0 0 3-3v-9.5a3 3 0 0 0-3-3h-9.5Zm4.75 2.5a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.56-.88a1.19 1.19 0 1 1-2.38 0 1.19 1.19 0 0 1 2.38 0Z" />
        </svg>
      );
    case "x":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.9 3.5h2.87l-6.27 7.16 7.37 9.84h-5.77l-4.51-5.96-5.21 5.96H4.5l6.71-7.67L4.13 3.5h5.92l4.08 5.4 4.77-5.4Zm-1 15.3h1.59L9.18 5.1H7.47L17.9 18.8Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.02 3c.17 1.42.97 2.8 2.1 3.73 1 .84 2.24 1.3 3.55 1.33v2.9a8.95 8.95 0 0 1-3.02-.52v5.62a6.05 6.05 0 1 1-6.04-6.05c.35 0 .69.03 1.02.1v3.01a3.15 3.15 0 1 0 2.39 3.04V3h3Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer id="contact" className="ih-footer">
      <div className="ih-footerTopLine" />
      <div className="ih-container ih-footerInner">
        <a className="ih-footerBrand" href="#top" aria-label="Ironhold Home">
          <span className="ih-footerLogoMark">
            <picture>
              <source media="(max-width: 767px)" srcSet="/logo-mark.png" />
              <img className="ih-footerLogoImage" src="/logo2.png" alt="Ironhold logo" width="92" height="92" />
            </picture>
          </span>
          <div className="ih-footerLogo">IRONHOLD</div>
        </a>

        <div className="ih-footerSocial" aria-label="Ironhold social links">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              className="ih-footerSocialLink"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${link.label} ${link.handle}`}
            >
              <SocialIcon className="ih-footerSocialIcon" icon={link.icon} />
              <span className="ih-footerSocialLabel">{link.label}</span>
              <span className="ih-footerSocialHandle">{link.handle}</span>
            </a>
          ))}
        </div>

        <div className="ih-footerMeta">
          Copyright {new Date().getFullYear()} Ironhold. All structure.
        </div>
      </div>
    </footer>
  );
}
