"use client";

import { useState } from "react";

interface StepInput {
  title: string;
  content: string;
  image: string;
}

interface LinkInput {
  label: string;
  url: string;
}

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [thumbnail, setThumbnail] = useState("");
  const [overview, setOverview] = useState("");
  const [links, setLinks] = useState<LinkInput[]>([{ label: "", url: "" }]);
  const [materials, setMaterials] = useState<string[]>([""]);
  const [steps, setSteps] = useState<StepInput[]>([
    { title: "", content: "", image: "" },
  ]);
  const [images, setImages] = useState<string[]>([""]);
  const [videos, setVideos] = useState<string[]>([""]);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const autoSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const generateCode = () => {
    const project = {
      slug: slug || autoSlug(title),
      title,
      date,
      thumbnail: thumbnail || `/projects/${slug || autoSlug(title)}/thumbnail.jpg`,
      overview,
      links: links.filter((l) => l.label && l.url),
      materials: materials.filter((m) => m.trim()),
      steps: steps
        .filter((s) => s.title && s.content)
        .map((s) => ({
          title: s.title,
          content: s.content,
          ...(s.image ? { image: s.image } : {}),
        })),
      images: images.filter((i) => i.trim()),
      videos: videos.filter((v) => v.trim()),
    };

    const code = `  ${JSON.stringify(project, null, 2).replace(/\n/g, "\n  ")},`;
    setOutput(code);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.8rem",
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "var(--foreground)",
    fontSize: "0.9rem",
    outline: "none",
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

  const sectionStyle: React.CSSProperties = {
    marginBottom: "2rem",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "var(--accent)",
    color: "var(--charcoal)",
    border: "none",
    borderRadius: 6,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.05em",
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

  return (
    <div
      style={{
        paddingTop: 64,
        maxWidth: 800,
        margin: "0 auto",
        padding: "5rem 2rem",
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
          lineHeight: 1.6,
        }}
      >
        Fill in the details below to generate a project entry. Copy the output
        and paste it into{" "}
        <code
          style={{
            background: "var(--background-secondary)",
            padding: "0.15rem 0.4rem",
            borderRadius: 4,
            fontSize: "0.85rem",
          }}
        >
          src/data/projects.ts
        </code>{" "}
        inside the <code style={{
            background: "var(--background-secondary)",
            padding: "0.15rem 0.4rem",
            borderRadius: 4,
            fontSize: "0.85rem",
          }}>projects</code> array.
      </p>

      {/* Basic Info */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Project Title</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(autoSlug(e.target.value));
          }}
          placeholder="e.g. Magic Mirror"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", ...sectionStyle }}>
        <div>
          <label style={labelStyle}>Slug (URL path)</label>
          <input
            style={inputStyle}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="magic-mirror"
          />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Thumbnail Path</label>
        <input
          style={inputStyle}
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="/projects/magic-mirror/thumbnail.jpg"
        />
        <span style={{ fontSize: "0.75rem", color: "var(--grey)", marginTop: 4, display: "block" }}>
          Place images in public/projects/your-slug/ folder
        </span>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Overview</label>
        <textarea
          style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          placeholder="Describe your project..."
        />
      </div>

      {/* Links */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Relevant Links</label>
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
                const updated = [...links];
                updated[i].label = e.target.value;
                setLinks(updated);
              }}
              placeholder="Label"
            />
            <input
              style={inputStyle}
              value={link.url}
              onChange={(e) => {
                const updated = [...links];
                updated[i].url = e.target.value;
                setLinks(updated);
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
          style={{ ...buttonStyle, background: "var(--background-secondary)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
          onClick={() => setLinks([...links, { label: "", url: "" }])}
        >
          + Add Link
        </button>
      </div>

      {/* Materials */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Materials Needed</label>
        {materials.map((mat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <input
              style={inputStyle}
              value={mat}
              onChange={(e) => {
                const updated = [...materials];
                updated[i] = e.target.value;
                setMaterials(updated);
              }}
              placeholder="e.g. Raspberry Pi 4B"
            />
            <button
              style={removeButtonStyle}
              onClick={() =>
                setMaterials(materials.filter((_, j) => j !== i))
              }
            >
              ✕
            </button>
          </div>
        ))}
        <button
          style={{ ...buttonStyle, background: "var(--background-secondary)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
          onClick={() => setMaterials([...materials, ""])}
        >
          + Add Material
        </button>
      </div>

      {/* Steps */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Instructions (Steps)</label>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "1rem",
              background: "var(--background-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                Step {i + 1}
              </span>
              <button
                style={removeButtonStyle}
                onClick={() =>
                  setSteps(steps.filter((_, j) => j !== i))
                }
              >
                ✕
              </button>
            </div>
            <input
              style={{ ...inputStyle, marginBottom: "0.5rem" }}
              value={step.title}
              onChange={(e) => {
                const updated = [...steps];
                updated[i].title = e.target.value;
                setSteps(updated);
              }}
              placeholder="Step title"
            />
            <textarea
              style={{
                ...inputStyle,
                minHeight: 80,
                resize: "vertical",
                marginBottom: "0.5rem",
              }}
              value={step.content}
              onChange={(e) => {
                const updated = [...steps];
                updated[i].content = e.target.value;
                setSteps(updated);
              }}
              placeholder="Step description..."
            />
            <input
              style={inputStyle}
              value={step.image}
              onChange={(e) => {
                const updated = [...steps];
                updated[i].image = e.target.value;
                setSteps(updated);
              }}
              placeholder="Image path (optional): /projects/slug/step1.jpg"
            />
          </div>
        ))}
        <button
          style={{ ...buttonStyle, background: "var(--background-secondary)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
          onClick={() =>
            setSteps([...steps, { title: "", content: "", image: "" }])
          }
        >
          + Add Step
        </button>
      </div>

      {/* Images */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Gallery Images (Paths)</label>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <input
              style={inputStyle}
              value={img}
              onChange={(e) => {
                const updated = [...images];
                updated[i] = e.target.value;
                setImages(updated);
              }}
              placeholder="/projects/slug/photo1.jpg"
            />
            <button
              style={removeButtonStyle}
              onClick={() =>
                setImages(images.filter((_, j) => j !== i))
              }
            >
              ✕
            </button>
          </div>
        ))}
        <button
          style={{ ...buttonStyle, background: "var(--background-secondary)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
          onClick={() => setImages([...images, ""])}
        >
          + Add Image
        </button>
      </div>

      {/* Videos */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Videos (Paths or URLs)</label>
        {videos.map((vid, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <input
              style={inputStyle}
              value={vid}
              onChange={(e) => {
                const updated = [...videos];
                updated[i] = e.target.value;
                setVideos(updated);
              }}
              placeholder="/projects/slug/demo.mp4"
            />
            <button
              style={removeButtonStyle}
              onClick={() =>
                setVideos(videos.filter((_, j) => j !== i))
              }
            >
              ✕
            </button>
          </div>
        ))}
        <button
          style={{ ...buttonStyle, background: "var(--background-secondary)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}
          onClick={() => setVideos([...videos, ""])}
        >
          + Add Video
        </button>
      </div>

      {/* Generate */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button style={buttonStyle} onClick={generateCode}>
          GENERATE PROJECT CODE
        </button>
      </div>

      {/* Output */}
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
            <label style={labelStyle}>Generated Code</label>
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
              fontSize: "0.8rem",
              overflow: "auto",
              maxHeight: 400,
              lineHeight: 1.5,
              color: "var(--foreground-muted)",
            }}
          >
            {output}
          </pre>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--grey)",
              marginTop: "0.75rem",
              lineHeight: 1.6,
            }}
          >
            Paste this inside the <code>projects</code> array in{" "}
            <code>src/data/projects.ts</code>. Don&apos;t forget to place your
            images in the <code>public/projects/{slug || "your-slug"}/</code>{" "}
            folder.
          </p>
        </div>
      )}
    </div>
  );
}
