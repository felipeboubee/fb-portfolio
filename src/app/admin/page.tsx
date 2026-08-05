"use client";

import { useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  STATUS_LABELS,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";

/* ────────────────────────────── editor types ───────────────────────────── */

interface SectionInput {
  title: string;
  body: string;
  /** One bullet per line. */
  bullets: string;
  /** Comma-separated column headers. */
  tableHeaders: string;
  /** One row per line, cells separated by |. */
  tableRows: string;
  imageSrc: string;
  imageAlt: string;
}

interface LinkInput {
  label: string;
  url: string;
}

interface ImageInput {
  src: string;
  alt: string;
}

const emptySection = (title = ""): SectionInput => ({
  title,
  body: "",
  bullets: "",
  tableHeaders: "",
  tableRows: "",
  imageSrc: "",
  imageAlt: "",
});

const section = (title: string, headers?: string[]): SectionInput => ({
  ...emptySection(title),
  tableHeaders: headers ? headers.join(", ") : "",
});

/* ─────────────────────── per-discipline scaffolding ────────────────────── */

/**
 * Each track shows different things. An automation build lives or dies on its
 * I/O map and interlocks; a robotics build on its transform tree and handshake;
 * an embedded build on its register map and loop timing; a digital-design build
 * on its ISA and synthesis numbers. The template seeds those slots so the
 * interesting content has somewhere to go.
 */
const TEMPLATES: Record<
  ProjectCategory,
  { tradeoffs: string[]; sections: SectionInput[]; stack: string[] }
> = {
  automation: {
    tradeoffs: [
      "Programming language, and who maintains it",
      "Sensing and counting strategy",
      "Fault latching behaviour",
    ],
    sections: [
      section("Architecture"),
      section("I/O map", ["Tag", "Type", "Address", "Description"]),
      section("Interlocks and fault handling"),
      section("Evidence it works"),
    ],
    stack: ["CODESYS", "Factory I/O", "Structured Text", "Ignition"],
  },
  robotics: {
    tradeoffs: [
      "Estimation source, and where it degenerates",
      "Protocol and handshake robustness",
      "Resolution against compute",
    ],
    sections: [
      section("Architecture and TF tree"),
      section("Interface / handshake specification", [
        "Step",
        "A → B",
        "B → A",
        "Meaning",
      ]),
      section("Sensor and noise model"),
      section("Evidence it works"),
    ],
    stack: ["ROS 2", "Gazebo", "Python", "RViz"],
  },
  electronics: {
    tradeoffs: [
      "Measurement strategy, and where it gets noisy",
      "Where the control loop runs",
      "Command authority between interfaces",
    ],
    sections: [
      section("Architecture"),
      section("Register map", ["Address", "Type", "Access", "Description"]),
      section("Control loop timing"),
      section("Tuning data", [
        "Parameter",
        "Value",
        "Rise time",
        "Overshoot",
        "Note",
      ]),
      section("Evidence it works"),
    ],
    stack: ["ESP32", "PlatformIO", "FreeRTOS", "C++"],
  },
  "digital-design": {
    tradeoffs: [
      "Microarchitecture: single-cycle, multi-cycle or pipelined",
      "Instruction encoding",
      "Resource sizing",
    ],
    sections: [
      section("Architecture"),
      section("ISA / encoding", [
        "Opcode",
        "Mnemonic",
        "Operands",
        "Operation",
      ]),
      section("Verification"),
      section("Synthesis results", ["Metric", "Value"]),
    ],
    stack: ["Verilog", "Icarus Verilog", "GTKWave"],
  },
};

/* ──────────────────────────────── styles ───────────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  color: "var(--foreground)",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "var(--foreground-muted)",
  marginBottom: "0.4rem",
  display: "block",
  textTransform: "uppercase",
};

const hintStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--grey)",
  marginTop: 4,
  marginBottom: "0.5rem",
  display: "block",
  lineHeight: 1.5,
};

const sectionStyle: React.CSSProperties = { marginBottom: "2rem" };

const buttonStyle: React.CSSProperties = {
  padding: "0.55rem 1.1rem",
  background: "var(--accent)",
  color: "var(--charcoal)",
  border: "none",
  borderRadius: 6,
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: "0.05em",
};

const ghostButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "var(--background-secondary)",
  color: "var(--foreground-muted)",
  border: "1px solid var(--border)",
};

const removeButtonStyle: React.CSSProperties = {
  padding: "0.3rem 0.6rem",
  background: "transparent",
  border: "1px solid var(--border)",
  color: "var(--foreground-muted)",
  borderRadius: 4,
  fontSize: "0.75rem",
  cursor: "pointer",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "1rem",
  marginBottom: "1rem",
  background: "var(--background-secondary)",
};

/* ─────────────────────────── section sub-editor ────────────────────────── */

function SectionEditor({
  value,
  index,
  onChange,
  onRemove,
}: {
  value: SectionInput;
  index: number;
  onChange: (next: SectionInput) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof SectionInput>(key: K, v: SectionInput[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--accent)" }}
        >
          Block {index + 1}
        </span>
        <button style={removeButtonStyle} onClick={onRemove}>
          ✕
        </button>
      </div>

      <input
        style={{ ...inputStyle, marginBottom: "0.5rem" }}
        value={value.title}
        onChange={(e) => set("title", e.target.value)}
        placeholder="Block title, e.g. I/O map"
      />
      <textarea
        style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginBottom: "0.5rem" }}
        value={value.body}
        onChange={(e) => set("body", e.target.value)}
        placeholder="Prose (optional)"
      />
      <textarea
        style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
        value={value.bullets}
        onChange={(e) => set("bullets", e.target.value)}
        placeholder="Bullets (optional) — one per line"
      />
      <span style={hintStyle}>One bullet per line.</span>

      <input
        style={{ ...inputStyle, marginBottom: "0.5rem" }}
        value={value.tableHeaders}
        onChange={(e) => set("tableHeaders", e.target.value)}
        placeholder="Table headers (optional) — comma separated"
      />
      <textarea
        style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
        value={value.tableRows}
        onChange={(e) => set("tableRows", e.target.value)}
        placeholder="Table rows — one row per line, cells separated by |"
      />
      <span style={hintStyle}>
        One row per line, cells separated by <code>|</code>. Example:{" "}
        <code>StartPB | BOOL in | %IX0.0 | Momentary start</code>
      </span>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <input
          style={inputStyle}
          value={value.imageSrc}
          onChange={(e) => set("imageSrc", e.target.value)}
          placeholder="Figure path (optional)"
        />
        <input
          style={inputStyle}
          value={value.imageAlt}
          onChange={(e) => set("imageAlt", e.target.value)}
          placeholder="Figure alt text (required if path set)"
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────── page ─────────────────────────────────── */

export default function AdminPage() {
  const [category, setCategory] = useState<ProjectCategory>("automation");
  const [status, setStatus] = useState<ProjectStatus>("planned");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [date, setDate] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [stack, setStack] = useState<string[]>(TEMPLATES.automation.stack);
  const [links, setLinks] = useState<LinkInput[]>([{ label: "", url: "" }]);
  const [problem, setProblem] = useState("");
  const [approach, setApproach] = useState("");
  const [tradeoffs, setTradeoffs] = useState<SectionInput[]>(
    TEMPLATES.automation.tradeoffs.map((t) => emptySection(t))
  );
  const [sections, setSections] = useState<SectionInput[]>(
    TEMPLATES.automation.sections
  );
  const [nextTime, setNextTime] = useState<string[]>([""]);
  const [images, setImages] = useState<ImageInput[]>([{ src: "", alt: "" }]);
  const [videos, setVideos] = useState<string[]>([""]);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const autoSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  /** Changing the discipline reloads the scaffold — that is the point of it. */
  const applyTemplate = (next: ProjectCategory) => {
    setCategory(next);
    setTradeoffs(TEMPLATES[next].tradeoffs.map((t) => emptySection(t)));
    setSections(TEMPLATES[next].sections);
    setStack(TEMPLATES[next].stack);
  };

  const buildSection = (s: SectionInput) => {
    const out: Record<string, unknown> = { title: s.title };
    if (s.body.trim()) out.body = s.body.trim();

    const bullets = s.bullets
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
    if (bullets.length) out.bullets = bullets;

    const headers = s.tableHeaders
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    const rows = s.tableRows
      .split("\n")
      .map((r) => r.split("|").map((c) => c.trim()))
      .filter((r) => r.some(Boolean));
    if (headers.length && rows.length) out.table = { headers, rows };

    if (s.imageSrc.trim()) {
      out.image = { src: s.imageSrc.trim(), alt: s.imageAlt.trim() };
    }
    return out;
  };

  const usedSections = (list: SectionInput[]) =>
    list
      .filter((s) => s.title.trim())
      .map(buildSection)
      .filter((s) => Object.keys(s).length > 1);

  const generateCode = () => {
    const finalSlug = slug || autoSlug(title);
    const project: Record<string, unknown> = {
      slug: finalSlug,
      title,
      category,
      status,
      tagline,
    };
    if (date) project.date = date;
    project.thumbnail = thumbnail;
    project.thumbnailAlt = thumbnailAlt;
    project.stack = stack.filter((s) => s.trim());
    project.links = links.filter((l) => l.label && l.url);
    project.problem = problem;
    project.approach = approach;
    project.tradeoffs = usedSections(tradeoffs);
    project.sections = usedSections(sections);
    project.nextTime = nextTime.filter((n) => n.trim());
    project.images = images.filter((i) => i.src.trim());
    project.videos = videos.filter((v) => v.trim());

    setOutput(`  ${JSON.stringify(project, null, 2).replace(/\n/g, "\n  ")},`);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const missingAlt =
    (thumbnail.trim() && !thumbnailAlt.trim()) ||
    images.some((i) => i.src.trim() && !i.alt.trim()) ||
    [...tradeoffs, ...sections].some(
      (s) => s.imageSrc.trim() && !s.imageAlt.trim()
    );

  return (
    <div
      style={{
        paddingTop: 64,
        maxWidth: 860,
        margin: "0 auto",
        padding: "4rem 2rem 5rem",
      }}
    >
      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: "0.5rem",
        }}
      >
        Project Admin Tool
      </h1>
      <p
        style={{
          color: "var(--foreground-muted)",
          fontSize: "0.9rem",
          marginBottom: "2rem",
          lineHeight: 1.7,
        }}
      >
        Fill this in and paste the generated entry into the{" "}
        <code>projects</code> array in <code>src/data/projects.ts</code>. Pick
        the discipline first — it reloads the section scaffold below with the
        blocks that discipline actually needs (I/O maps, register maps, TF trees,
        ISA tables).
      </p>

      {/* Discipline + status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          ...sectionStyle,
        }}
      >
        <div>
          <label style={labelStyle}>Discipline / track</label>
          <select
            style={inputStyle}
            value={category}
            onChange={(e) => applyTemplate(e.target.value as ProjectCategory)}
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <span style={hintStyle}>
            Changing this replaces the trade-off and section scaffolds.
          </span>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <span style={hintStyle}>
            Anything not <em>Complete</em> renders a visible banner saying so.
          </span>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Project title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(autoSlug(e.target.value));
          }}
          placeholder="e.g. Automated Sorting & Conveyor Cell"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          ...sectionStyle,
        }}
      >
        <div>
          <label style={labelStyle}>Slug (URL path)</label>
          <input
            style={inputStyle}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="plc-sorting-conveyor-cell"
          />
        </div>
        <div>
          <label style={labelStyle}>Completion date</label>
          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <span style={hintStyle}>Leave blank if it isn&apos;t finished.</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Tagline</label>
        <textarea
          style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="One sentence, used on cards and under the title."
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          ...sectionStyle,
        }}
      >
        <div>
          <label style={labelStyle}>Thumbnail path</label>
          <input
            style={inputStyle}
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="/projects/your-slug/hero.png"
          />
          <span style={hintStyle}>
            Leave blank for a styled placeholder — never point at a file that
            doesn&apos;t exist.
          </span>
        </div>
        <div>
          <label style={labelStyle}>Thumbnail alt text</label>
          <input
            style={inputStyle}
            value={thumbnailAlt}
            onChange={(e) => setThumbnailAlt(e.target.value)}
            placeholder="Describe what the figure shows"
          />
        </div>
      </div>

      {/* Stack */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Stack / tools</label>
        {stack.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              style={inputStyle}
              value={item}
              onChange={(e) => {
                const next = [...stack];
                next[i] = e.target.value;
                setStack(next);
              }}
              placeholder="e.g. CODESYS"
            />
            <button
              style={removeButtonStyle}
              onClick={() => setStack(stack.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button style={ghostButtonStyle} onClick={() => setStack([...stack, ""])}>
          + Add tool
        </button>
      </div>

      {/* Links */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Links</label>
        {links.map((link, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr auto",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <input
              style={inputStyle}
              value={link.label}
              onChange={(e) => {
                const next = [...links];
                next[i] = { ...next[i], label: e.target.value };
                setLinks(next);
              }}
              placeholder="Label"
            />
            <input
              style={inputStyle}
              value={link.url}
              onChange={(e) => {
                const next = [...links];
                next[i] = { ...next[i], url: e.target.value };
                setLinks(next);
              }}
              placeholder="https://..."
            />
            <button
              style={removeButtonStyle}
              onClick={() => setLinks(links.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          style={ghostButtonStyle}
          onClick={() => setLinks([...links, { label: "", url: "" }])}
        >
          + Add link
        </button>
      </div>

      {/* Decision record */}
      <h2
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--accent)",
          marginTop: "3rem",
          marginBottom: "0.5rem",
        }}
      >
        Engineering decision record
      </h2>
      <p style={{ ...hintStyle, marginBottom: "1.5rem" }}>
        Problem → Approach → Trade-offs with data → What I&apos;d do
        differently. This is the shape a hiring manager reads; it is not a
        tutorial.
      </p>

      <div style={sectionStyle}>
        <label style={labelStyle}>The problem</label>
        <textarea
          style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="What had to be solved, and why it isn't trivial. Name the failure modes that make it hard."
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Approach</label>
        <textarea
          style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          placeholder="How you approached it and the shape of the solution."
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Trade-offs</label>
        <span style={hintStyle}>
          One block per decision that had a real alternative. Put the numbers in
          a table — &ldquo;it felt stable&rdquo; is not evidence.
        </span>
        {tradeoffs.map((s, i) => (
          <SectionEditor
            key={i}
            value={s}
            index={i}
            onChange={(next) => {
              const list = [...tradeoffs];
              list[i] = next;
              setTradeoffs(list);
            }}
            onRemove={() => setTradeoffs(tradeoffs.filter((_, j) => j !== i))}
          />
        ))}
        <button
          style={ghostButtonStyle}
          onClick={() => setTradeoffs([...tradeoffs, emptySection()])}
        >
          + Add trade-off
        </button>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Design detail — {CATEGORY_LABELS[category]}
        </label>
        <span style={hintStyle}>
          Scaffolded for this discipline. Delete what doesn&apos;t apply.
        </span>
        {sections.map((s, i) => (
          <SectionEditor
            key={i}
            value={s}
            index={i}
            onChange={(next) => {
              const list = [...sections];
              list[i] = next;
              setSections(list);
            }}
            onRemove={() => setSections(sections.filter((_, j) => j !== i))}
          />
        ))}
        <button
          style={ghostButtonStyle}
          onClick={() => setSections([...sections, emptySection()])}
        >
          + Add block
        </button>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>What I&apos;d do differently</label>
        {nextTime.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <textarea
              style={{ ...inputStyle, minHeight: 54, resize: "vertical" }}
              value={n}
              onChange={(e) => {
                const next = [...nextTime];
                next[i] = e.target.value;
                setNextTime(next);
              }}
              placeholder="A specific change, and what you expect it to fix."
            />
            <button
              style={removeButtonStyle}
              onClick={() => setNextTime(nextTime.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button style={ghostButtonStyle} onClick={() => setNextTime([...nextTime, ""])}>
          + Add item
        </button>
      </div>

      {/* Gallery */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Gallery images</label>
        <span style={hintStyle}>Alt text is required, not optional.</span>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <input
              style={inputStyle}
              value={img.src}
              onChange={(e) => {
                const next = [...images];
                next[i] = { ...next[i], src: e.target.value };
                setImages(next);
              }}
              placeholder="/projects/slug/photo1.png"
            />
            <input
              style={inputStyle}
              value={img.alt}
              onChange={(e) => {
                const next = [...images];
                next[i] = { ...next[i], alt: e.target.value };
                setImages(next);
              }}
              placeholder="Alt text"
            />
            <button
              style={removeButtonStyle}
              onClick={() => setImages(images.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          style={ghostButtonStyle}
          onClick={() => setImages([...images, { src: "", alt: "" }])}
        >
          + Add image
        </button>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Videos</label>
        {videos.map((vid, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              style={inputStyle}
              value={vid}
              onChange={(e) => {
                const next = [...videos];
                next[i] = e.target.value;
                setVideos(next);
              }}
              placeholder="/projects/slug/demo.mp4"
            />
            <button
              style={removeButtonStyle}
              onClick={() => setVideos(videos.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button style={ghostButtonStyle} onClick={() => setVideos([...videos, ""])}>
          + Add video
        </button>
      </div>

      {missingAlt && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: 6,
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          One or more images have a path but no alt text. Every figure needs a
          description of what it shows.
        </p>
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button style={buttonStyle} onClick={generateCode}>
          GENERATE PROJECT CODE
        </button>
      </div>

      {output && (
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <label style={labelStyle}>Generated code</label>
            <button
              style={{
                ...removeButtonStyle,
                color: copied ? "var(--teal)" : "var(--accent)",
              }}
              onClick={copyToClipboard}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "1rem",
              fontSize: "0.78rem",
              overflow: "auto",
              maxHeight: 420,
              lineHeight: 1.5,
              color: "var(--foreground-muted)",
            }}
          >
            {output}
          </pre>
          <p style={{ ...hintStyle, marginTop: "0.75rem" }}>
            Paste inside the <code>projects</code> array in{" "}
            <code>src/data/projects.ts</code>, and put any images in{" "}
            <code>public/projects/{slug || "your-slug"}/</code>.
          </p>
        </div>
      )}
    </div>
  );
}
