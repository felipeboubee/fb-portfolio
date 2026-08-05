import Link from "next/link";
import type { Project } from "@/data/projects";
import { CategoryTag, StatusBadge, ThumbnailPlaceholder } from "./ProjectMeta";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--background)",
        height: "100%",
      }}
    >
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt={project.thumbnailAlt}
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "16/10",
            objectFit: "contain",
            background: "var(--background-secondary)",
          }}
        />
      ) : (
        <ThumbnailPlaceholder category={project.category} />
      )}

      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <CategoryTag category={project.category} size="small" />
          <StatusBadge status={project.status} />
        </div>

        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: "var(--foreground)",
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "var(--foreground-muted)",
            margin: 0,
          }}
        >
          {project.tagline}
        </p>
      </div>
    </Link>
  );
}
