export type ProjectCategory =
  | "automation"
  | "robotics"
  | "electronics"
  | "digital-design";

export type ProjectStatus = "complete" | "in-progress" | "planned";

export const CATEGORY_ORDER: ProjectCategory[] = [
  "automation",
  "robotics",
  "electronics",
  "digital-design",
];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  automation: "Automation & Controls",
  robotics: "Robotics",
  electronics: "Electronics & Embedded",
  "digital-design": "Digital Design",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  complete: "Complete",
  "in-progress": "In progress",
  planned: "Planned",
};

export interface ProjectImage {
  src: string;
  /** Required. Describe what the figure shows, not that it is a figure. */
  alt: string;
}

export interface SectionTable {
  headers: string[];
  rows: string[][];
}

/**
 * A track-specific detail block. One flexible shape covers what each discipline
 * actually needs to show: an architecture narrative, an I/O map or register map
 * (table), a list of interlocks, or tuning data (table + figure).
 */
export interface ProjectSection {
  title: string;
  body?: string;
  bullets?: string[];
  table?: SectionTable;
  image?: ProjectImage;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** One sentence, for cards and the page subtitle. */
  tagline: string;
  /** Completion date, "YYYY-MM-DD". Omit for work that isn't finished. */
  date?: string;
  /** Empty string renders a styled placeholder instead of a broken image. */
  thumbnail: string;
  thumbnailAlt: string;
  /** Tools and technologies, rendered as chips. */
  stack: string[];
  links: { label: string; url: string }[];

  // --- Engineering decision record ---
  /** What had to be solved, and why it is not trivial. */
  problem: string;
  /** How it was approached, and the shape of the solution. */
  approach: string;
  /** The decisions that had alternatives, with the data behind them. */
  tradeoffs: ProjectSection[];
  /** Discipline-specific detail: architecture, I/O map, interlocks, tuning. */
  sections: ProjectSection[];
  /** What a second pass would change. */
  nextTime: string[];

  images: ProjectImage[];
  videos: string[];
}

const projects: Project[] = [
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "python-line-follower-sim",
    title: "Python Line Follower Simulator",
    category: "robotics",
    status: "complete",
    tagline:
      "A differential-drive robot closing a proportional control loop in simulation, built to make the gain/stability trade-off visible.",
    date: "2026-08-04",
    thumbnail:
      "/projects/python-line-follower-sim/python-line-follower-sim.png",
    thumbnailAlt:
      "Plot of the robot's path converging smoothly onto the reference line at a proportional gain of 4.0",
    stack: ["Python 3.8+", "NumPy", "Matplotlib", "Proportional control"],
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/felipeboubee/python-line-follower-sim",
      },
    ],
    problem:
      "Proportional gain is the first thing you tune on any control loop and the first thing that misleads you. Textbooks state that gain trades responsiveness against stability; that sentence is easy to repeat and hard to feel. So I wanted a rig where you can watch the trade-off happen, with no hardware in the way: no motor driver to blame, no sensor noise to explain away, so anything odd on screen comes from the controller and nowhere else.",
    approach:
      "A differential-drive robot represented by its pose (x, y, theta), integrating a constant forward speed with a steering term derived from a single proportional gain. Left and right wheel speeds always average to base_v, so the two wheels differ only by the steering command. The whole simulation is NumPy, importable as a module, so the same run can be driven from a plotting script or a sweep. Three gains, one starting offset of 0.4 m, 400 steps each, plotted side by side.",
    tradeoffs: [
      {
        title: "Choosing the gain",
        body: "The same starting offset through three gains produces three qualitatively different outcomes. The numbers make the case better than any description of them:",
        table: {
          headers: ["Kp", "Behaviour", "Forward progress in 400 steps"],
          rows: [
            [
              "0.1",
              "Under-reacts: overshoots to −0.15 m, then rings back and forth before damping out",
              "9.9 m",
            ],
            [
              "4.0",
              "Converges smoothly with no overshoot, settling onto the line within ~2 m",
              "9.9 m",
            ],
            [
              "20.0",
              "Over-corrects every step; the error flips sign each step and never settles",
              "0.3 m",
            ],
          ],
        },
      },
      {
        title: "Why the high-gain failure looks the way it does",
        body: "The third case is the instructive one. Steering here is differential, so an over-large correction spins the robot instead of advancing it. The robot covers 0.3 m in the same 400 steps that carry the other two runs 9.9 m. Excess gain costs throughput, which is not what the word \"oscillation\" prepares you for, and here it is a 33× loss from one badly chosen constant.",
        image: {
          src: "/projects/python-line-follower-sim/kp_comparison.png",
          alt: "Three side-by-side plots of the robot path at proportional gains of 0.1, 4.0 and 20.0, showing ringing, smooth convergence, and unstable thrashing respectively",
        },
      },
      {
        title: "One gain, but not a pure-P loop",
        body: "The error signal combines two terms: error = -y - 0.5 * theta. The first is lateral offset from the line. The second is heading, and because forward speed is constant in this model, heading stands in for the rate of change of the offset. So Kp is a single proportional gain, but the signal it acts on already carries a damping term. That puts the loop closer to PD than to a textbook pure-P controller. Worth saying plainly, because the smooth convergence at Kp = 4.0 would be harder to get without it.",
      },
    ],
    sections: [
      {
        title: "Known simplifications",
        body: "Both of these would change the results, and the high-gain case most of all:",
        bullets: [
          "Wheel speeds are unbounded. vL and vR always average to base_v, so steering never eats into forward speed. A real robot's motors saturate, which would change the high-gain behaviour considerably.",
          "There is no sensor model. The controller reads the true lateral offset directly. A physical line follower infers it from a discrete IR array, with quantization and noise.",
        ],
      },
      {
        title: "Running it",
        body: "python line_follower.py, no hardware required, NumPy only. To regenerate both figures into results/: pip install -r requirements.txt, then python generate_plots.py. Requires Python 3.8+; Matplotlib is needed only by the plotting script.",
      },
    ],
    nextTime: [
      "Bound the wheel speeds so the motors saturate, and re-run the Kp = 20 case. I expect the failure mode to change from spinning-in-place to a slower limit cycle.",
      "Add a discrete IR sensor array model with quantization and noise, so the controller has to infer the offset instead of being handed it.",
      "Port the same loop onto the ESP32 in the networked motor controller build, so the simulated tuning can be checked against a real plant.",
    ],
    images: [
      {
        src: "/projects/python-line-follower-sim/python-line-follower-sim.png",
        alt: "Plot of the robot's path converging onto the reference line at a proportional gain of 4.0",
      },
      {
        src: "/projects/python-line-follower-sim/kp_comparison.png",
        alt: "Three side-by-side plots comparing robot paths at proportional gains of 0.1, 4.0 and 20.0",
      },
    ],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "python-sensor-logger",
    title: "Python Sensor Logger",
    category: "automation",
    status: "complete",
    tagline:
      "A fixed-rate acquisition loop that timestamps every sample, survives intermittent sensor failures without losing a row, and writes a CSV you can audit afterwards.",
    date: "2026-08-17",
    thumbnail: "/projects/python-sensor-logger/sensor_log_dark.png",
    thumbnailAlt:
      "Two-panel plot of a 5-second acquisition run at 20 Hz, with six read failures marked on the logged trace",
    stack: ["Python 3.8+", "Matplotlib", "CSV", "Fixed-rate acquisition"],
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/felipeboubee/python-sensor-logger",
      },
    ],
    problem:
      "A data logger has two jobs that pull against each other. It has to sample on a schedule, and it has to keep sampling when the sensor misbehaves. The scheduling half is where drift creeps in: sleeping a flat 50 ms per iteration adds every read, every write and every scheduling hiccup onto the period, so the run falls behind its own clock and the timestamps stop meaning what they claim to mean. The failure half is worse, because the obvious responses to a bad read all damage the record in ways that are hard to see later.",
    approach:
      "Two pieces, kept apart. The loop in logger.py advances an absolute deadline instead of sleeping a fixed interval, so time spent inside a read is absorbed by a correspondingly shorter sleep. reader.py wraps the raw sensor call, so a read that raises, returns None or returns a non-finite value comes back as a sentinel, and readings outside the rated range are clamped. The loop itself has no error handling and does not need any. A simulated rangefinder with Gaussian noise and a 5% failure rate stands in for hardware, so the whole pipeline runs anywhere.",
    tradeoffs: [
      {
        title: "What to write when a read fails",
        body: "Four options, and three of them quietly damage the record. The sentinel is 99.0 m, which sits outside the [0, 10] m valid range and is deliberately never passed through the clamp that constrains real readings. Every substituted sample is therefore recoverable from the CSV alone with distance == 99.0, which is exactly how the plotting code finds the markers for both panels.",
        table: {
          headers: ["Option", "What it does to the record"],
          rows: [
            [
              "Drop the sample",
              "Shortens the run and breaks the assumption that row n is 50 ms after row n−1",
            ],
            [
              "Hold the last good value",
              "A dead sensor reads as a stationary target, which you discover long afterwards if at all",
            ],
            [
              "Write NaN",
              "Defensible, but it propagates through arithmetic and gets silently dropped downstream",
            ],
            [
              "Sentinel outside the range",
              "Keeps the sample count, stays identifiable, and cannot be read back as a measurement",
            ],
          ],
        },
      },
      {
        title: "An absolute deadline instead of a flat sleep",
        body: "Sleeping dt per iteration is one line shorter and accumulates every delay in the loop. Advancing next_t by dt and sleeping until that deadline means a slow read shortens the next sleep rather than pushing the whole schedule back. The committed run shows it working: one OS scheduling hiccup at t = 2.15 s produced a 69 ms interval, the next interval came back at 31 ms, and the two sum to exactly 100 ms. Net drift, zero. A flat sleep would have kept those 19 ms, and every timestamp after that point would have been late by at least that much.",
      },
    ],
    sections: [
      {
        title: "Measured performance",
        body: "From the run committed in results/, at a 5.0 s duration and a 20 Hz target rate against a 2.0 m simulated target:",
        table: {
          headers: ["Metric", "Result"],
          rows: [
            ["Samples recorded", "100 over a 4.95 s span"],
            ["Mean sample rate", "20.00 Hz; mean and median interval both 50.0 ms"],
            ["Interval accuracy", "97 of 99 intervals landed at exactly 50 ms"],
            ["Worst case", "one 69 ms interval at t = 2.15 s, then a 31 ms interval"],
            ["Net drift from that hiccup", "0 ms; the two intervals sum to 100 ms"],
            ["Read failures", "6 of 100 samples, against a 5.0% injected rate"],
            ["Failures that lost a sample", "0; every one produced a timestamped row"],
            ["Range clamps applied", "0"],
            ["Valid readings", "94, mean 1.945 m and σ 1.015 m against a 2.0 m target"],
          ],
        },
        image: {
          src: "/projects/python-sensor-logger/sensor_log_dark.png",
          alt: "Two-panel plot of a 5-second run at 20 Hz. The top panel shows the log as written, with six read failures spiking to the 99 m sentinel and marked with red crosses. The bottom panel shows the same run restricted to the measured range, where the substituted samples appear as red vertical rules.",
        },
      },
      {
        title: "Module layout",
        table: {
          headers: ["Module", "Responsibility"],
          rows: [
            ["sensor.py", "Simulated rangefinder: Gaussian noise, 5% read failures"],
            ["reader.py", "Wraps a read with error handling, validation and clamping"],
            ["logger.py", "Fixed-rate acquisition loop; returns (time, value) rows"],
            ["recorder.py", "CSV write and read-back"],
            ["plotting.py", "Two-panel time series with substituted samples marked"],
            ["config.py", "Rate, duration, valid range, sentinel"],
          ],
        },
      },
      {
        title: "A bug worth recording",
        body: "The first version of run() accepted a duration argument and never used it. It paced itself correctly at 20 Hz and ran until interrupted, accumulating nothing and returning nothing, so it produced no data while doing so. The fix anchors a start time t0, bounds the loop on elapsed time, accumulates rows and returns them. t0 and next_t stay separate on purpose: t0 decides when the run stops, next_t decides when the next sample is due. Merging them would put back the drift that the 69 ms recovery above shows the loop absorbing.",
      },
      {
        title: "Known limitations",
        bullets: [
          "The timestamp marks when the read was issued, not when the value arrived. That is fine while reads are fast relative to the 50 ms period, and it would need revisiting for a sensor with a long or variable response time.",
          "If a read overruns the period, the loop stays behind by that much instead of skipping a sample to catch up. The record stays contiguous and carries a small permanent offset.",
          "The sensor is simulated. Gaussian noise and a uniform 5% failure rate are a convenient model, not a measured one. Real rangefinders tend to fail in correlated bursts, which this would not reproduce.",
        ],
      },
    ],
    nextTime: [
      "Timestamp the arrival as well as the request, so a slow sensor shows up in the record instead of disappearing into the period.",
      "Replace the uniform failure rate with bursts, which is closer to how a flaky bus behaves, and check the sentinel handling still leaves a readable record.",
      "Write to a rolling file with a size bound. A 5-second run hides every problem that only appears over hours.",
      "Point it at a real sensor over serial or I2C and find out how much of the 50 ms budget the read actually costs.",
    ],
    images: [
      {
        src: "/projects/python-sensor-logger/sensor_log_dark.png",
        alt: "Two-panel plot of a 5-second acquisition run at 20 Hz, showing six read failures as spikes to the 99 m sentinel above and as marked gaps in the measured range below",
      },
    ],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "python-obstacle-detection-system",
    title: "Obstacle Detection System",
    category: "automation",
    status: "complete",
    tagline:
      "A noisy distance stream turned into a stable CLEAR / WARNING / DANGER verdict, using a median filter and a state machine whose enter and exit thresholds differ.",
    date: "2026-09-07",
    thumbnail:
      "/projects/python-obstacle-detection-system/approach-classified-dark.png",
    thumbnailAlt:
      "A noisy approach from 2.0 m to 0.2 m with the classification drawn as coloured bands, crossing into WARNING then DANGER without flicker",
    stack: [
      "Python 3.8+",
      "Matplotlib",
      "Median filtering",
      "Hysteresis",
      "State machine",
    ],
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/felipeboubee/python-obstacle-detection-system",
      },
    ],
    problem:
      "A distance sensor parked near a 0.9 m threshold reads 0.91, 0.89, 0.90, 0.88. Test each of those against a single threshold and the verdict changes every few samples, so a robot driving on that output lurches, stops, and lurches again. Outliers are not the difficulty here: a median filter removes those, and this signal has none. The difficulty is that the signal is sitting on the line, which is the one case where a classifier with a single threshold per boundary has no stable answer available to it.",
    approach:
      "Cleaning and deciding live in separate modules. filtering.py rejects None, nan and inf, clips into the sensor's rated range, and takes the median of the last five samples; it accepts a list of numbers and returns a number, with no state and no verdicts anywhere in it. detector.py owns the state and four thresholds, and every branch tests the current state alongside the distance, so entering a state and leaving it happen at different distances. The pipeline reads: validate, clip, median of the last 5, state machine, verdict.",
    tradeoffs: [
      {
        title: "Two thresholds per boundary instead of one",
        body: "Once the detector is in WARNING it does not leave until the distance exceeds 1.1 m, and 0.016 m of noise does not carry a signal 0.2 m. The gap is sized against whatever survives the filter: a median over five samples of a signal carrying 0.03 m of raw noise wobbles by about 0.016 m, which puts its three-sigma spread near 0.05 m. A 0.20 m margin is roughly four times that, so noise alone cannot push a reading back across a boundary it has just crossed.",
        table: {
          headers: [
            "Boundary",
            "Enter below",
            "Exit above",
            "Margin",
            "Fraction of the enter threshold",
          ],
          rows: [
            ["WARNING", "0.9 m", "1.1 m", "0.20 m", "22%"],
            ["DANGER", "0.4 m", "0.6 m", "0.20 m", "50%"],
          ],
        },
        image: {
          src: "/projects/python-obstacle-detection-system/hysteresis-before-after-dark.png",
          alt: "Two panels over the same hovering signal. The top panel, classified with a single 0.9 m threshold, is striped with alternating CLEAR and WARNING bands from 16 transitions. The bottom panel, with separate 0.9 m enter and 1.1 m exit thresholds, is one unbroken WARNING band after a single transition.",
        },
      },
      {
        title: "What the margin costs",
        body: "The margin is not free, and it is paid on the way out. At 0.20 m the detector holds DANGER until the obstacle is 0.6 m away, so a robot that has already stopped stays stopped through an extra 0.2 m of retreat. Both boundaries use the same margin here because these scenarios put the same noise at every distance. A real range sensor is usually noisier far away than close up, which would argue for a wider margin at WARNING than at DANGER.",
      },
      {
        title: "Median rather than mean, and validation before clipping",
        body: "Over [1.5, 1.5, 90.0, 1.5, 1.5] the median is 1.5 and the mean is about 19. The window is five samples and odd on purpose, so the median is an actual reading rather than the average of two, and four neighbours outvote one outlier. Validation runs before clipping for a related reason: clipping nan returns nan, so an invalid reading would otherwise enter the window looking like a real one.",
      },
    ],
    sections: [
      {
        title: "Verifying it",
        body: "One run proves little when the input is random, so verify_stability.py repeats every scenario across 200 seeds and reports the transition count as a range. The expected counts are known in advance: the spike run has to produce 0, because one outlier should never reach the classifier; hovering has to produce 1, settling into WARNING and staying there; the approach has to produce 2, one per boundary crossed.",
        table: {
          headers: ["Scenario", "Min", "Max", "Mean"],
          rows: [
            ["spike", "0", "0", "0.0"],
            ["hovering", "1", "1", "1.0"],
            ["approach", "2", "2", "2.0"],
            ["hovering, one threshold", "6", "32", "18.8"],
          ],
        },
      },
      {
        title: "Why it has to be a state machine",
        body: "A chain of if statements on the distance alone cannot express this, because the same reading means different things depending on where the detector already was. At 1.0 m the verdict is WARNING if the detector was already in WARNING, and CLEAR if it was CLEAR. Testing the state first also caps each pass at one transition, so a single reading cannot skip a level.",
      },
      {
        title: "Module layout",
        table: {
          headers: ["File", "Responsibility"],
          rows: [
            [
              "filtering.py",
              "Cleaning. Rejects None, nan and inf, clips to range, takes the median. Pure and stateless",
            ],
            [
              "detector.py",
              "The decision. ObstacleDetector holds the state and the four thresholds",
            ],
            [
              "scenarios.py",
              "Test data: an approach, a stream with one absurd spike, a signal hovering on a threshold",
            ],
            ["config.py", "Every tunable value in one place"],
            ["main.py", "Wires the pieces together and counts state changes"],
            ["plot_results.py", "Renders the two figures above"],
            ["verify_stability.py", "Re-runs each scenario over many seeds"],
          ],
        },
      },
      {
        title: "Known limitations",
        bullets: [
          "Both boundaries use the same 0.20 m margin. These scenarios justify that and a real sensor would not, because range noise usually grows with distance.",
          "The scenarios are generated, not recorded. Gaussian noise on a clean ramp is a convenient model; a real rangefinder returns correlated errors, dropouts and surface-dependent bias.",
          "Leaving DANGER returns the detector to WARNING rather than re-evaluating both boundaries at once, so a fast retreat still steps through WARNING on its way to CLEAR. That falls out of capping each pass at one transition.",
        ],
      },
    ],
    nextTime: [
      "Scale the margin with distance, since range noise usually grows with it, and re-run the seed sweep to check the transition counts still hold.",
      "Feed it recorded sensor data instead of generated scenarios, which is where correlated noise and dropouts would show up.",
      "Add a minimum dwell time per state, so a genuine fast approach cannot cross both boundaries inside two samples.",
      "Wire the verdict into the line follower's control loop, so it gates motion instead of being printed.",
    ],
    images: [
      {
        src: "/projects/python-obstacle-detection-system/approach-classified-dark.png",
        alt: "A noisy 2.0 m to 0.2 m approach with the classification drawn as coloured bands. Two transitions: CLEAR to WARNING at the 0.9 m line, WARNING to DANGER at the 0.4 m line. Neither boundary flickers.",
      },
      {
        src: "/projects/python-obstacle-detection-system/hysteresis-before-after-dark.png",
        alt: "The same hovering signal classified two ways: one threshold gives 16 transitions and a striped plot, separate enter and exit thresholds give a single transition and one unbroken band.",
      },
    ],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "plc-sorting-conveyor-cell",
    title: "Automated Sorting & Conveyor Cell",
    category: "automation",
    status: "planned",
    tagline:
      "A conveyor sorting station in a soft-PLC and a 3D factory simulator: state-machine logic, seal-in start/stop, e-stop interlocks, item counting, diverting and an HMI.",
    thumbnail: "",
    thumbnailAlt: "",
    stack: [
      "CODESYS",
      "Factory I/O",
      "Structured Text",
      "SFC",
      "CODESYS Visualization",
      "Git",
    ],
    links: [],
    problem:
      "A sorting station has to run unattended and fail safely, which makes it a much harder problem than 'turn the conveyor on'. It starts and stops from momentary pushbuttons and has to stay in the state it was put in. The e-stop has to stop it, and releasing the e-stop must not start it again. It has to count items without double-counting the one that happens to be sitting under the photoeye when the belt stalls. And the divert decision has to be tied to position, not just to a sensor being made, or it pushes the wrong item.",
    approach:
      "The control logic is one state machine with exactly one step active at a time (idle → running → sorting → fault), so the behaviour is reviewable and a fault stays local. Start/stop is a seal-in rung. The e-stop is a hardwired series circuit the PLC observes but never overrides. Items are counted on the rising edge of the photoeye, not on its level. The divert output is gated on both the sort sensor and the conveyor actually running. An HMI on top exposes run/stop, the item count and a fault indicator. That is enough for an operator to work with and little enough that it does not hide the logic.",
    tradeoffs: [
      {
        title: "Structured Text for the sequencer, ladder for the motor rungs",
        body: "ST diffs readably in Git and can be reasoned about as text, which matters for a portfolio repo and for review. But the motor and safety rungs stay in ladder, because that is what a maintenance electrician will be standing in front of at 3 a.m. One language everywhere would be tidier for me and worse for them.",
      },
      {
        title: "Edge counting over level counting",
        body: "Counting while the photoeye is made is the obvious implementation and it is wrong: if the belt stalls or an item is long, the count runs away. Rising-edge detection with a short debounce counts transitions instead of time, so a stalled belt holds the count instead of inflating it. The failure it prevents is a silent one. The cell keeps running and just reports the wrong number, which is the kind of bug you want gone by design, because testing rarely catches it.",
      },
      {
        title: "Latching faults instead of auto-clearing",
        body: "A fault that clears itself when the condition goes away produces a cell that restarts on its own. That is a safety problem, and it also destroys the evidence of what went wrong. Latching the fault and requiring an explicit reset costs the operator one extra button press and leaves an accurate record behind.",
      },
    ],
    sections: [
      {
        title: "Architecture",
        body: "Factory I/O models the physical cell (conveyor, item photoeye, inductive sort sensor, diverter/pusher, start/stop/e-stop) and exchanges I/O with the CODESYS soft-PLC. The PLC holds all the logic; the simulator holds none. The HMI is a CODESYS visualization reading the same variables, so there is a single source of truth for cell state.",
      },
      {
        title: "I/O map",
        table: {
          headers: ["Tag", "Type", "Address", "Description"],
          rows: [
            ["StartPB", "BOOL in", "%IX0.0", "Momentary start, NO"],
            ["StopPB", "BOOL in", "%IX0.1", "Momentary stop, NC (fail-safe)"],
            ["EStop_OK", "BOOL in", "%IX0.2", "E-stop circuit healthy, NC"],
            ["ItemSensor", "BOOL in", "%IX0.3", "Photoeye, item present"],
            ["SortSensor", "BOOL in", "%IX0.4", "Inductive, metal item"],
            ["ConveyorRun", "BOOL out", "%QX0.0", "Conveyor motor contactor"],
            ["Diverter", "BOOL out", "%QX0.1", "Pusher solenoid"],
            ["FaultLamp", "BOOL out", "%QX0.2", "Fault indicator"],
          ],
        },
      },
      {
        title: "Interlocks and fault handling",
        bullets: [
          "The e-stop is a hardwired NC series circuit. The PLC reads its state for annunciation but never grants motion on its own.",
          "Stop is wired NC, so a broken wire stops the cell rather than disabling the stop button.",
          "ConveyorRun requires EStop_OK AND NOT Fault AND state = running. All three, every scan.",
          "Diverter is inhibited unless the conveyor is running and the item is at the sort position.",
          "Faults latch and require an explicit reset; releasing the e-stop does not restart the cell.",
        ],
      },
      {
        title: "Evidence it works",
        body: "The deliverable includes an I/O list, a written control narrative, and a FAT checklist covering each interlock and the count accuracy, plus a recording of the cell running and of each fault being forced. A build is only demonstrated if the proof is in the repo.",
      },
    ],
    nextTime: [
      "Expose the cell over OPC-UA rather than direct simulator I/O mapping, so the same logic can drive real hardware without rework.",
      "Add retentive counters that survive a power cycle, and an alarm history rather than a single fault lamp.",
      "Port the program to ABB Automation Builder. It is CODESYS-based, so the logic should transfer nearly unchanged, and I would rather prove that than assume it.",
    ],
    images: [],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "pid-process-control-scada",
    title: "Closed-Loop PID Process Control + SCADA",
    category: "automation",
    status: "planned",
    tagline:
      "A tank-level and temperature loop under PID control with engineering-unit scaling, live trends, acknowledged alarms and a documented tuning report.",
    thumbnail: "",
    thumbnailAlt: "",
    stack: [
      "CODESYS",
      "Factory I/O (analog)",
      "Ignition",
      "Python",
      "Matplotlib",
      "PID",
    ],
    links: [],
    problem:
      "Holding a setpoint is easy. Holding it while the load changes, without oscillating the valve to death, and with an operator able to see what is happening, is not. This build has to close an analog loop, scale a raw signal into units a human can read, and make the loop observable enough that a bad tune shows up as a trend before someone complains about it. A discrete-logic project touches none of that.",
    approach:
      "An analog level or temperature signal drives a PID function block in the PLC, which drives a pump, valve or heater to hold a setpoint. The raw signal is scaled to engineering units at the edge, so every layer above it speaks in metres or degrees. Ignition provides the SCADA layer: live PV/SP/OP, a trend, alarms with acknowledgement, and setpoint entry. Tuning is done from step responses and documented as plots, not as 'it felt stable'.",
    tradeoffs: [
      {
        title: "P, PI or PID — decided per loop, not once",
        body: "Proportional-only leaves a steady-state offset (droop) that is unacceptable on level. Adding integral removes the offset but adds phase lag and overshoot. Derivative helps on a slow thermal loop where it predicts the approach to setpoint, but on a level signal it amplifies sensor noise into valve movement. So: PI for level, PID for temperature. Using one structure for both would be less code and a noisier valve.",
      },
      {
        title: "Ziegler–Nichols as a starting point, not an answer",
        body: "Z-N gets you into the right order of magnitude fast, and it deliberately targets roughly quarter-amplitude damping. That is more oscillation than a real valve should be asked to deliver for years. So the plan is Z-N for the first pass, then detune the controller gain and accept a slower rise in exchange for less overshoot and less actuator wear. The table below is where that trade gets written down.",
        table: {
          headers: [
            "Loop",
            "Structure",
            "Rise time",
            "Overshoot",
            "Settling",
            "Note",
          ],
          rows: [
            [
              "Level",
              "PI, Z-N first pass",
              "fast",
              "high",
              "long",
              "Oscillatory; too aggressive for sustained operation",
            ],
            [
              "Level",
              "PI, detuned",
              "slower",
              "low",
              "shorter",
              "Target: monotonic approach, minimal valve reversals",
            ],
            [
              "Temperature",
              "PID",
              "slow by nature",
              "low",
              "moderate",
              "Derivative earns its place on a lagging process",
            ],
          ],
        },
      },
      {
        title: "Scaling at the edge rather than in the SCADA",
        body: "Converting raw counts to engineering units in the PLC means the HMI, the trends, the alarm limits and the historian all agree by construction. Scaling in the presentation layer instead is quicker to implement and opens a class of bug where the alarm fires at one value and the trend shows another.",
      },
    ],
    sections: [
      {
        title: "Architecture",
        body: "The process is either a Factory I/O analog scene or a first-order-plus-dead-time model in Python, chosen so the loop sees realistic lag. The PLC runs the PID and the scaling. Ignition sits above it for trends, alarms and operator entry. The tuning plots are generated in Python from logged step responses, so the report is reproducible rather than screenshotted.",
      },
      {
        title: "Signal scaling",
        body: "A 4–20 mA transmitter maps to raw counts in the PLC, and raw counts map linearly to engineering units: EU = (raw − raw_min) / (raw_max − raw_min) × span + EU_min. Living at 4 mA instead of 0 mA is what makes a broken wire distinguishable from a genuine zero reading. That is the reason the standard exists, and it belongs in the control narrative.",
      },
      {
        title: "Alarms and acknowledgement",
        bullets: [
          "High and low process alarms on PV, with deadband so a signal sitting on the limit does not chatter.",
          "Alarms require operator acknowledgement; an unacknowledged alarm stays visible after the condition clears.",
          "A deviation alarm on |PV − SP| catches a loop that is stable but not controlling, which a PV-only alarm misses entirely.",
        ],
      },
      {
        title: "Evidence it works",
        body: "A tuning report with step-response plots and the method used, plus a recorded disturbance rejection: force a load change and show the loop pull the PV back to setpoint. The disturbance demo matters more than the setpoint step, because rejecting load is what a process controller actually does all day.",
      },
    ],
    nextTime: [
      "Add anti-windup so the integral term stops accumulating while the valve is saturated. Without it, a long saturation produces a large overshoot on recovery.",
      "Add bumpless auto/manual transfer, so switching modes does not step the output.",
      "Add feedforward on the measured load, which should reduce the deviation the feedback loop has to correct at all.",
      "Log to a historian for long-horizon trends rather than a session-length chart.",
    ],
    images: [],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "networked-embedded-motor-controller",
    title: "Networked Embedded Motor Controller",
    category: "electronics",
    status: "planned",
    tagline:
      "An ESP32 running a PID speed loop on a DC motor with encoder feedback, exposed simultaneously as a Modbus TCP device and a micro-ROS node.",
    thumbnail: "",
    thumbnailAlt: "",
    stack: [
      "ESP32",
      "PlatformIO",
      "FreeRTOS",
      "C++",
      "Modbus TCP",
      "micro-ROS",
      "PID",
    ],
    links: [],
    problem:
      "The same motor controller has to be legible to two worlds that do not share vocabulary. A PLC or SCADA system wants a Modbus register map. A ROS 2 graph wants topics with typed messages. Building it twice is waste; building it once with two front-ends raises a real question, which is what happens when both try to command it at the same time. Underneath that sits the control problem itself: hold a speed setpoint under changing load, using an encoder whose velocity estimate gets worse at exactly the speeds you care about.",
    approach:
      "One control core, two network front-ends. PWM drives the motor; a quadrature encoder is read on a hardware timer with interrupt-driven counting. A PID speed loop runs in a FreeRTOS task at a fixed rate, deliberately not in the ISR, so loop jitter stays bounded while the Wi-Fi and protocol stacks get scheduled around it. Modbus TCP exposes setpoint, measured speed and status as registers. micro-ROS publishes speed and subscribes to a command topic. A mode register decides which interface owns the setpoint at any moment.",
    tradeoffs: [
      {
        title: "Encoder velocity: fixed interval or edge period",
        body: "Counting edges in a fixed time window is simple and accurate at speed, but at low RPM you get one or two counts per window and the velocity estimate turns to noise. Measuring the period between edges is precise at low speed and noisy at high speed, where periods get short relative to timer resolution. The plan is fixed-interval counting with a longer averaging window below a threshold RPM. Response at low speed gets slower, which is the price of having a usable signal down there at all.",
      },
      {
        title: "Control loop in a task, not the ISR",
        body: "Running PID inside the encoder ISR gives the tightest timing and starves everything else, including the network stacks this project exists to demonstrate. A fixed-rate FreeRTOS task keeps the loop period deterministic enough for a motor loop while leaving CPU for Wi-Fi. The cost is jitter measured in task-scheduling latency instead of clock cycles. At a few hundred Hz that is fine for a speed loop. A current loop would not survive it.",
      },
      {
        title: "Two interfaces, one authority",
        body: "Letting Modbus and micro-ROS both write the setpoint is a genuine hazard: two masters, no arbitration, and a motor that obeys whichever wrote last. A mode register makes ownership explicit and inspectable from either side. Silent last-write-wins would save maybe thirty lines and produce a device I would not want near a machine.",
      },
    ],
    sections: [
      {
        title: "Architecture",
        body: "Firmware is organised in three layers: a hardware layer (PWM, encoder, driver enable), a control layer (the PID task and the mode arbiter), and a transport layer (Modbus TCP server and micro-ROS node). Only the transport layer knows about networks; only the hardware layer knows about pins. The control core is the same code either way.",
      },
      {
        title: "Modbus register map",
        table: {
          headers: ["Address", "Type", "Access", "Description"],
          rows: [
            ["40001", "uint16", "R/W", "Speed setpoint, RPM"],
            ["40002", "int16", "R", "Measured speed, RPM (signed)"],
            ["40003", "uint16", "R", "Status bits: run, fault, saturated"],
            ["40004", "uint16", "R/W", "Command authority: 0 = Modbus, 1 = ROS"],
            ["40005", "uint16", "R", "Loop period, µs (observed)"],
          ],
        },
      },
      {
        title: "ROS 2 interface",
        bullets: [
          "Publishes /motor/speed as the measured velocity.",
          "Subscribes to /motor/cmd_speed for the setpoint, honoured only when the authority register selects ROS.",
          "Publishes loop health so a supervising node can detect a degraded controller rather than inferring it from behaviour.",
        ],
      },
      {
        title: "Evidence it works",
        body: "A wiring diagram, the tuning data for the speed loop, and a recording of the motor holding speed while load is applied by hand. Both interfaces get exercised independently: polled from a Modbus master, and echoed as topics on a Linux box.",
      },
    ],
    nextTime: [
      "Add a comms watchdog so loss of the command interface ramps the motor to zero instead of holding the last setpoint indefinitely.",
      "Add current sensing for a torque limit, which also makes stall detection possible.",
      "Move off Wi-Fi to CAN for the industrial path. Wi-Fi latency is fine for a demo and wrong for anything that needs determinism.",
    ],
    images: [],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "integrated-robot-work-cell",
    title: "Integrated Robot Work-Cell",
    category: "robotics",
    status: "planned",
    tagline:
      "A PLC-orchestrated cell where a robot arm performs pick-and-place on a conveyor, handshaking over OPC-UA and supervised by SCADA.",
    thumbnail: "",
    thumbnailAlt: "",
    stack: [
      "CODESYS",
      "Factory I/O",
      "URSim",
      "OPC-UA",
      "Ignition",
      "ROS 2 / MoveIt 2 (alternate path)",
    ],
    links: [],
    problem:
      "Two controllers with different cycle times, different programming models and different safety models have to cooperate on one physical sequence, without either one assuming the other's internal state. That is most of what robot integration actually is, and the failures are specific: a dropped signal that leaves both sides waiting, a robot that starts moving before the part is settled, a conveyor that advances into an arm still inside the cell.",
    approach:
      "The PLC owns the cell and the safety; the robot owns the motion. Nothing is shared except an explicit handshake, carried over OPC-UA as named, typed nodes. The handshake is sequenced rather than level-driven, so a missed transition is recoverable instead of deadlocking. SCADA sits above for cell state, cycle count and faults. The same design runs against URSim or against a ROS 2 / MoveIt 2 arm, which keeps the build honest about where the coupling actually is.",
    tradeoffs: [
      {
        title: "Sequence counter over level bits",
        body: "A handshake made of plain level bits ('part ready' high, 'pick done' high) deadlocks the moment a transition is missed. Both sides sit waiting for an edge that already happened. Pairing each signal with a sequence number makes the exchange idempotent: a repeated message is recognised as the same job, and the two sides can resynchronise without power-cycling the cell. One extra register, and a whole class of hang stops existing.",
      },
      {
        title: "OPC-UA over Modbus for the handshake",
        body: "Modbus is lighter and would work, but the register map becomes tribal knowledge held in a spreadsheet. OPC-UA nodes are named and typed, self-describing to anyone who connects, and closer to what integrators and DCS platforms actually expose. It costs a heavier stack and more configuration than a demo cell needs, which is worth paying, because this build exists to practise integration and integrators do not hand you a spreadsheet of register numbers.",
        table: {
          headers: ["Step", "PLC → Robot", "Robot → PLC", "Meaning"],
          rows: [
            [
              "1",
              "PartReady = 1, Seq = n",
              "—",
              "Part in position at the pick station, conveyor stopped",
            ],
            ["2", "—", "PickAck = 1, Seq = n", "Robot has accepted job n"],
            [
              "3",
              "—",
              "PickDone = 1, Seq = n",
              "Place complete, arm clear of the cell envelope",
            ],
            [
              "4",
              "PartReady = 0",
              "—",
              "PLC acknowledges and advances the conveyor",
            ],
          ],
        },
      },
      {
        title: "Standard OPC-UA is not the safety path",
        body: "The handshake coordinates the sequence; it does not make the cell safe. Safety stays in the hardwired e-stop and the robot's own safety controller, because a standard-Ethernet protocol has no integrity guarantee suitable for a safety function. Saying so explicitly is part of the deliverable. Confusing coordination with safety is the most consequential mistake available in this project.",
      },
    ],
    sections: [
      {
        title: "Architecture",
        body: "Factory I/O provides the conveyor, part-present sensor and pick station. The CODESYS PLC runs the cell state machine and the OPC-UA server. The robot (URSim, or a MoveIt 2 arm) runs the pick-and-place motion and acts as an OPC-UA client. Ignition supervises. The boundary is deliberate: one architecture diagram should make it obvious which controller owns which decision.",
      },
      {
        title: "Fault handling",
        bullets: [
          "No part within a timeout: the cell faults rather than waiting forever, so a starved infeed is visible as an alarm.",
          "Robot fault mid-cycle: the PLC holds the conveyor, latches the cell fault, and does not clear the sequence number, so the interrupted job is identifiable.",
          "Comms loss: both sides fail to a stopped state. Neither continues on the last known value.",
          "Any fault requires an explicit reset and a re-home before the cycle resumes.",
        ],
      },
      {
        title: "Evidence it works",
        body: "A system-architecture diagram, the written handshake specification, cycle-count and cycle-time records, and a recording of the full cell cycling plus each fault case being forced.",
      },
    ],
    nextTime: [
      "Put the safety path on a safety-rated protocol rather than leaving it entirely hardwired, and document the safety function properly.",
      "Budget the cycle time per step to find where the cell actually loses throughput. My money is on the robot's approach and retract, not the conveyor.",
      "Add part traceability, so each unit carries an ID through the cell rather than being counted anonymously.",
      "Rebuild the robot side in RAPID on RobotStudio, since that is the dialect that matters for the roles this build targets.",
    ],
    images: [],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "slam-mapping-robot",
    title: "SLAM Mapping Robot",
    category: "robotics",
    status: "planned",
    tagline:
      "A mobile robot that drives an unknown Gazebo world, builds a 2D occupancy grid while estimating its own pose, and saves the map for later navigation.",
    thumbnail: "",
    thumbnailAlt: "",
    stack: ["ROS 2", "Gazebo", "slam_toolbox", "Nav2", "RViz", "Python"],
    links: [],
    problem:
      "Navigating a known map is a solved exercise. Arriving somewhere new is not, because the two questions a robot needs answered are circular: placing sensor readings into a map requires knowing where you are, and knowing where you are requires a map to match against. Neither half breaks the deadlock alone. Wheel odometry, the obvious source of motion, drifts without bound the moment a wheel slips, and it always slips.",
    approach:
      "Estimate both at once and close loops. Each lidar scan is matched against the accumulating map to recover the rigid transform that best overlaps them, which is a far better motion measurement than integrating wheel encoders. Poses become nodes in a pose graph. When the robot recognises somewhere it has been, loop closure adds a constraint that redistributes accumulated drift back through the whole trajectory and the map. That is what makes a long traverse line up when you come back to where you started. Built on slam_toolbox in Gazebo, so ground truth is available to check the result against.",
    tradeoffs: [
      {
        title: "Scan matching and odometry, not scan matching or odometry",
        body: "Scan matching beats odometry almost everywhere, and fails precisely where a building is featureless. A long uniform corridor is geometrically degenerate: the match just slides along it. Odometry is bad but never degenerate in that way. Fusing them means the corridor case falls back on odometry while scan matching carries everything else. Either one alone gives you a map that is wrong in its own particular style.",
      },
      {
        title: "Loop-closure aggressiveness",
        body: "This is the tuning decision the map lives or dies on. A loose match threshold accepts false closures, and a single false closure folds the map onto itself: catastrophic, and obvious the moment you look at it. A tight threshold misses real closures, so drift is never corrected and the map degrades quietly into being subtly wrong, which is much harder to notice. The search radius and minimum match score get tuned against a known Gazebo world where the correct answer is available.",
      },
      {
        title: "Grid resolution against compute",
        body: "A 2 cm occupancy grid resolves door frames and table legs; a 5 cm grid halves the memory and speeds up every scan match. For a robot whose job is navigating rooms and not manipulating objects, 5 cm is probably right. But 'probably' is not good enough for a number that enters every scan match, so this one gets decided against a measured map-quality figure. That is part of why ground truth matters here.",
      },
    ],
    sections: [
      {
        title: "Architecture and TF tree",
        body: "The transform chain is the thing to get right: map → odom → base_link → laser. SLAM owns the map → odom correction; the odometry source owns odom → base_link; the robot description owns the rest. Most confusing SLAM behaviour turns out to be a transform published by the wrong node or at the wrong time, so the TF tree ships as part of the deliverable.",
      },
      {
        title: "Sensor and noise model",
        bullets: [
          "Lidar with realistic range noise and angular resolution. A noiseless scan makes SLAM look far better than it is.",
          "Wheel odometry with slip, so the drift the loop closure has to absorb is real.",
          "Ground truth pose from Gazebo, used only for evaluation, never fed to the estimator.",
        ],
      },
      {
        title: "Evidence it works",
        body: "Absolute trajectory error against Gazebo ground truth, before and after loop closure, plus the saved occupancy grid compared against the world it was built from. Then the map gets handed to Nav2 and used for an actual navigation run. A map you cannot navigate is not a result.",
      },
    ],
    nextTime: [
      "Run it on real hardware with an RPLidar on a differential-drive base, where the noise model stops being a parameter I chose.",
      "Localize against the saved map with AMCL, which is the other half of the job and a different failure surface.",
      "Try multi-session mapping, merging maps from separate runs. That is where pose-graph SLAM starts to get genuinely hard.",
    ],
    images: [],
    videos: [],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "softcore-cpu-fpga",
    title: "Soft-Core CPU in Verilog",
    category: "digital-design",
    status: "planned",
    tagline:
      "A small but real processor in Verilog (fetch, decode, execute, register file and ALU) running a machine-code program in simulation, with a waveform to prove it.",
    thumbnail: "",
    thumbnailAlt: "",
    stack: [
      "Verilog",
      "Icarus Verilog",
      "GTKWave",
      "Yosys / nextpnr (optional)",
      "Tang Nano / iCE40 (optional)",
    ],
    links: [],
    problem:
      "It is possible to use processors for years without being able to say what one is. This build exists to close the gap between 'I can write firmware' and 'I know what the silicon does with it'. A CPU turns out not to be exotic: it is a finite-state machine wrapped around a datapath, assembled from combinational logic, registers and FSMs. The way to be sure of that is to build one and run a program on it.",
    approach:
      "Four parts and a contract. A program counter holding the next address; instruction memory that fetch reads; a register file built from the same flip-flops as any other sequential logic, with read and write ports; and an ALU that is pure combinational logic. The instruction cycle is an FSM sequencing that datapath: fetch, decode, execute, writeback. The other half of the work is defining a tiny instruction set, which is the actual contract between hardware and software, and then running a real program on it: a Fibonacci number, with a waveform as the proof.",
    tradeoffs: [
      {
        title: "Multi-cycle FSM over single-cycle or pipelined",
        body: "Single-cycle is the simplest to reason about, and it sets the clock period by the slowest instruction's whole path, so most of every cycle goes to waste. Pipelining is what real cores do, and it immediately introduces data and control hazards, which makes it a second project instead of a refinement of this one. A multi-cycle FSM reuses the datapath across cycles, keeps the critical path short, and puts the control logic somewhere you can watch it work in a waveform. That last part is what I am here for.",
      },
      {
        title: "Fixed-width instruction encoding",
        body: "A fixed 16-bit encoding keeps instruction decode purely combinational: fields are always in the same bit positions, so decode is wiring and not sequencing. Variable-length encoding packs instruction memory more densely and makes the fetch stage stateful. On a first core I would rather spend the memory and keep decode trivial.",
        table: {
          headers: ["Opcode", "Mnemonic", "Operands", "Operation"],
          rows: [
            ["0000", "ADD", "rd, rs1, rs2", "rd ← rs1 + rs2"],
            ["0001", "SUB", "rd, rs1, rs2", "rd ← rs1 − rs2"],
            ["0010", "LDI", "rd, imm8", "rd ← immediate"],
            ["0011", "MOV", "rd, rs1", "rd ← rs1"],
            ["0100", "BNZ", "rs1, offset", "PC ← PC + offset if rs1 ≠ 0"],
            ["1111", "HALT", "—", "Stop the core"],
          ],
        },
      },
      {
        title: "Eight registers rather than thirty-two",
        body: "Eight registers need three bits of address, which fits three operands plus an opcode inside sixteen bits. Thirty-two registers would need five bits each and force a wider instruction or fewer operands. Eight is enough to write Fibonacci. What took me a moment to see is that the register count and the instruction width are not two decisions, they are one.",
      },
    ],
    sections: [
      {
        title: "Architecture",
        body: "Two clearly separated pieces: a datapath (PC, instruction memory, register file, ALU, and the muxes between them) and a control FSM that drives the datapath's select and enable lines. Every processor from this core upward reads as the same control-plus-datapath pattern, so the diagram is the deliverable as much as the code is.",
      },
      {
        title: "Verification",
        bullets: [
          "Unit testbenches per module: ALU against exhaustive small-operand cases, register file for read-during-write behaviour.",
          "A whole-core test running a Fibonacci program to a HALT, checking the final register contents.",
          "A GTKWave capture of the control FSM stepping through fetch/decode/execute/writeback, which is the artefact that shows it genuinely works.",
        ],
      },
      {
        title: "Optional synthesis",
        body: "The open-source flow (Yosys and nextpnr) targets a sub-$20 Tang Nano or iCE40 board, which turns simulation into a device that runs. Reporting LUT and flip-flop utilisation and the achieved clock is what turns it from a simulation result into a hardware one.",
      },
    ],
    nextTime: [
      "Add a 5-stage pipeline with hazard detection and forwarding. That is the natural next project, and where the actual difficulty lives.",
      "Write an assembler, so programs stop being hand-assembled hex and the ISA gets tested as a contract.",
      "Add a memory interface with load and store, which the current register-only ISA deliberately avoids.",
    ],
    images: [],
    videos: [],
  },
];

const STATUS_RANK: Record<ProjectStatus, number> = {
  complete: 0,
  "in-progress": 1,
  planned: 2,
};

/**
 * Finished work first (newest first), then in progress, then planned.
 * Copies before sorting — sorting in place would mutate module state.
 */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => {
    const byStatus = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (byStatus !== 0) return byStatus;
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Categories that actually have projects, in canonical order. */
export function getUsedCategories(): ProjectCategory[] {
  const used = new Set(projects.map((p) => p.category));
  return CATEGORY_ORDER.filter((c) => used.has(c));
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
