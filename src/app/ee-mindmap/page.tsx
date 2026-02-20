"use client";

import dynamic from "next/dynamic";

const EEMindMap = dynamic(() => import("@/components/EEMindMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        color: "var(--foreground-muted)",
      }}
    >
      Loading Mind Map...
    </div>
  ),
});

export default function EEMindMapPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      <EEMindMap />
    </div>
  );
}
