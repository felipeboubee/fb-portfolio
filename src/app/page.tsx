import Link from "next/link";
import { getAllProjects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/felipeboubee",
    path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
  },
  {
    label: "Hackster.io",
    href: "https://www.hackster.io/felipeboubee",
    path: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.39 7.5 12 10.82 4.61 7.5 12 4.18zM4 8.64l7 3.5v7.22l-7-3.5V8.64zm9 10.72V12.14l7-3.5v7.22l-7 3.5z",
  },
  {
    label: "Hackaday.io",
    href: "https://hackaday.io/felipeboubee",
    path: "M3 3h7v2H5v14h14v-5h2v7H3V3zm11 0h7v7h-2V6.41l-8.29 8.3-1.42-1.42L17.59 5H14V3z",
  },
];

export default function Home() {
  const featured = getAllProjects().slice(0, 3);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero — sized by its content, not by the viewport. A 100vh hero left a
          large dead gap above the fold below it. */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "6rem 2rem 4.5rem",
          position: "relative",
          // The decorative blob below is wider than a phone viewport
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-10%",
            left: "20%",
            width: "min(600px, 100%)",
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(36,170,226,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 780 }}>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              color: "var(--foreground)",
            }}
          >
            FELIPE BOUBEE
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
              color: "var(--foreground)",
              lineHeight: 1.6,
              marginBottom: "1rem",
              maxWidth: 640,
            }}
          >
            Electronic Engineering student at Universidad de Palermo, previously
            Equity Capital Markets at J.P. Morgan.
          </p>

          <p
            style={{
              fontSize: "1rem",
              color: "var(--foreground-muted)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: 620,
            }}
          >
            Working in automation and controls, with robotics as the goal.
            Each project here is written as an engineering decision record: the
            problem, the option I picked, and what picking it cost.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "3rem",
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
              }}
            >
              ABOUT ME
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--foreground-muted)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={s.path} />
                </svg>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem 6rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            borderTop: "1px solid var(--border)",
            paddingTop: "3rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.35rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Selected work
          </h2>
          <Link
            href="/projects"
            style={{
              fontSize: "0.85rem",
              color: "var(--accent)",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            All projects →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.75rem",
            alignItems: "stretch",
          }}
        >
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
