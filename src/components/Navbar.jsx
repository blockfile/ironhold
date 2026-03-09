import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);
    const navHiddenRef = useRef(false);
    const navInnerRef = useRef(null);
    const navItems = [
        { href: "#calculator", label: "Calculator" },
        { href: "#whitepaper", label: "Whitepaper" },
        { href: "#foundation", label: "Foundation" },
        { href: "#capabilities", label: "Capabilities" },
        { href: "#data", label: "Data" },
        { href: "#contact", label: "Contact" }
    ];

    const applyNavVisibility = (visibility) => {
        const navInner = navInnerRef.current;

        if (navInner) {
            navInner.style.opacity = String(visibility);
            navInner.style.transform = `translateY(${(1 - visibility) * -18}px) scale(${0.92 + (visibility * 0.08)})`;
        }
    };

    const getScrollTop = () => (
        Math.max(
            window.scrollY || 0,
            document.documentElement?.scrollTop || 0,
            document.body?.scrollTop || 0
        )
    );

    useEffect(() => {
        let frameId = 0;

        const tick = () => {
            const y = getScrollTop();
            const delta = y - lastScrollY.current;
            const scrollingDown = delta > 0;
            const scrollingUp = delta < 0;

            setScrolled(y > 8);

            if (menuOpen) {
                if (navHiddenRef.current) {
                    navHiddenRef.current = false;
                    setNavHidden(false);
                }
                applyNavVisibility(1);
                lastScrollY.current = y;
                return;
            }

            if (y < 16) {
                if (navHiddenRef.current) {
                    navHiddenRef.current = false;
                    setNavHidden(false);
                }
                applyNavVisibility(1);
            } else if (scrollingDown) {
                const visibility = Math.max(0, 1 - Math.min(y, 150) / 150);
                applyNavVisibility(visibility);

                const shouldHide = y > 148;
                if (shouldHide !== navHiddenRef.current) {
                    navHiddenRef.current = shouldHide;
                    setNavHidden(shouldHide);
                }
            } else if (scrollingUp) {
                if (navHiddenRef.current) {
                    navHiddenRef.current = false;
                    setNavHidden(false);
                }
                applyNavVisibility(1);
            }

            lastScrollY.current = y;
            frameId = window.requestAnimationFrame(tick);
        };

        lastScrollY.current = getScrollTop();
        applyNavVisibility(1);
        frameId = window.requestAnimationFrame(tick);
        return () => window.cancelAnimationFrame(frameId);
    }, [menuOpen]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 720) setMenuOpen(false);
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
        <header
            className={`ih-nav ${scrolled ? "ih-nav--solid" : ""} ${menuOpen ? "ih-nav--menuOpen" : ""} ${navHidden && !menuOpen ? "ih-nav--hidden" : ""}`}
        >
            <div className="ih-container ih-navInner" ref={navInnerRef}>
                <div className="ih-navCapsule">
                    <a className="ih-logo" href="#top" aria-label="Ironhold Home">
                        <span className="ih-logoMark">
                            <img className="ih-logoImage" src="/logo2.png" alt="Ironhold logo" width="92" height="92" />
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
                            <button className="ih-btn ih-btn--secondary" type="button">Documentation</button>
                            <button className="ih-btn ih-btn--primary" type="button">Buy</button>
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
                            <img className="ih-navMobileLogo" src="/logo2.png" alt="" />
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
                    <button className="ih-btn ih-btn--secondary" type="button">Documentation</button>
                    <button className="ih-btn ih-btn--primary" type="button">Buy</button>
                </div>
            </div>
        </header>
    );
}
