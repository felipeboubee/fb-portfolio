"use client";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem",
        textAlign: "center",
        color: "var(--foreground-muted)",
        fontSize: "0.8rem",
        letterSpacing: "0.08em",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        <a
          href="https://github.com/felipeboubee"
          target="_blank"
          rel="noopener noreferrer"
          style={{ transition: "color 0.2s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--foreground-muted)")
          }
        >
          GitHub
        </a>
        <a
          href="https://www.hackster.io/felipeboubee"
          target="_blank"
          rel="noopener noreferrer"
          style={{ transition: "color 0.2s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--foreground-muted)")
          }
        >
          Hackster.io
        </a>
        <a
          href="https://hackaday.io/felipeboubee"
          target="_blank"
          rel="noopener noreferrer"
          style={{ transition: "color 0.2s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--foreground-muted)")
          }
        >
          Hackaday.io
        </a>
      </div>
      <p>© {new Date().getFullYear()} Felipe Boubee. All rights reserved.</p>
    </footer>
  );
}
