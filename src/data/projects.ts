export interface ProjectStep {
  title: string;
  content: string;
  image?: string;
}

export interface Project {
  slug: string;
  title: string;
  date: string;
  thumbnail: string;
  overview: string;
  links: { label: string; url: string }[];
  materials: string[];
  steps: ProjectStep[];
  images: string[];
  videos: string[];
}

// Sample projects — edit this array or use the admin tool to generate new entries
const projects: Project[] = [
  {
    slug: "sample-project",
    title: "Sample Project",
    date: "2026-01-15",
    thumbnail: "/projects/sample/thumbnail.jpg",
    overview:
      "This is a sample project to demonstrate the portfolio layout. Replace this with your actual project details.",
    links: [
      { label: "GitHub Repo", url: "https://github.com/felipeboubee" },
    ],
    materials: [
      "Arduino Uno",
      "Breadboard",
      "LEDs (assorted colors)",
      "220Ω resistors",
      "Jumper wires",
    ],
    steps: [
      {
        title: "Set up the circuit",
        content:
          "Connect the LEDs to the breadboard with the appropriate resistors. Wire them to the Arduino digital pins.",
        image: "/projects/sample/step1.jpg",
      },
      {
        title: "Write the firmware",
        content:
          "Open the Arduino IDE and write a simple blink pattern. Upload it to the board.",
      },
      {
        title: "Test and iterate",
        content:
          "Power on the circuit and verify the LEDs blink in the expected pattern. Adjust timing as needed.",
      },
    ],
    images: ["/projects/sample/thumbnail.jpg"],
    videos: [],
  },
];

export function getAllProjects(): Project[] {
  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
