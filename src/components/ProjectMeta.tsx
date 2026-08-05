import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type ProjectCategory,
  type ProjectImage,
  type ProjectStatus,
} from "@/data/projects";

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  automation: "var(--blue-light)",
  robotics: "var(--teal)",
  electronics: "var(--blue-medium)",
  "digital-design": "var(--blue-dark)",
};

export function CategoryTag({
  category,
  size = "normal",
}: {
  category: ProjectCategory;
  size?: "normal" | "small";
}) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: size === "small" ? "0.68rem" : "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: size === "small" ? "0.15rem 0.5rem" : "0.2rem 0.65rem",
        whiteSpace: "nowrap",
      }}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

/**
 * Says plainly whether a build is finished. A portfolio that mixes shipped work
 * with planned work has to label which is which, or it is claiming both.
 */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, { color: string; border: string }> = {
    complete: { color: "var(--teal)", border: "var(--teal)" },
    "in-progress": { color: "var(--accent)", border: "var(--accent)" },
    planned: { color: "var(--grey)", border: "var(--border)" },
  };
  const s = styles[status];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 999,
        padding: "0.15rem 0.5rem",
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StackChips({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null;
  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        listStyleType: "none",
        padding: 0,
        margin: 0,
      }}
    >
      {stack.map((item) => (
        <li
          key={item}
          style={{
            fontSize: "0.75rem",
            color: "var(--foreground-muted)",
            background: "var(--background-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "0.25rem 0.6rem",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Rendered when a project has no image yet. Pure CSS, so it never requests a
 * file that isn't there — the old placeholder 404'd in production.
 */
export function ThumbnailPlaceholder({
  category,
  aspectRatio = "16/10",
}: {
  category: ProjectCategory;
  aspectRatio?: string;
}) {
  const color = CATEGORY_COLORS[category];
  return (
    <div
      role="presentation"
      style={{
        aspectRatio,
        background: `linear-gradient(135deg, var(--background-secondary) 0%, var(--background) 100%)`,
        borderBottom: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.45 }}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <path d="M10 6.5h4a2 2 0 0 1 2 2V14" />
      </svg>
    </div>
  );
}

/**
 * A real <img> with real alt text. Figures were previously CSS background
 * images, which are invisible to screen readers and got cropped by `cover`.
 */
export function Figure({
  image,
  aspectRatio = "16/9",
}: {
  image: ProjectImage;
  aspectRatio?: string;
}) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      style={{
        display: "block",
        width: "100%",
        aspectRatio,
        // contain, not cover: figures and schematics lose their meaning when
        // the edges get cropped away
        objectFit: "contain",
        background: "var(--background-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 6,
      }}
    />
  );
}
