"use client";

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "5rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "3rem",
            color: "var(--foreground)",
          }}
        >
          ABOUT
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(200px, 300px) 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Profile picture placeholder */}
          <div
            style={{
              aspectRatio: "3/4",
              background: "var(--background-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground-muted)",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              overflow: "hidden",
            }}
          >
            {/* Replace /profile.jpg with your actual image */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.4, marginBottom: "1rem" }}
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
            <span style={{ opacity: 0.5 }}>Your photo here</span>
            <span
              style={{
                opacity: 0.3,
                fontSize: "0.7rem",
                marginTop: "0.25rem",
              }}
            >
              Replace public/profile.jpg
            </span>
          </div>

          {/* Bio text */}
          <div>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--foreground-muted)",
                marginBottom: "1.5rem",
              }}
            >
              Felipe is a former investment banker turned electrical engineer with a passion for
              embedded systems, robotics, and hardware design. Driven by
              curiosity, he enjoys exploring how systems work at a fundamental
              level and finding creative solutions to complex engineering
              challenges.
            </p>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--foreground-muted)",
                marginBottom: "1.5rem",
              }}
            >
              His interests span across chip design, signal processing, video
              game consoles, robotics, and the intersection of software and hardware. 
              He is always looking for opportunities to learn new skills and apply
              them to real-world projects.
            </p>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--foreground-muted)",
                marginBottom: "2rem",
              }}
            >
              Outside of engineering, Felipe enjoys sharing his builds on
              platforms like Hackster.io and Hackaday.io, contributing to the
              maker community, and continuously expanding his knowledge through
              hands-on projects.
            </p>

            {/* Links */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/felipeboubee",
                },
                {
                  label: "Hackster.io",
                  href: "https://www.hackster.io/felipeboubee",
                },
                {
                  label: "Hackaday.io",
                  href: "https://hackaday.io/felipeboubee",
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--accent)",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid transparent",
                    paddingBottom: 2,
                    transition: "border-color 0.2s",
                  }}
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
