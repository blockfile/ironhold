import React, { useEffect, useRef, useState } from "react";

const MOBILE_NAV_BREAKPOINT = 767;

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const navHiddenRef = useRef(false);
    const navItems = [
        { href: "#calculator", label: "Calculator" },
        { href: "#whitepaper", label: "Whitepaper" },
        { href: "#foundation", label: "Foundation" },
        { href: "#capabilities", label: "Capabilities" },
        { href: "#data", label: "Data" },
        { href: "#contact", label: "Contact" }
    ];

    useEffect(() => {
        let frameId = 0;

        const getScrollTop = () => (
            Math.max(
                window.scrollY || 0,
                document.documentElement?.scrollTop || 0,
                document.body?.scrollTop || 0
            )
        );

        const setNavHiddenState = (nextHidden) => {
            if (navHiddenRef.current === nextHidden) return;

            navHiddenRef.current = nextHidden;
            setNavHidden(nextHidden);
        };

        const tick = () => {
            const currentY = getScrollTop();
            const delta = currentY - lastScrollY.current;
            const isMobileViewport = window.innerWidth < 768;

            setScrolled(currentY > 10);

            if (menuOpen || isMobileViewport) {
                setNavHiddenState(false);
                lastScrollY.current = currentY;
                frameId = window.requestAnimationFrame(tick);
                return;
            }

            if (currentY <= 24) {
                setNavHiddenState(false);
            } else if (delta > 2) {
                setNavHiddenState(true);
            } else if (delta < -2) {
                setNavHiddenState(false);
            }

            lastScrollY.current = currentY;
            frameId = window.requestAnimationFrame(tick);
        };

        lastScrollY.current = getScrollTop();
        frameId = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [menuOpen]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
                setMenuOpen(false);
                navHiddenRef.current = false;
                setNavHidden(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <header
                className={`ih-nav ${scrolled ? "ih-nav--solid" : ""} ${menuOpen ? "ih-nav--menuOpen" : ""} ${navHidden && !menuOpen ? "ih-nav--hidden" : ""}`}
                style={navHidden && !menuOpen ? { transform: "translateY(-115%)", opacity: 0, pointerEvents: "none" } : undefined}
            >
                <div className="ih-container ih-navInner">
                    <div className="ih-navCapsule">
                        <a className="ih-logo" href="#top" aria-label="Ironhold Home">
                            <span className="ih-logoMark">
                                <picture>
                                    <source media="(max-width: 767px)" srcSet="/logo-mark.png" />
                                    <img className="ih-logoImage" src="/logo2.png" alt="Ironhold logo" width="92" height="92" />
                                </picture>
                            </span>
                            <span className="ih-logoText">IRONHOLD</span>
                        </a>

                        <div className="ih-navReveal">
                            <nav className="ih-navLinks" aria-label="Primary">
                                {navItems.map((item) => (
                                    <a href={item.href} key={item.href}>{item.label}</a>
                                ))}
                            </nav>

                            <div className="ih-navDesktopActions">
                                <a href="/rewards" className="ih-btn ih-btn--ghost">Rewards</a>
                                <a href="/presale" className="ih-btn ih-btn--primary">Presale</a>
                            </div>
                        </div>

                        <button
                            className={`ih-navToggle ${menuOpen ? "is-open" : ""}`}
                            type="button"
                            aria-expanded={menuOpen}
                            aria-controls="ih-mobile-menu"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </header>

            <button
                className={`ih-navBackdrop ${menuOpen ? "is-open" : ""}`}
                type="button"
                aria-label="Close menu overlay"
                onClick={closeMenu}
            />

            <div id="ih-mobile-menu" className={`ih-navMobile ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
                <div className="ih-navMobileHeader">
                    <div className="ih-navMobileHeaderBrand">
                        <span className="ih-navMobileLogoMark" aria-hidden="true">
                            <img className="ih-navMobileLogo" src="/logo-mark.png" alt="" />
                        </span>
                        <div className="ih-navMobileHeaderText">
                            <strong>IRONHOLD</strong>
                            <span>Private Protocol Interface</span>
                        </div>
                    </div>
                    <button className="ih-navMobileClose" type="button" aria-label="Close menu" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <nav className="ih-navMobileLinks" aria-label="Mobile Primary">
                    {navItems.map((item) => (
                        <a href={item.href} key={`mobile-${item.href}`} onClick={closeMenu}>{item.label}</a>
                    ))}
                </nav>
                <div className="ih-navMobileActions">
                    <a href="/rewards" className="ih-btn ih-btn--ghost">Rewards</a>
                    <a href="/presale" className="ih-btn ih-btn--primary">Presale</a>
                </div>
            </div>
        </>
    );
}
