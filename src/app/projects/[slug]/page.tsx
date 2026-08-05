import {
  formatProjectDate,
  getAllProjects,
  getProjectBySlug,
  type ProjectSection,
} from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CategoryTag,
  Figure,
  StackChips,
  StatusBadge,
  ThumbnailPlaceholder,
} from "@/components/ProjectMeta";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

const headingStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: 600,
  marginBottom: "1rem",
  letterSpacing: "0.02em",
  color: "var(--accent)",
};

const proseStyle: React.CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.8,
  color: "var(--foreground-muted)",
};

function SectionTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    // Wide tables scroll inside their own container rather than pushing the page
    <div style={{ overflowX: "auto", margin: "1.25rem 0" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.875rem",
          minWidth: 480,
        }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "0.6rem 0.8rem",
                  borderBottom: "1px solid var(--accent)",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "0.6rem 0.8rem",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.6,
                    fontFamily:
                      j === 0
                        ? "var(--font-geist-mono), monospace"
                        : undefined,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({ section }: { section: ProjectSection }) {
  return (
    <div style={{ marginBottom: "2.25rem" }}>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "0.65rem",
          color: "var(--foreground)",
          letterSpacing: "0.01em",
        }}
      >
        {section.title}
      </h3>
      {section.body && (
        <p style={{ ...proseStyle, fontSize: "0.95rem" }}>{section.body}</p>
      )}
      {section.bullets && (
        <ul
          style={{
            paddingLeft: "1.5rem",
            marginTop: section.body ? "0.85rem" : 0,
            color: "var(--foreground-muted)",
            fontSize: "0.95rem",
            lineHeight: 1.8,
            // Tailwind's preflight resets list-style on ul, so set it back
            listStyleType: "disc",
          }}
        >
          {section.bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: "0.4rem" }}>
              {b}
            </li>
          ))}
        </ul>
      )}
      {section.table && (
        <SectionTable
          headers={section.table.headers}
          rows={section.table.rows}
        />
      )}
      {section.image && (
        <div style={{ marginTop: "1rem" }}>
          <Figure image={section.image} />
        </div>
      )}
    </div>
  );
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const isBuilt = project.status === "complete";

  return (
    <div style={{ paddingTop: 64 }}>
      <article
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "4rem 2rem 5rem",
        }}
      >
        <Link
          href="/projects"
          style={{
            fontSize: "0.85rem",
            color: "var(--foreground-muted)",
            letterSpacing: "0.05em",
            marginBottom: "2rem",
            display: "inline-block",
          }}
        >
          ← Back to Projects
        </Link>

        {/* Category, status, date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
          }}
        >
          <CategoryTag category={project.category} />
          <StatusBadge status={project.status} />
          {project.date && (
            <time
              style={{
                fontSize: "0.8rem",
                color: "var(--grey)",
                letterSpacing: "0.04em",
              }}
            >
              {formatProjectDate(project.date, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            color: "var(--foreground)",
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "var(--foreground-muted)",
            marginBottom: "1.75rem",
          }}
        >
          {project.tagline}
        </p>

        <div style={{ marginBottom: "2.5rem" }}>
          <StackChips stack={project.stack} />
        </div>

        {/* Hero */}
        <div style={{ marginBottom: "2.5rem" }}>
          {project.thumbnail ? (
            <Figure
              image={{ src: project.thumbnail, alt: project.thumbnailAlt }}
              aspectRatio="16/9"
            />
          ) : (
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <ThumbnailPlaceholder
                category={project.category}
                aspectRatio="16/9"
              />
            </div>
          )}
        </div>

        {/* Honest banner for anything not finished */}
        {!isBuilt && (
          <div
            style={{
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--grey)",
              borderRadius: 6,
              background: "var(--background-secondary)",
              padding: "1rem 1.25rem",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "var(--foreground-muted)",
                margin: 0,
              }}
            >
              <strong style={{ color: "var(--foreground)" }}>
                {project.status === "planned"
                  ? "Planned build."
                  : "Build in progress."}
              </strong>{" "}
              What follows is the design and the decisions behind it, not a
              record of finished work. Figures, measured data and the repository
              go here as it gets built.
            </p>
          </div>
        )}

        {project.links.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={headingStyle}>Links</h2>
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {project.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--blue-light)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>The problem</h2>
          <p style={proseStyle}>{project.problem}</p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={headingStyle}>Approach</h2>
          <p style={proseStyle}>{project.approach}</p>
        </section>

        {project.tradeoffs.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={headingStyle}>Trade-offs</h2>
            {project.tradeoffs.map((s, i) => (
              <SectionBlock key={i} section={s} />
            ))}
          </section>
        )}

        {project.sections.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={headingStyle}>Design detail</h2>
            {project.sections.map((s, i) => (
              <SectionBlock key={i} section={s} />
            ))}
          </section>
        )}

        {project.nextTime.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={headingStyle}>What I&apos;d do differently</h2>
            <ul
              style={{
                paddingLeft: "1.5rem",
                color: "var(--foreground-muted)",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                listStyleType: "disc",
              }}
            >
              {project.nextTime.map((n, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  {n}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(project.images.length > 0 || project.videos.length > 0) && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={headingStyle}>Gallery</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {project.images.map((img, i) => (
                <Figure key={`img-${i}`} image={img} aspectRatio="16/10" />
              ))}
              {project.videos.map((vid, i) => (
                <video
                  key={`vid-${i}`}
                  src={vid}
                  controls
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "var(--background-secondary)",
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "2rem",
            marginTop: "2rem",
          }}
        >
          <Link
            href="/projects"
            style={{
              fontSize: "0.9rem",
              color: "var(--accent)",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            ← All Projects
          </Link>
        </div>
      </article>
    </div>
  );
}
