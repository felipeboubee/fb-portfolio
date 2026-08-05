"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import ProjectCard from "./ProjectCard";

type Filter = ProjectCategory | "all";

export default function ProjectGrid({
  projects,
  categories,
}: {
  projects: Project[];
  categories: ProjectCategory[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [projects, filter]
  );

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: projects.length },
    ...categories.map((c) => ({
      value: c as Filter,
      label: CATEGORY_LABELS[c],
      count: projects.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <>
      <div
        role="group"
        aria-label="Filter projects by discipline"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        {options.map((opt) => {
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              aria-pressed={active}
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: active ? "var(--charcoal)" : "var(--foreground-muted)",
                background: active ? "var(--accent)" : "transparent",
                border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 999,
                // 44px min touch target
                padding: "0.6rem 1rem",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, border-color 0.2s",
              }}
            >
              {opt.label}{" "}
              <span style={{ opacity: 0.6 }}>({opt.count})</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.75rem",
          alignItems: "stretch",
        }}
      >
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <p
        aria-live="polite"
        style={{
          marginTop: "2rem",
          fontSize: "0.85rem",
          color: "var(--grey)",
        }}
      >
        Showing {visible.length} of {projects.length} projects.
      </p>
    </>
  );
}
