import { getAllProjects, getUsedCategories } from "@/data/projects";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata = {
  title: "Projects | Felipe Boubee",
  description:
    "Automation, robotics, embedded and digital-design builds, each written up as an engineering decision record.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getUsedCategories();

  return (
    <div style={{ paddingTop: 64 }}>
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "4rem 2rem 5rem",
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
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: 680,
          }}
        >
          Automation and controls, robotics, embedded electronics and digital
          design. Each one is written up as an engineering decision record: the
          problem, the approach, the trade-offs that had real alternatives, and
          what a second pass would change. Status is labelled on every card.
        </p>

        <ProjectGrid projects={projects} categories={categories} />
      </section>
    </div>
  );
}
