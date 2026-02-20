import React, { useState, useRef, useCallback, useEffect } from 'react';

const EEMindMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDashboard, setShowDashboard] = useState(false);
  const [completedItems, setCompletedItems] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('eeProgress') : null;
    return saved ? JSON.parse(saved) : {};
  });
  const svgRef = useRef(null);
  const prevSelectedNode = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eeProgress', JSON.stringify(completedItems));
    }
  }, [completedItems]);

  const toggleItem = useCallback((domainId, categoryId, itemName) => {
    const key = `${domainId}-${categoryId}-${itemName}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const domains = {
    robotics: {
      id: 'robotics',
      title: 'Robotics Engineering',
      position: { x: 15, y: 15 },
      color: '#4A90E2',
      difficulty: 'intermediate',
      description: 'Design and development of intelligent machines that can sense, think, and act autonomously or semi-autonomously.',
      prerequisites: ['electronics', 'chips'],
      skillsets: [
        { name: 'Control Systems & Theory', description: 'PID control, state-space methods, feedback loops, and system stability analysis' },
        { name: 'Embedded Programming', description: 'C/C++, Python, RTOS for real-time control and sensor integration' },
        { name: 'Sensors & Actuators', description: 'IMU, LIDAR, cameras, encoders, motors, servos, and pneumatic systems' },
        { name: 'Kinematics & Dynamics', description: 'Forward/inverse kinematics, Jacobian matrices, and robot motion equations' },
        { name: 'AI/ML Integration', description: 'Computer vision, path planning, reinforcement learning for autonomous behavior' },
        { name: 'Communication Protocols', description: 'I2C, SPI, UART, CAN bus for inter-component communication' },
        { name: 'Power Electronics', description: 'Motor drivers, H-bridges, and power management for robotic systems' },
        { name: 'Signal Processing', description: 'Filtering, noise reduction, and sensor fusion techniques' }
      ],
      applications: [
        { name: 'Industrial Automation', description: 'Manufacturing robots, assembly lines, and quality control systems' },
        { name: 'Autonomous Vehicles', description: 'Self-driving cars, delivery robots, and autonomous drones' },
        { name: 'Medical Robotics', description: 'Surgical robots, rehabilitation devices, and assistive technologies' },
        { name: 'Agricultural Robotics', description: 'Harvesting robots, precision farming, and crop monitoring systems' },
        { name: 'Service Robots', description: 'Cleaning robots, hospitality bots, and delivery systems' },
        { name: 'Space Exploration', description: 'Mars rovers, satellite servicing robots, and space station automation' },
        { name: 'Search & Rescue', description: 'Disaster response robots and hazardous environment exploration' },
        { name: 'Warehouse Automation', description: 'Inventory management robots and automated fulfillment systems' }
      ],
      theory: [
        { name: 'Forward/Inverse Kinematics', description: 'Mathematical models for robot arm positioning and trajectory planning' },
        { name: 'Control Theory', description: 'Classical and modern control methods for system stability and performance' },
        { name: 'State Estimation', description: 'Kalman filtering and particle filters for sensor data fusion' },
        { name: 'Motion Planning', description: 'Path planning algorithms like A*, RRT, and potential fields' },
        { name: 'Sensor Fusion', description: 'Combining multiple sensor inputs for robust perception' },
        { name: 'System Modeling', description: 'Mathematical representation of robot dynamics and behavior' }
      ]
    },
    chips: {
      id: 'chips',
      title: 'Chip Design & Semiconductors',
      position: { x: 50, y: 10 },
      color: '#9F7AEA',
      difficulty: 'advanced',
      description: 'Design and fabrication of integrated circuits from transistor-level to complete system-on-chip implementations.',
      prerequisites: ['electronics'],
      skillsets: [
        { name: 'HDL Programming', description: 'Verilog, VHDL, SystemVerilog for hardware description and verification' },
        { name: 'Digital Logic Design', description: 'Boolean algebra, state machines, combinational and sequential circuits' },
        { name: 'Analog Circuit Design', description: 'Op-amps, transistor circuits, biasing, and frequency response' },
        { name: 'EDA Tools', description: 'Cadence, Synopsys, Mentor Graphics for design and simulation' },
        { name: 'Physical Design & P&R', description: 'Floorplanning, placement, routing, and timing closure' },
        { name: 'ASIC/FPGA Development', description: 'Custom chip design and field-programmable gate array implementation' },
        { name: 'Timing Analysis', description: 'Static timing analysis, clock domain crossing, and timing closure' },
        { name: 'Power Optimization', description: 'Low-power design techniques, power gating, and voltage scaling' },
        { name: 'Verification', description: 'Functional verification, formal verification, and testbench development' },
        { name: 'AI-Assisted Design', description: 'Machine learning for design optimization and automation' }
      ],
      applications: [
        { name: 'Microprocessors & CPUs', description: 'Desktop, server, and embedded processors for computing' },
        { name: 'GPUs', description: 'Graphics processing units for rendering and parallel computation' },
        { name: 'AI Accelerators', description: 'Neural network processors and tensor processing units' },
        { name: 'Mobile Chipsets', description: 'Smartphone and tablet system-on-chip designs' },
        { name: 'Memory Chips', description: 'DRAM, SRAM, Flash memory for data storage' },
        { name: 'IoT Chips', description: 'Low-power edge computing and sensor interface chips' },
        { name: 'Automotive Chips', description: 'ADAS processors, infotainment systems, and vehicle control units' },
        { name: 'Cryptocurrency ASICs', description: 'Specialized mining chips for blockchain applications' }
      ],
      theory: [
        { name: 'Semiconductor Physics', description: 'Band theory, carrier transport, and p-n junction behavior' },
        { name: 'MOSFET Operation', description: 'Transistor characteristics, threshold voltage, and scaling effects' },
        { name: 'Advanced Process Nodes', description: 'FinFET, GAAFET, and sub-3nm fabrication technologies' },
        { name: 'Signal Integrity', description: 'Crosstalk, reflection, and transmission line effects' },
        { name: 'Power Dissipation', description: 'Dynamic and static power models, leakage currents' },
        { name: 'Clock Distribution', description: 'Clock tree synthesis, skew, and jitter management' },
        { name: 'Quantum Effects', description: 'Tunneling and quantum mechanical phenomena in nanoscale devices' },
        { name: 'Interconnect Modeling', description: 'RC delay, inductance effects, and parasitic extraction' }
      ]
    },
    videogames: {
      id: 'videogames',
      title: 'Video Game Console Hardware',
      position: { x: 85, y: 15 },
      color: '#F56565',
      difficulty: 'advanced',
      description: 'Specialized computing systems optimized for real-time graphics rendering and interactive gaming experiences.',
      prerequisites: ['electronics', 'chips'],
      skillsets: [
        { name: 'High-Speed Digital Design', description: 'Multi-GHz signal routing and high-speed PCB layout' },
        { name: 'GPU Architecture', description: 'Graphics pipeline design, shader units, and rendering engines' },
        { name: 'CPU Architecture', description: 'Multi-core processor design, cache hierarchies, and instruction sets' },
        { name: 'Memory Subsystems', description: 'DDR, GDDR memory controllers and bandwidth optimization' },
        { name: 'SoC Integration', description: 'System-on-chip design combining CPU, GPU, and I/O controllers' },
        { name: 'Thermal Management', description: 'Heat sink design, cooling solutions, and thermal modeling' },
        { name: 'Power Delivery', description: 'Voltage regulators, power distribution networks, and efficiency optimization' },
        { name: 'Signal Integrity', description: 'High-speed signal analysis, impedance matching, and EMI mitigation' },
        { name: 'Hardware Security', description: 'DRM implementation, secure boot, and anti-tampering measures' },
        { name: 'Graphics Pipeline', description: 'Vertex processing, rasterization, and pixel shading architecture' }
      ],
      applications: [
        { name: 'Home Gaming Consoles', description: 'PlayStation, Xbox, Nintendo Switch hardware platforms' },
        { name: 'Handheld Gaming', description: 'Portable gaming devices like Steam Deck and Nintendo Switch Lite' },
        { name: 'VR/AR Headsets', description: 'Virtual and augmented reality gaming hardware' },
        { name: 'Cloud Gaming', description: 'Server-side rendering infrastructure for game streaming' },
        { name: 'Gaming SoCs', description: 'Custom chips for gaming laptops and handheld devices' },
        { name: 'Arcade Systems', description: 'Commercial arcade machine hardware and controllers' },
        { name: 'Retro Gaming', description: 'FPGA-based console emulation and reproduction hardware' }
      ],
      theory: [
        { name: 'Computer Architecture', description: 'Von Neumann vs Harvard architecture, pipelining, and parallelism' },
        { name: 'Parallel Processing', description: 'Multi-core coordination, thread scheduling, and load balancing' },
        { name: 'Graphics Pipeline', description: 'Vertex transformation, rasterization, and fragment processing stages' },
        { name: 'Memory Hierarchy', description: 'Cache levels, memory bandwidth, and latency optimization' },
        { name: 'Bus Protocols', description: 'PCIe, memory buses, and high-speed interconnects' },
        { name: 'Real-Time Rendering', description: 'Frame timing, V-sync, and rendering optimization techniques' },
        { name: 'Hardware Acceleration', description: 'Fixed-function units vs programmable shaders' },
        { name: 'Unified Shader Architecture', description: 'Flexible compute units for vertex and pixel processing' },
        { name: 'Thermal Modeling', description: 'Heat dissipation calculations and cooling system design' }
      ]
    },
    electronics: {
      id: 'electronics',
      title: 'Electronics & Hardware Design',
      position: { x: 50, y: 40 },
      color: '#38B2AC',
      difficulty: 'beginner',
      description: 'Fundamental electronics including circuit design, PCB layout, and component selection.',
      prerequisites: [],
      skillsets: [
        { name: 'Circuit Analysis', description: "Ohm's law, Kirchhoff's laws, nodal analysis, and mesh analysis" },
        { name: 'Analog Circuits', description: 'Op-amps, amplifiers, filters, and analog signal processing' },
        { name: 'Digital Circuits', description: 'Logic gates, combinational circuits, and sequential logic' },
        { name: 'PCB Design', description: 'Schematic capture, layout, routing, and design rules' },
        { name: 'Component Selection', description: 'Datasheets, specifications, and part selection criteria' },
        { name: 'Soldering & Assembly', description: 'Hand soldering, reflow, and component placement techniques' },
        { name: 'Testing & Debugging', description: 'Multimeters, oscilloscopes, and logic analyzers' },
        { name: 'Prototyping', description: 'Breadboarding, Arduino, and rapid prototyping platforms' }
      ],
      applications: [
        { name: 'Consumer Electronics', description: 'Smartphones, laptops, and home appliances' },
        { name: 'IoT Devices', description: 'Smart sensors and connected devices' },
        { name: 'Medical Devices', description: 'Diagnostic and therapeutic electronic equipment' },
        { name: 'Industrial Control', description: 'PLCs, motor controllers, and automation systems' },
        { name: 'Audio Equipment', description: 'Amplifiers, speakers, and audio processing' },
        { name: 'Lighting Systems', description: 'LED drivers and lighting control' },
        { name: 'Power Distribution', description: 'Circuit breakers and power management' },
        { name: 'Telecommunications', description: 'Network equipment and communication systems' }
      ],
      theory: [
        { name: 'Circuit Theory', description: 'Voltage, current, resistance, and power relationships' },
        { name: 'AC Analysis', description: 'Impedance, phasors, and frequency response' },
        { name: 'Semiconductor Physics', description: 'Diodes, transistors, and semiconductor behavior' },
        { name: 'Signal Processing', description: 'Fourier analysis, filtering, and signal conditioning' },
        { name: 'Electromagnetic Theory', description: 'Fields, waves, and transmission lines' },
        { name: 'Noise & Interference', description: 'Noise sources, shielding, and grounding techniques' }
      ]
    },
    power: {
      id: 'power',
      title: 'Power Systems Engineering',
      position: { x: 20, y: 45 },
      color: '#ECC94B',
      difficulty: 'intermediate',
      description: 'Design and management of electrical power generation, distribution, and conversion systems.',
      prerequisites: ['electronics'],
      skillsets: [
        { name: 'Power Conversion', description: 'AC-DC, DC-DC, DC-AC converters and inverter design' },
        { name: 'Circuit Design', description: 'Transformer design, filter circuits, and EMI mitigation' },
        { name: 'Thermal Management', description: 'Heat dissipation, thermal modeling, and cooling solutions' },
        { name: 'Energy Management', description: 'Battery management systems, charge controllers, and load balancing' },
        { name: 'High-Voltage Design', description: 'Isolation, insulation, and safety in high-voltage systems' },
        { name: 'Renewable Integration', description: 'Solar inverters, wind turbine controllers, and grid integration' },
        { name: 'Power Quality', description: 'Harmonic analysis, power factor correction, and voltage regulation' },
        { name: 'Efficiency Optimization', description: 'Loss minimization, soft switching, and resonant techniques' }
      ],
      applications: [
        { name: 'Power Supplies', description: 'AC-DC power supplies for consumer and industrial equipment' },
        { name: 'Battery Chargers', description: 'Fast charging systems for EVs and portable devices' },
        { name: 'Solar Inverters', description: 'Grid-tied and off-grid solar power conversion' },
        { name: 'Wind Turbines', description: 'Generator control and power conversion for wind energy' },
        { name: 'UPS Systems', description: 'Uninterruptible power supplies for critical applications' },
        { name: 'Motor Drives', description: 'AC and DC motor control systems for industrial automation' },
        { name: 'LED Drivers', description: 'Efficient lighting control and dimming systems' },
        { name: 'Wireless Charging', description: 'Inductive and resonant power transfer systems' }
      ],
      theory: [
        { name: 'Power Electronics', description: 'Semiconductor switches, PWM, and switching topologies' },
        { name: 'Magnetic Design', description: 'Inductor and transformer design, core materials' },
        { name: 'Control Theory', description: 'Feedback control, stability analysis, and compensation' },
        { name: 'Thermal Analysis', description: 'Heat transfer, thermal resistance, and junction temperature' },
        { name: 'EMC/EMI', description: 'Electromagnetic compatibility and interference mitigation' },
        { name: 'Efficiency Metrics', description: 'COP, efficiency curves, and energy loss analysis' }
      ]
    },
    hardware: {
      id: 'hardware',
      title: 'Computer Engineering',
      position: { x: 80, y: 45 },
      color: '#ED8936',
      difficulty: 'intermediate',
      description: 'Hardware-software integration including embedded systems, microcontrollers, and computing architectures.',
      prerequisites: ['electronics', 'chips'],
      skillsets: [
        { name: 'Microcontroller Programming', description: 'ARM, AVR, RISC-V assembly and C/C++ programming' },
        { name: 'Embedded Linux', description: 'Kernel configuration, device drivers, and system programming' },
        { name: 'Real-Time OS', description: 'FreeRTOS, Zephyr, and real-time scheduling' },
        { name: 'Hardware Abstraction', description: 'HAL design, peripheral drivers, and hardware interfaces' },
        { name: 'Bootloader Development', description: 'Firmware loading, secure boot, and OTA updates' },
        { name: 'Memory Management', description: 'RAM optimization, flash storage, and caching strategies' },
        { name: 'Communication Interfaces', description: 'UART, SPI, I2C, USB, Ethernet, and wireless protocols' },
        { name: 'Debugging Techniques', description: 'JTAG, SWD, and in-circuit debugging' }
      ],
      applications: [
        { name: 'IoT Devices', description: 'Smart home devices, wearables, and sensor nodes' },
        { name: 'Embedded Controllers', description: 'Industrial control systems and automation' },
        { name: 'Microcontroller Boards', description: 'Arduino, Raspberry Pi, and STM32 platforms' },
        { name: 'Firmware Development', description: 'Device firmware and system software' },
        { name: 'Edge Computing', description: 'Local AI inference and data processing' },
        { name: 'Wireless Devices', description: 'Bluetooth, WiFi, and cellular IoT devices' },
        { name: 'Medical Devices', description: 'Wearable health monitors and diagnostic devices' },
        { name: 'Aerospace Systems', description: 'Flight computers and avionics' }
      ],
      theory: [
        { name: 'Computer Architecture', description: 'CPU design, instruction sets, and memory hierarchies' },
        { name: 'Operating Systems', description: 'Process scheduling, memory management, and I/O' },
        { name: 'Firmware Design', description: 'Bootloaders, firmware updates, and system initialization' },
        { name: 'Interrupt Handling', description: 'Exception handling, interrupt priorities, and ISRs' },
        { name: 'Power Management', description: 'Sleep modes, dynamic voltage scaling, and energy efficiency' },
        { name: 'Security', description: 'Secure coding, cryptography, and secure boot' }
      ]
    },
    transportation: {
      id: 'transportation',
      title: 'Transportation Systems',
      position: { x: 50, y: 65 },
      color: '#48BB78',
      difficulty: 'intermediate',
      description: 'Electronic systems for vehicles including automotive, aerospace, and autonomous transportation.',
      prerequisites: ['electronics', 'power'],
      skillsets: [
        { name: 'Vehicle Networks', description: 'CAN bus, LIN, FlexRay protocols for inter-ECU communication' },
        { name: 'Control Systems', description: 'Stability control, traction control, and autonomous driving algorithms' },
        { name: 'Power Conversion', description: 'DC-DC converters, inverters for electric vehicle powertrains' },
        { name: 'Sensor Integration', description: 'Radar, LIDAR, camera fusion for autonomous perception' },
        { name: 'Real-Time OS', description: 'AUTOSAR, QNX for automotive embedded systems' },
        { name: 'Safety-Critical Systems', description: 'ISO 26262 functional safety and SOTIF compliance' },
        { name: 'Battery Management', description: 'BMS design, cell balancing, and thermal management' },
        { name: 'High-Voltage Systems', description: '400V+ power distribution and isolation techniques' }
      ],
      applications: [
        { name: 'Electric Vehicles', description: 'EV powertrains, battery systems, and charging infrastructure' },
        { name: 'Autonomous Vehicles', description: 'Self-driving cars with perception and decision-making systems' },
        { name: 'ADAS Systems', description: 'Advanced driver assistance like lane keeping and collision avoidance' },
        { name: 'Infotainment', description: 'In-vehicle entertainment and navigation systems' },
        { name: 'Aerospace Electronics', description: 'Aircraft avionics and flight control systems' },
        { name: 'Railway Systems', description: 'Train control and signaling systems' },
        { name: 'Marine Electronics', description: 'Ship navigation and propulsion control systems' }
      ],
      theory: [
        { name: 'Vehicle Dynamics', description: 'Longitudinal and lateral control, stability analysis' },
        { name: 'Motor Control', description: 'Three-phase motor drive, FOC, and sensorless techniques' },
        { name: 'Battery Chemistry', description: 'Lithium-ion, solid-state, and alternative battery technologies' },
        { name: 'Thermal Management', description: 'Cooling systems for batteries, motors, and power electronics' },
        { name: 'Functional Safety', description: 'FMEA, fault tolerance, and redundancy design' },
        { name: 'Cybersecurity', description: 'Vehicle security, secure communication, and intrusion detection' }
      ]
    }
  };

  const connections = [
    { from: 'robotics', to: 'chips', labels: ['Microcontrollers', 'Embedded Systems'] },
    { from: 'robotics', to: 'electronics', labels: ['PCB Design', 'Signal Processing'] },
    { from: 'robotics', to: 'power', labels: ['Motor Drives'] },
    { from: 'chips', to: 'videogames', labels: ['GPU Architecture', 'High-Speed Design'] },
    { from: 'chips', to: 'hardware', labels: ['CPU Architecture', 'Memory Systems'] },
    { from: 'chips', to: 'electronics', labels: ['Circuit Design', 'Fabrication'] },
    { from: 'videogames', to: 'hardware', labels: ['Graphics Pipeline', 'Architecture'] },
    { from: 'videogames', to: 'electronics', labels: ['High-Speed Signals', 'Power Distribution'] },
    { from: 'transportation', to: 'power', labels: ['Power Electronics', 'Energy Management'] },
    { from: 'transportation', to: 'electronics', labels: ['Vehicle Networks', 'Control Systems'] },
    { from: 'transportation', to: 'robotics', labels: ['Autonomous Systems', 'Sensors & Control'] },
    { from: 'power', to: 'electronics', labels: ['Power Conversion', 'Circuit Design'] },
    { from: 'hardware', to: 'electronics', labels: ['Real-time OS', 'Computer Vision'] }
  ];

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.3, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.3, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.node-group') || e.target.closest('.info-panel')) return;
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isPanning, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e) => {
    // Only prevent zoom when scrolling inside info panel - dashboard scrolls naturally
    if (e.target.closest('.info-panel')) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return '#48BB78';
      case 'intermediate': return '#F6AD55';
      case 'advanced': return '#F56565';
      default: return '#999';
    }
  };

  const getProgressForDomain = (domainId) => {
    const domain = domains[domainId];
    const totalItems = domain.skillsets.length + domain.applications.length + domain.theory.length;
    let completed = 0;
    
    ['skillsets', 'applications', 'theory'].forEach(category => {
      domain[category].forEach(item => {
        const key = `${domainId}-${category}-${item.name}`;
        if (completedItems[key]) completed++;
      });
    });
    
    return Math.round((completed / totalItems) * 100);
  };

  const InfoPanel = ({ domain }) => {
    const shouldAnimate = prevSelectedNode.current === null;
    useEffect(() => {
      prevSelectedNode.current = domain.id;
    }, [domain.id]);
    
    return (
      <div className={`info-panel ${shouldAnimate ? 'animate-slide' : ''}`}>
      <div className="info-header">
        <div>
          <h2>{domain.title}</h2>
          <div className="info-meta">
            <span className="difficulty-badge" style={{ background: getDifficultyColor(domain.difficulty) }}>
              {domain.difficulty}
            </span>
            <span className="progress-badge">
              {getProgressForDomain(domain.id)}% Complete
            </span>
          </div>
        </div>
        <button onClick={() => { setSelectedNode(null); prevSelectedNode.current = null; }} className="close-btn">×</button>
      </div>

      <p className="info-description">{domain.description}</p>

      {domain.prerequisites && domain.prerequisites.length > 0 && (
        <div className="prerequisites">
          <h4>Prerequisites</h4>
          <div className="prereq-chips">
            {domain.prerequisites.map(prereqId => (
              <span key={prereqId} className="prereq-chip">
                {domains[prereqId].title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>Skillsets</h3>
        <div className="items-list">
          {domain.skillsets.map((item, i) => {
            const key = `${domain.id}-skillsets-${item.name}`;
            return (
              <div key={i} className="item-card">
                <label className="item-header">
                  <input
                    type="checkbox"
                    checked={completedItems[key] || false}
                    onChange={() => toggleItem(domain.id, 'skillsets', item.name)}
                  />
                  <span className="item-name">{item.name}</span>
                </label>
                <p className="item-description">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="info-section">
        <h3>Applications</h3>
        <div className="items-list">
          {domain.applications.map((item, i) => {
            const key = `${domain.id}-applications-${item.name}`;
            return (
              <div key={i} className="item-card">
                <label className="item-header">
                  <input
                    type="checkbox"
                    checked={completedItems[key] || false}
                    onChange={() => toggleItem(domain.id, 'applications', item.name)}
                  />
                  <span className="item-name">{item.name}</span>
                </label>
                <p className="item-description">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="info-section">
        <h3>Theory</h3>
        <div className="items-list">
          {domain.theory.map((item, i) => {
            const key = `${domain.id}-theory-${item.name}`;
            return (
              <div key={i} className="item-card">
                <label className="item-header">
                  <input
                    type="checkbox"
                    checked={completedItems[key] || false}
                    onChange={() => toggleItem(domain.id, 'theory', item.name)}
                  />
                  <span className="item-name">{item.name}</span>
                </label>
                <p className="item-description">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    );
  };

  const Dashboard = () => {
    return (
      <>
        <style>{`
          .dashboard-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: white !important;
            overflow-y: auto;
            overflow-x: hidden;
            z-index: 1000;
          }
          
          .dashboard-wrapper * {
            color: white;
          }
          
          .dash-grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
            z-index: 0;
          }
          
          .dash-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 48px;
            border-bottom: 1px solid #333;
            position: sticky;
            top: 0;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
            z-index: 40;
          }
          
          .dash-title {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 36px;
            font-weight: 600;
            color: white !important;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          
          .dash-subtitle {
            font-size: 14px;
            color: #666 !important;
            font-family: 'IBM Plex Sans', sans-serif;
          }
          
          .dash-close {
            background: none;
            border: 1px solid #333;
            color: #888 !important;
            font-size: 32px;
            width: 48px;
            height: 48px;
            cursor: pointer;
            font-family: 'IBM Plex Mono', monospace;
            flex-shrink: 0;
          }
          
          .dash-close:hover {
            background: #222;
            color: white !important;
            border-color: #555;
          }
          
          .dash-content {
            padding: 48px;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 10;
          }
          
          .dash-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 32px;
          }
          
          .dash-card {
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 28px;
            transition: all 0.3s;
          }
          
          .dash-card:hover {
            transform: translateY(-4px);
            background: rgba(26, 26, 26, 0.8);
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          }
          
          .dash-card-header {
            display: flex;
            gap: 20px;
            margin-bottom: 24px;
            align-items: center;
          }
          
          .dash-card-title {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 12px;
            line-height: 1.2;
          }
          
          .dash-badges {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          
          .dash-diff-badge {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 10px;
            padding: 6px 10px;
            border-radius: 3px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: white !important;
          }
          
          .dash-complete-badge {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 10px;
            padding: 4px 8px;
            border-radius: 3px;
            font-weight: 600;
            background: #2a2a2a;
            color: #D4AF37 !important;
          }
          
          .dash-stats {
            background: #1a1a1a;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 20px;
          }
          
          .dash-stat-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
            border-bottom: 1px solid #2a2a2a;
          }
          
          .dash-stat-row:last-child {
            border-bottom: none;
          }
          
          .dash-stat-label {
            color: #888 !important;
            text-transform: capitalize;
          }
          
          .dash-stat-value {
            font-weight: 600;
          }
          
          .dash-explore-btn {
            width: 100%;
            background: none;
            padding: 12px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s;
          }
          
          .dash-explore-btn:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-1px);
          }
        `}</style>
        
        <div className="dashboard-wrapper">
          <div className="dash-grid-bg"></div>
          
          <div className="dash-header">
            <div>
              <h1 className="dash-title">⚙ Learning Dashboard</h1>
              <p className="dash-subtitle">Track your progress across all EE domains</p>
            </div>
            <button onClick={() => setShowDashboard(false)} className="dash-close">×</button>
          </div>

          <div className="dash-content">
            <div className="dash-grid">
              {Object.values(domains).map((domain) => {
                const progress = getProgressForDomain(domain.id);
                const totalItems = domain.skillsets.length + domain.applications.length + domain.theory.length;
                const completedCount = Math.round((progress / 100) * totalItems);
                
                return (
                  <div key={domain.id} className="dash-card" style={{ border: `2px solid ${domain.color}` }}>
                    <div className="dash-card-header">
                      <div style={{ flexShrink: 0 }}>
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a2a" strokeWidth="6" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={domain.color}
                            strokeWidth="6"
                            strokeDasharray={`${(progress / 100) * 282.743} 282.743`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <text x="50" y="48" textAnchor="middle" fill="white" fontSize="20" fontWeight="600" fontFamily="IBM Plex Mono, monospace">
                            {progress}%
                          </text>
                          <text x="50" y="62" textAnchor="middle" fill="#666" fontSize="10" fontFamily="IBM Plex Mono, monospace">
                            {completedCount}/{totalItems}
                          </text>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 className="dash-card-title" style={{ color: domain.color }}>{domain.title}</h3>
                        <div className="dash-badges">
                          <span className="dash-diff-badge" style={{ backgroundColor: getDifficultyColor(domain.difficulty) }}>
                            {domain.difficulty.toUpperCase()}
                          </span>
                          <span className="dash-complete-badge">
                            {progress}% Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="dash-stats">
                      {['skillsets', 'applications', 'theory'].map((category) => {
                        const items = domain[category];
                        const completed = items.filter(item => 
                          completedItems[`${domain.id}-${category}-${item.name}`]
                        ).length;
                        return (
                          <div key={category} className="dash-stat-row">
                            <span className="dash-stat-label">{category}</span>
                            <span className="dash-stat-value" style={{ color: domain.color }}>{completed}/{items.length}</span>
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => {
                        setShowDashboard(false);
                        setSelectedNode(domain.id);
                      }}
                      className="dash-explore-btn"
                      style={{ border: `1px solid ${domain.color}`, color: domain.color }}
                    >
                      Explore Details →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div 
      className="mindmap-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mindmap-container {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          font-family: 'IBM Plex Sans', -apple-system, system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          cursor: grab;
        }

        .mindmap-container:active {
          cursor: grabbing;
        }

        .mindmap-svg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .connection-line {
          stroke-width: 0.15;
          stroke-opacity: 0.4;
          fill: none;
          transition: stroke-width 0.2s ease, stroke-opacity 0.2s ease;
        }

        .connection-line.highlighted {
          stroke-width: 0.25;
          stroke-opacity: 0.7;
        }

        .connection-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8px;
          fill: #D4AF37;
          text-anchor: middle;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          font-weight: 600;
        }

        .connection-label.visible {
          opacity: 1;
        }

        .node-group {
          cursor: pointer;
          transform-origin: center;
        }

        .node-circle {
          transition: filter 0.2s ease;
          filter: drop-shadow(0 0 0.5px rgba(0,0,0,0.5));
        }

        .node-group:hover .node-circle {
          filter: drop-shadow(0 0 1.5px currentColor);
        }

        .node-group.selected .node-circle {
          stroke-width: 0.25;
          filter: drop-shadow(0 0 2px currentColor);
        }

        .node-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.2px;
          fill: white;
          text-anchor: middle;
          pointer-events: none;
          font-weight: 500;
          letter-spacing: 0.03px;
        }

        .difficulty-indicator {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.5px;
          fill: white;
          text-anchor: middle;
          font-weight: 700;
          pointer-events: none;
        }

        .info-panel {
          position: fixed;
          right: 0;
          top: 0;
          width: 450px;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          border-left: 1px solid #333;
          padding: 32px;
          overflow-y: auto;
          box-shadow: -10px 0 40px rgba(0,0,0,0.5);
          z-index: 100;
        }
        
        .info-panel.animate-slide {
          animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #333;
        }

        .info-header h2 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 22px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .info-meta {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .difficulty-badge, .progress-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 3px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-badge {
          color: white;
        }

        .progress-badge {
          background: #2a2a2a;
          color: #D4AF37;
        }

        .info-description {
          font-size: 13px;
          color: #aaa;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .prerequisites {
          background: #1a1a1a;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .prerequisites h4 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .prereq-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .prereq-chip {
          background: #0a0a0a;
          border: 1px solid #444;
          padding: 4px 10px;
          border-radius: 3px;
          font-size: 11px;
          color: #888;
          font-family: 'IBM Plex Mono', monospace;
        }

        .close-btn {
          background: none;
          border: 1px solid #333;
          color: #888;
          font-size: 24px;
          width: 36px;
          height: 36px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'IBM Plex Mono', monospace;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: #222;
          color: white;
          border-color: #555;
        }

        .info-section {
          margin-bottom: 32px;
        }

        .info-section h3 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          padding: 12px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .item-card:hover {
          border-color: #444;
          background: #1f1f1f;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 6px;
        }

        .item-header input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #D4AF37;
        }

        .item-name {
          font-weight: 600;
          color: white;
          font-size: 13px;
        }

        .item-description {
          font-size: 12px;
          color: #999;
          line-height: 1.5;
          margin-left: 26px;
        }

        .header {
          position: absolute;
          top: 32px;
          left: 32px;
          z-index: 10;
          pointer-events: none;
        }

        .header h1 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 28px;
          color: white;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .header p {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 13px;
          color: #666;
          font-weight: 300;
        }

        .controls {
          position: absolute;
          top: 32px;
          right: 32px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .control-btn {
          background: rgba(26, 26, 26, 0.9);
          border: 1px solid #333;
          color: white;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .control-btn:hover {
          background: rgba(40, 40, 40, 0.9);
          border-color: #555;
          transform: translateY(-2px);
        }

        .control-btn:active {
          transform: translateY(0);
        }

        .zoom-indicator {
          position: absolute;
          top: 88px;
          right: 32px;
          background: rgba(26, 26, 26, 0.9);
          border: 1px solid #333;
          padding: 8px 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #888;
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .dashboard-btn {
          position: absolute;
          bottom: 32px;
          right: 32px;
          background: #D4AF37;
          color: #000;
          border: none;
          padding: 12px 20px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .dashboard-btn:hover {
          background: #E5BF47;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .legend {
          position: absolute;
          bottom: 32px;
          left: 32px;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid #333;
          padding: 16px;
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .legend h4 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
          margin-bottom: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 11px;
          color: #999;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .dashboard {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          overflow-y: auto;
          padding: 40px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 32px;
          color: white;
          font-weight: 600;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1400px;
        }

        .dashboard-card {
          background: #1a1a1a;
          border: 2px solid;
          border-radius: 8px;
          padding: 24px;
          transition: all 0.3s;
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .dashboard-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .dashboard-card h3 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 18px;
          color: white;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #0a0a0a;
          border-radius: 4px;
          overflow: hidden;
          margin: 16px 0 8px;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #888;
          margin-bottom: 20px;
        }

        .dashboard-sections {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .section-stat {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #aaa;
          font-family: 'IBM Plex Mono', monospace;
        }

        .section-name {
          text-transform: capitalize;
        }

        .section-count {
          color: #D4AF37;
          font-weight: 600;
        }

        .explore-btn {
          width: 100%;
          background: none;
          border: 1px solid #333;
          color: white;
          padding: 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .explore-btn:hover {
          background: #222;
          border-color: #555;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>

      <div className="grid-overlay"></div>

      <div className="header">
        <h1>⚙ Electronic Engineering</h1>
        <p>Click nodes to explore · Hover for connections · Track your progress</p>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={handleZoomIn} title="Zoom In">+</button>
        <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">−</button>
        <button className="control-btn" onClick={handleReset} title="Reset View">⟲</button>
      </div>

      <div className="zoom-indicator">
        {Math.round(zoom * 100)}%
      </div>

      <button className="dashboard-btn" onClick={() => setShowDashboard(true)}>
        View Dashboard →
      </button>

      <svg 
        ref={svgRef}
        className="mindmap-svg" 
        viewBox="0 0 100 75" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {Object.values(domains).map(domain => (
            <linearGradient key={domain.id} id={`grad-${domain.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: domain.color, stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: domain.color, stopOpacity: 0.4 }} />
            </linearGradient>
          ))}
        </defs>

        <g transform={`translate(${pan.x / 10}, ${pan.y / 10}) scale(${zoom})`}>
          {/* Draw connections */}
          {connections.map((conn, i) => {
            const from = domains[conn.from];
            const to = domains[conn.to];
            const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
            
            const fromX = from.position.x + 1;
            const fromY = from.position.y + 1;
            const toX = to.position.x + 1;
            const toY = to.position.y + 1;
            
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;

            return (
              <g key={i}>
                <path
                  d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
                  className={`connection-line ${isHighlighted ? 'highlighted' : ''}`}
                  stroke={from.color}
                />
                {conn.labels.map((label, j) => (
                  <text
                    key={j}
                    x={midX}
                    y={midY + (j - (conn.labels.length - 1) / 2) * 0.9}
                    className={`connection-label ${isHighlighted ? 'visible' : ''}`}
                  >
                    {label}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Draw nodes */}
          {Object.values(domains).map(domain => {
            const isSelected = selectedNode === domain.id;
            
            return (
              <g
                key={domain.id}
                className={`node-group ${isSelected ? 'selected' : ''}`}
                transform={`translate(${domain.position.x}, ${domain.position.y})`}
                onMouseEnter={() => setHoveredNode(domain.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(selectedNode === domain.id ? null : domain.id);
                }}
              >
                <circle
                  className="node-circle"
                  r="1"
                  cx="1"
                  cy="1"
                  fill={`url(#grad-${domain.id})`}
                  stroke={domain.color}
                  strokeWidth="0.15"
                />
                
                <circle
                  r="0.4"
                  cx="1"
                  cy="1"
                  fill={domain.color}
                  opacity="0.6"
                />
                
                {/* Difficulty indicator */}
                <circle
                  cx="1.6"
                  cy="0.4"
                  r="0.25"
                  fill={getDifficultyColor(domain.difficulty)}
                  stroke="#000"
                  strokeWidth="0.05"
                />
                
                <text
                  className="difficulty-indicator"
                  x="1.6"
                  y="0.5"
                >
                  {domain.difficulty.charAt(0).toUpperCase()}
                </text>
                
                <text
                  className="node-text"
                  x="1"
                  y="2.5"
                >
                  {domain.title.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="legend">
        <h4>Difficulty Levels</h4>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#48BB78' }}></div>
          <span>Beginner</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#F6AD55' }}></div>
          <span>Intermediate</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#F56565' }}></div>
          <span>Advanced</span>
        </div>
      </div>

      {selectedNode && <InfoPanel domain={domains[selectedNode]} />}
    </div>
  );
};

export default EEMindMap;
