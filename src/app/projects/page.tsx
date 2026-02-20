import Link from "next/link";
import { getAllProjects } from "@/data/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div style={{ paddingTop: 64 }}>
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "5rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            color: "var(--foreground)",
          }}
        >
          PROJECTS
        </h1>
        <p
          style={{
            color: "var(--foreground-muted)",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "3rem",
            maxWidth: 600,
          }}
        >
          A collection of hardware builds, embedded systems projects, and
          engineering explorations.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              style={{
                display: "block",
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.2s",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  aspectRatio: "16/10",
                  background: "var(--background-secondary)",
                  backgroundImage: `url(${project.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--foreground-muted)",
                  fontSize: "0.8rem",
                }}
              >
                {!project.thumbnail.startsWith("/projects/") ||
                project.thumbnail.includes("sample") ? (
                  <span style={{ opacity: 0.4 }}>Thumbnail</span>
                ) : null}
              </div>

              {/* Info */}
              <div style={{ padding: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {project.title}
                </h3>
                <time
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--foreground-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--foreground-muted)",
            }}
          >
            <p>No projects yet. Use the admin tool to add your first project!</p>
          </div>
        )}
      </section>
    </div>
  );
}
