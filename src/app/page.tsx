"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "4rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient accent */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(36,170,226,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            color: "var(--foreground)",
          }}
        >
          FELIPE BOUBEE
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--foreground-muted)",
            maxWidth: 600,
            lineHeight: 1.6,
            marginBottom: "3rem",
            letterSpacing: "0.02em",
          }}
        >
          Electrical Engineering &amp; Embedded Systems
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "4rem",
          }}
        >
          <Link
            href="/projects"
            style={{
              padding: "0.85rem 2rem",
              background: "var(--accent)",
              color: "var(--charcoal)",
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              borderRadius: 6,
              transition: "background 0.2s, transform 0.2s",
            }}
          >
            VIEW PROJECTS
          </Link>
          <Link
            href="/about"
            style={{
              padding: "0.85rem 2rem",
              border: "1px solid var(--border)",
              color: "var(--foreground-muted)",
              fontWeight: 500,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              borderRadius: 6,
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            ABOUT ME
          </Link>
        </div>

        {/* Social links */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://github.com/felipeboubee"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--foreground-muted)",
              transition: "color 0.2s",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a
            href="https://www.hackster.io/felipeboubee"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--foreground-muted)",
              transition: "color 0.2s",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.39 7.5 12 10.82 4.61 7.5 12 4.18zM4 8.64l7 3.5v7.22l-7-3.5V8.64zm9 10.72V12.14l7-3.5v7.22l-7 3.5z"/>
            </svg>
            Hackster.io
          </a>
          <a
            href="https://hackaday.io/felipeboubee"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--foreground-muted)",
              transition: "color 0.2s",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h7v2H5v14h14v-5h2v7H3V3zm11 0h7v7h-2V6.41l-8.29 8.3-1.42-1.42L17.59 5H14V3z"/>
            </svg>
            Hackaday.io
          </a>
        </div>
      </section>

      {/* Featured section */}
      <section
        style={{
          padding: "4rem 2rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              title: "Projects",
              desc: "Hardware builds, PCBs, embedded systems and more.",
              href: "/projects",
            },
            {
              title: "EE Mind Map",
              desc: "An interactive map of electrical engineering domains and skills.",
              href: "/ee-mindmap",
            },
            {
              title: "About",
              desc: "Learn more about my background and interests.",
              href: "/about",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              style={{
                padding: "2rem",
                border: "1px solid var(--border)",
                borderRadius: 8,
                transition: "border-color 0.3s, transform 0.2s",
                display: "block",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  letterSpacing: "0.04em",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  color: "var(--foreground-muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
