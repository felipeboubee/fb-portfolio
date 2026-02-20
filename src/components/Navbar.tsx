"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/ee-mindmap", label: "EE MIND MAP" },
  { href: "/about", label: "ABOUT" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(31, 34, 43, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.15em",
            color: "var(--foreground)",
          }}
        >
          FELIPE BOUBEE
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
          }}
          className="nav-desktop"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                fontWeight: 500,
                color:
                  pathname === link.href
                    ? "var(--accent)"
                    : "var(--foreground-muted)",
                transition: "color 0.2s",
                borderBottom:
                  pathname === link.href
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                paddingBottom: 4,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  pathname === link.href
                    ? "var(--accent)"
                    : "var(--foreground-muted)")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--foreground)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            background: "var(--background-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                fontWeight: 500,
                color:
                  pathname === link.href
                    ? "var(--accent)"
                    : "var(--foreground-muted)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
