export const metadata = {
  title: "About | Felipe Boubee",
  description:
    "Electronic Engineering student at Universidad de Palermo, previously Equity Capital Markets at J.P. Morgan.",
};

const FACTS: { label: string; value: string }[] = [
  { label: "Based in", value: "Buenos Aires, Argentina" },
  { label: "Studying", value: "Electronic Engineering, Universidad de Palermo" },
  { label: "Previously", value: "Equity Capital Markets, J.P. Morgan" },
  { label: "Focus", value: "Automation & controls, working toward robotics" },
  { label: "Languages", value: "Spanish (native), English (fluent)" },
];

const LINKS = [
  { label: "GitHub", href: "https://github.com/felipeboubee" },
  { label: "Hackster.io", href: "https://www.hackster.io/felipeboubee" },
  { label: "Hackaday.io", href: "https://hackaday.io/felipeboubee" },
];

const paragraphStyle: React.CSSProperties = {
  fontSize: "1.05rem",
  lineHeight: 1.8,
  color: "var(--foreground-muted)",
  marginBottom: "1.5rem",
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      <section
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "4rem 2rem 5rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            color: "var(--foreground)",
          }}
        >
          ABOUT
        </h1>

        <p style={paragraphStyle}>
          I&apos;m an Electronic Engineering student at Universidad de Palermo,
          in Buenos Aires. Before this I spent seven years in finance — most
          recently as an Equity Capital Markets analyst at J.P. Morgan, and
          before that in analyst roles at Sun Life Capital Management, The Walt
          Disney Company and J.P. Morgan&apos;s equities middle office.
        </p>

        <p style={paragraphStyle}>
          My focus is automation and controls, with robotics as the goal and
          embedded electronics adjacent to both. Alongside the degree I work
          through a self-directed curriculum covering PLC programming and
          industrial control, PID and process control, ROS 2, and embedded
          firmware — and I build the projects listed on this site as I go. Each
          one is written up as a decision record rather than a tutorial, because
          the interesting part of an engineering project is the reasoning, not
          the steps.
        </p>

        <p style={paragraphStyle}>
          The finance background is not unrelated. Seven years of working to
          specifications, documenting what I did so someone else could audit it,
          and being accountable for numbers that mattered turns out to transfer
          fairly directly to controls work — where the difference between a
          project and a demonstrated build is documented proof.
        </p>

        {/* At a glance — this space previously held an unfilled photo slot */}
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px, 160px) 1fr",
            gap: "0.85rem 1.5rem",
            margin: "2.5rem 0",
            padding: "1.75rem",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--background-secondary)",
            fontSize: "0.925rem",
          }}
          className="about-facts"
        >
          {FACTS.map((f) => (
            <div key={f.label} style={{ display: "contents" }}>
              <dt
                style={{
                  color: "var(--grey)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  paddingTop: "0.15rem",
                }}
              >
                {f.label}
              </dt>
              <dd
                style={{
                  color: "var(--foreground-muted)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {LINKS.map((link) => (
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
              }}
            >
              {link.label} →
            </a>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .about-facts {
            grid-template-columns: 1fr !important;
            gap: 0.25rem 0 !important;
          }
          .about-facts dd {
            margin-bottom: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
