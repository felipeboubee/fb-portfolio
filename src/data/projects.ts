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
    slug: "python-line-follower-sim",
    title: "Python Line Follower Simulator",
    date: "2026-08-04",
    thumbnail: "/projects/python-line-follower-sim/python-line-follower-sim.png",
    overview:
      "A differential-drive robot closing a proportional control loop in simulation — no hardware required, NumPy only. The project exists to make one control-theory lesson visible: proportional gain trades responsiveness against stability. Too low, and the robot under-reacts, sailing past the line before it can turn back. Too high, and every correction overshoots, so the robot thrashes in place instead of settling. Running the same starting offset (0.4 m) through three gains shows the whole trade-off in one figure: at Kp = 0.1 the path overshoots to −0.15 m and rings before damping out, at Kp = 4.0 it converges smoothly within about 2 m, and at Kp = 20.0 it never settles — burning almost all its motion on steering, covering 0.3 m of forward progress against 9.9 m for the other two.",
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/felipeboubee/python-line-follower-sim",
      },
    ],
    materials: [
      "Python 3.8+",
      "NumPy — the only runtime dependency for line_follower.py",
      "Matplotlib — needed only by generate_plots.py",
    ],
    steps: [
      {
        title: "Model the differential-drive robot",
        content:
          "Represent the robot by its pose (x, y, theta) and integrate a constant forward speed with a steering term. Left and right wheel speeds always average to base_v, so the two wheels differ only by the steering command.",
      },
      {
        title: "Build the error signal",
        content:
          "The error combines two terms: error = -y - 0.5 * theta. The first is lateral offset from the line. The second is heading — and because forward speed is constant in this model, heading stands in for the rate of change of the offset. So while Kp is a single proportional gain, the signal it acts on already carries a damping term, which makes the loop behave closer to PD than to a textbook pure-P controller.",
      },
      {
        title: "Close the proportional loop",
        content:
          "Multiply the error by Kp to get the steering command, apply it differentially to the wheel speeds, and step the kinematics forward. Keep line_follower.py importable so the simulation can be driven from other scripts.",
      },
      {
        title: "Sweep the gain and compare",
        content:
          "Run the same starting offset, reference line, and 400 steps at Kp = 0.1, 4.0, and 20.0. Plot the three paths side by side. Watch the third panel's x-axis in particular — because steering is differential, a huge correction spins the robot rather than advancing it.",
        image: "/projects/python-line-follower-sim/kp_comparison.png",
      },
      {
        title: "Regenerate the figures",
        content:
          "Install the dependencies with pip install -r requirements.txt, then run python generate_plots.py to rebuild both PNGs into results/. The committed figures are the ones the README displays.",
      },
    ],
    images: [
      "/projects/python-line-follower-sim/python-line-follower-sim.png",
      "/projects/python-line-follower-sim/kp_comparison.png",
    ],
    videos: [],
  },
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

// Dates are plain "YYYY-MM-DD" strings. `new Date("2026-08-04")` parses as UTC
// midnight, which formats as the previous day in any negative-offset timezone
// (Buenos Aires included), so build the date in local time instead.
export function formatProjectDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", options);
}
