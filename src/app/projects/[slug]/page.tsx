import { getAllProjects, getProjectBySlug } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div style={{ paddingTop: 64 }}>
      <article
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "5rem 2rem",
        }}
      >
        {/* Back link */}
        <Link
          href="/projects"
          style={{
            fontSize: "0.85rem",
            color: "var(--foreground-muted)",
            letterSpacing: "0.05em",
            marginBottom: "2rem",
            display: "inline-block",
            transition: "color 0.2s",
          }}
        >
          ← Back to Projects
        </Link>

        {/* Title & date */}
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
            color: "var(--foreground)",
          }}
        >
          {project.title}
        </h1>
        <time
          style={{
            fontSize: "0.85rem",
            color: "var(--foreground-muted)",
            letterSpacing: "0.04em",
            display: "block",
            marginBottom: "2rem",
          }}
        >
          {new Date(project.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {/* Hero image */}
        <div
          style={{
            aspectRatio: "16/9",
            background: "var(--background-secondary)",
            borderRadius: 8,
            marginBottom: "3rem",
            backgroundImage: `url(${project.thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid var(--border)",
          }}
        />

        {/* Relevant Links */}
        {project.links.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "1rem",
                letterSpacing: "0.02em",
                color: "var(--accent)",
              }}
            >
              Relevant Links
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
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
                      transition: "color 0.2s",
                    }}
                  >
                    • {link.label}: {link.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Overview */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "1rem",
              letterSpacing: "0.02em",
              color: "var(--accent)",
            }}
          >
            Overview
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "var(--foreground-muted)",
            }}
          >
            {project.overview}
          </p>
        </section>

        {/* Materials Needed */}
        {project.materials.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "1rem",
                letterSpacing: "0.02em",
                color: "var(--accent)",
              }}
            >
              Materials Needed
            </h2>
            <ul
              style={{
                paddingLeft: "1.5rem",
                color: "var(--foreground-muted)",
                lineHeight: 2,
              }}
            >
              {project.materials.map((m, i) => (
                <li key={i} style={{ fontSize: "0.95rem" }}>
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instructions */}
        {project.steps.length > 0 && (
          <section style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                letterSpacing: "0.02em",
                color: "var(--accent)",
              }}
            >
              Instructions
            </h2>
            {project.steps.map((step, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "2rem",
                  paddingLeft: "1.5rem",
                  borderLeft: "2px solid var(--border)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    color: "var(--foreground)",
                  }}
                >
                  {i + 1}) {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    color: "var(--foreground-muted)",
                    marginBottom: step.image ? "1rem" : 0,
                  }}
                >
                  {step.content}
                </p>
                {step.image && (
                  <div
                    style={{
                      aspectRatio: "16/9",
                      background: "var(--background-secondary)",
                      borderRadius: 6,
                      backgroundImage: `url(${step.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid var(--border)",
                    }}
                  />
                )}
              </div>
            ))}
          </section>
        )}

        {/* Gallery */}
        {(project.images.length > 0 || project.videos.length > 0) && (
          <section style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "1rem",
                letterSpacing: "0.02em",
                color: "var(--accent)",
              }}
            >
              Gallery
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {project.images.map((img, i) => (
                <div
                  key={`img-${i}`}
                  style={{
                    aspectRatio: "16/10",
                    background: "var(--background-secondary)",
                    borderRadius: 6,
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
              {project.videos.map((vid, i) => (
                <div
                  key={`vid-${i}`}
                  style={{
                    aspectRatio: "16/9",
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  <video
                    src={vid}
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
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
