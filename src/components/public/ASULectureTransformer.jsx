import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    RotateCcw,
    ChevronRight,
    Zap,
    Target,
    BookOpen,
    AlertTriangle,
    Award,
    Brain,
    Shield,
    ArrowLeft,
    CheckCircle2,
    Wind,
    Gauge,
    Sparkles,
    Compass,
    Sliders,
    MessageSquare,
    HeartPulse,
    Briefcase,
    Scale,
    Settings,
    Activity,
    RefreshCw,
    Users,
    Cpu,
    Layers,
    Lock,
    Unlock,
    Flame,
} from 'lucide-react';
import { ConfusionDetectionService } from '../../services/ConfusionDetectionService';

const SQUAD_ROLES = [
    {
        id: 'aerodynamicist',
        student: 'Alex (You)',
        roleTitle: 'Lead Aerodynamicist',
        guild: 'Engineering Guild',
        level: 14,
        avatarBg: 'from-[#8B2332] to-[#4A121B]',
        powerName: 'Isobar Pressure Vision',
        powerCost: 15,
        powerDesc: 'Renders live Bernoulli ΔP pressure vectors & velocity ratios directly inside the 60fps wind tunnel.',
    },
    {
        id: 'physicist',
        student: 'Maya K.',
        roleTitle: 'Experimental Physicist',
        guild: 'Science Guild',
        level: 13,
        avatarBg: 'from-[#0F4C5C] to-[#082932]',
        powerName: 'Stall Envelope Horizon',
        powerCost: 15,
        powerDesc: 'Projects the α = 11.5° boundary-layer separation threshold onto the airfoil cross-section.',
    },
    {
        id: 'architect',
        student: 'Liam T.',
        roleTitle: 'Systems & Flight Architect',
        guild: 'Engineering Guild',
        level: 15,
        avatarBg: 'from-[#9A6B26] to-[#4D3411]',
        powerName: 'Co-Op 1901 Camber Calibration',
        powerCost: 20,
        powerDesc: 'Squad cross-checks Wilbur’s 1901 Dayton balance table to lock in 1:20 camber & 7.5° AoA (+150 XP).',
    },
    {
        id: 'strategist',
        student: 'Sophia R.',
        roleTitle: 'First-Principles Analyst',
        guild: 'Law & Venture Guild',
        level: 14,
        avatarBg: 'from-[#3B2F63] to-[#1D1732]',
        powerName: 'Socratic Equation Bridge',
        powerCost: 10,
        powerDesc: 'Links live wind-tunnel lift telemetry directly to the ASU PHY 121 mathematical derivation.',
    },
];

const UNIVERSITY_SKILL_TREE = [
    {
        id: 'node-1',
        code: 'PHY-121.1',
        title: 'Newtonian Kinematics & Force Equilibrium',
        xp: 250,
        status: 'mastered',
        historicalSim: '1687 Cambridge — Principia Trajectories',
        asuCompetency: 'Module 1–2: Free-Body Force Vectors & Net Acceleration',
    },
    {
        id: 'node-2',
        code: 'PHY-121.2',
        title: '2D Vector Decomposition & Momentum',
        xp: 300,
        status: 'mastered',
        historicalSim: '1896 Lilienthal Glider Hill Trials',
        asuCompetency: 'Module 3: Lift/Drag Vector Resolution & Impulse',
    },
    {
        id: 'node-3',
        code: 'PHY-121.4',
        title: 'Bernoulli Pressure Differential & Airfoil Stall',
        xp: 450,
        status: 'active-quest',
        historicalSim: '1901 Dayton Wind Tunnel & 1903 Kitty Hawk Launch',
        asuCompetency: 'Module 4: Continuity, Bernoulli ΔP & Boundary Separation',
    },
    {
        id: 'node-4',
        code: 'PHY-121.5',
        title: '3-Axis Rotational Torque & Wing-Warping Control',
        xp: 400,
        status: 'locked',
        historicalSim: '1905 Huffman Prairie Banked Turn Trials',
        asuCompetency: 'Module 5: Moment of Inertia, Roll/Pitch/Yaw Torque',
    },
    {
        id: 'node-5',
        code: 'PHY-121.6',
        title: 'Capstone Boss Trial: Transonic Airfoil Optimization',
        xp: 600,
        status: 'locked',
        historicalSim: '1933 NACA Langley Variable-Density Tunnel',
        asuCompetency: 'Module 6: Full 4.0 ASU / CLEP Transfer Credit Verification',
    },
];

const SYLLABUS_CAMPAIGN_EPISODES = [
    {
        ep: 'Episode 1',
        weeks: 'Weeks 1–3 · Lectures 1–6',
        syllabusUnit: '1D & 2D Kinematics, Relative Velocity & Vector Addition',
        storyTitle: '1900 Kitty Hawk Tethered Kite Trials',
        kidNarrative:
            'Arrive on the Outer Banks sand dunes with Wilbur & Orville. Decompose coastal headwind vectors and tether tension angles to keep the 1900 test kite stable in a 25 mph gale.',
        asuDeliverable: 'ASU PHY 121 Problem Sets #1–2 + Quiz 1',
        status: 'completed',
        asuScore: '96% (A)',
        xp: '+250 XP',
    },
    {
        ep: 'Episode 2',
        weeks: 'Weeks 4–6 · Lectures 7–12',
        syllabusUnit: 'Newton’s Three Laws, Free-Body Diagrams & Force Equilibrium',
        storyTitle: '1901 Glider Nose-Pitch Mystery',
        kidNarrative:
            'When the 1901 glider pitches nose-down over Kill Devil Hills, balance the four fundamental forces—Lift, Weight, Thrust, and Drag—until net vertical acceleration reaches equilibrium.',
        asuDeliverable: 'ASU PHY 121 Problem Set #3 + Proctored Midterm 1',
        status: 'completed',
        asuScore: '94% (A)',
        xp: '+300 XP',
    },
    {
        ep: 'Episode 3',
        weeks: 'Weeks 7–9 · Lectures 13–18',
        syllabusUnit: 'Fluid Continuity, Bernoulli Pressure Differential & Boundary-Layer Stall',
        storyTitle: '1901 Dayton Wind Tunnel & Dec 17, 1903 Launch Rail',
        kidNarrative:
            'Lilienthal’s published tables are wrong! Step into the 1901 Dayton bicycle-shop wind tunnel to test 200 miniature brass wing ribs, discover the 1:20 camber sweet spot, cure the 14.5° stall, and fly 120 feet at Kitty Hawk.',
        asuDeliverable: 'ASU PHY 121 Problem Set #4 + Module 4 Exam (Active)',
        status: 'active',
        asuScore: 'In Progress (Struggle Detected @ 14:22)',
        xp: '+450 XP Quest',
    },
    {
        ep: 'Episode 4',
        weeks: 'Weeks 10–12 · Lectures 19–24',
        syllabusUnit: 'Rotational Kinematics, Torque, Moment of Inertia & Angular Momentum',
        storyTitle: '1904 Huffman Prairie Banked Turn & Wing-Warping Control',
        kidNarrative:
            'Flying straight isn’t enough—now you have to turn without spinning in! Use pulley cables to warp the wingtips and coordinate rudder torque across all 3 rotational axes.',
        asuDeliverable: 'ASU PHY 121 Problem Set #5 + Proctored Midterm 2',
        status: 'upcoming',
        asuScore: 'Unlocks after Episode 3',
        xp: '+400 XP',
    },
    {
        ep: 'Episode 5',
        weeks: 'Weeks 13–15 · Lectures 25–30',
        syllabusUnit: 'Work, Mechanical Energy, Power, Conservation Laws & Capstone',
        storyTitle: '1905 Wright Flyer III 39-Minute Endurance Capstone',
        kidNarrative:
            'Optimize twin-chain propeller mechanical work and engine shaft power to keep the 1905 Flyer airborne for 24 miles over Dayton—completing your full semester narrative arc.',
        asuDeliverable: 'ASU PHY 121 Proctored Final Exam → 4.0 Transferable Credits',
        status: 'upcoming',
        asuScore: 'Capstone Boss Trial',
        xp: '+600 XP + 4.0 Credits',
    },
];

const ASU_EXAM_COMPANION_PROBLEMS = [
    {
        id: 'prob-1',
        asuHeader: 'ASU Online · PHY 121 Homework #4, Question 4 (10 pts)',
        formalQuestion:
            'Using the Continuity Equation and Bernoulli’s Principle (P₁ + ½ρv₁² = P₂ + ½ρv₂²), explain why a cambered airfoil at α = 7.5° generates net upward lift, whereas increasing α to 14.5° causes a sudden loss of lift.',
        kidTranslation:
            'Remember what you just saw in the 1901 Dayton Wind Tunnel! Upper-surface golden streamlines vs. lower-surface cyan streamlines, and what happened when you cranked the Angle of Attack slider past 11.5°.',
        socraticHint:
            'Look at your Wind Tunnel log: at 1:20 camber and 7.5° AoA, upper air sped up to 1.31× freestream velocity (faster air = lower pressure P_top < P_bottom). What happened to the top streamlines when you pushed α to 14.5°?',
        options: [
            'A. Steeper angle of attack always increases laminar streamline velocity without limit.',
            'B. Camber accelerates upper streamlines (lowering P_top below P_bottom via Bernoulli), while exceeding α_crit ≈ 11.5° detaches the boundary layer into a turbulent stall wake.',
            'C. Air density ρ drops to zero on the bottom surface of a flat plate.',
        ],
        correctIdx: 1,
    },
    {
        id: 'prob-2',
        asuHeader: 'ASU Online · PHY 121 Module 4 Proctored Exam Prep, Question 7 (15 pts)',
        formalQuestion:
            'Given dynamic pressure q = ½ρv² at a 35 mph Kitty Hawk relative headwind (27 mph wind + 8 mph launch rail) and gross aircraft weight W = 605 lbs, which wing configuration satisfies the vertical takeoff condition L = q·S·C_L(α) > W with L/D > 5.2?',
        kidTranslation:
            'In university physics, "vertical takeoff condition L > W" just means your green Lift arrow in the wind tunnel must beat the 605 lb weight of the Flyer + Orville without stalling!',
        socraticHint:
            'Compare your two test flights at Kitty Hawk: 1:12 Lilienthal camber had too much drag, and 14.5° AoA stalled at 34 feet. Which camber and angle gave you 692 lbs of lift (> 605 lbs) and a 120-foot flight?',
        options: [
            'A. Flat plate camber (1:30) at α = 16.0° (stalled wake, L = 410 lbs < 605 lbs).',
            'B. Wright 1:20 camber ratio at α = 7.5° (attached laminar flow, L = 692 lbs > 605 lbs, L/D = 7.5:1).',
            'C. Deep 1:12 camber at α = 0° (insufficient net lift, L = 485 lbs < 605 lbs).',
        ],
        correctIdx: 1,
    },
];

const DEFAULT_SYLLABUS_TEXT = `ARIZONA STATE UNIVERSITY · PHY 121: UNIVERSITY PHYSICS I: MECHANICS (4.0 CREDITS)
Catalog Description: Principles of Newtonian mechanics, kinematics, force vectors, fluid dynamics, rotational torque, work, and conservation of energy.
• Weeks 1–3 (Lectures 1–6): 1D/2D Kinematics, Vector Decomposition & Relative Velocity (HW 1–2, Quiz 1)
• Weeks 4–6 (Lectures 7–12): Newton's Laws of Motion, Free-Body Equilibrium & Drag Forces (HW 3, Midterm 1)
• Weeks 7–9 (Lectures 13–18): Fluid Continuity, Bernoulli Pressure Differential & Boundary-Layer Stall (HW 4, Module 4 Exam)
• Weeks 10–12 (Lectures 19–24): Rotational Kinematics, Torque, Moment of Inertia & 3-Axis Control (HW 5, Midterm 2)
• Weeks 13–15 (Lectures 25–30): Mechanical Work, Power, Energy Conservation & Comprehensive Final Exam`;

const SCHOOLS_SPRINGBOARD = [
    {
        id: 'engineering',
        school: 'Engineering',
        icon: Settings,
        asuCourse: 'ASU PHY 121 · University Physics I',
        asuModule: 'Module 4: Fluid Dynamics, Bernoulli & Newton’s Laws of Lift',
        struggleTopic: 'Bernoulli Pressure Differential & Cambered Airfoil Lift vs. Stall',
        struggleDetail: 'Student rewound whiteboard derivation 3× at 14:22 and missed Homework Q4 (confused Angle-of-Attack stall threshold with camber lift coefficient).',
        mentorName: 'Wilbur & Orville Wright',
        mentorRole: 'Dayton Wind Tunnel & Kitty Hawk, December 1903',
        sceneBg: '/images/visuals/kitty_hawk_2_decision.jpg',
        flightBg: '/images/visuals/kitty_hawk_1_live.jpg',
        credits: '4.0 ASU / CLEP Transferable Credits',
        campaignTitle: 'The 1900–1905 Wright Aero-Engineering Campaign (5 Connected Episodes)',
    },
    {
        id: 'biomedics',
        school: 'Biomedics',
        icon: HeartPulse,
        asuCourse: 'ASU BIO 181 · General Biology & Biophysics',
        asuModule: 'Module 6: Radioisotope Decay, Cellular Targeting & Dose-Response',
        struggleTopic: 'Exponential Half-Life Decay vs. Healthy Tissue Tolerance Threshold',
        struggleDetail: 'Student rewound lecture 3× at 21:10 and missed Lab Quiz Q2 (radiation dose window calculation).',
        mentorName: 'Marie Curie',
        mentorRole: 'Paris Radium Institute Laboratory, 1911',
        sceneBg: '/images/visuals/school_portrait_biomedics.jpg',
        flightBg: '/images/visuals/school_portrait_biomedics.jpg',
        credits: '4.0 ASU / CLEP Transferable Credits',
        campaignTitle: 'The 1898–1914 Paris Radium & Cellular Biophysics Campaign (5 Connected Episodes)',
    },
    {
        id: 'business',
        school: 'Business',
        icon: Briefcase,
        asuCourse: 'ASU ECN 211 · Macroeconomic & Microeconomic Principles',
        asuModule: 'Module 3: Unit Cost Curves, Throughput & Price Elasticity',
        struggleTopic: 'Fixed vs. Marginal Cost Scaling & Market Equilibrium Price',
        struggleDetail: 'Student paused 4× on marginal cost elasticity graphs and missed Case Study Q3.',
        mentorName: 'Henry Ford',
        mentorRole: 'Highland Park Moving Assembly Line, 1913',
        sceneBg: '/images/visuals/school_portrait_business.jpg',
        flightBg: '/images/visuals/school_portrait_business.jpg',
        credits: '3.0 ASU / CLEP Transferable Credits',
        campaignTitle: 'The 1908–1915 Highland Park Industrial Scaling Campaign (5 Connected Episodes)',
    },
    {
        id: 'law',
        school: 'Law & Public Service',
        icon: Scale,
        asuCourse: 'ASU POS 110 · American Government & Constitutional Law',
        asuModule: 'Module 5: Article II Executive Powers, Habeas Corpus & Federalism',
        struggleTopic: 'Constitutional Balancing of Emergency War Powers vs. Due Process',
        struggleDetail: 'Student flagged confusion on Supreme Court precedent analysis in Module 5 brief.',
        mentorName: 'Abraham Lincoln',
        mentorRole: 'Executive Mansion Cabinet Room, 1863',
        sceneBg: '/images/visuals/school_portrait_law.jpg',
        flightBg: '/images/visuals/school_portrait_law.jpg',
        credits: '3.0 ASU / CLEP Transferable Credits',
        campaignTitle: 'The 1787–1865 Constitutional Crisis & Republic Campaign (5 Connected Episodes)',
    },
];

export const ASULectureTransformer = ({ onNavigate }) => {
    // 5 Acts: 'syllabus-campaign' -> 'asu-struggle' -> 'immersive-lab' -> 'concept-mastery' -> 'skill-tree'
    const [stage, setStage] = useState('syllabus-campaign');
    const [selectedSchoolIdx, setSelectedSchoolIdx] = useState(0);
    const activeSchool = SCHOOLS_SPRINGBOARD[selectedSchoolIdx];

    // Act 0: Syllabus-to-Cohesive-Campaign Transformer State
    const [syllabusInput, setSyllabusInput] = useState(DEFAULT_SYLLABUS_TEXT);
    const [isTransformingSyllabus, setIsTransformingSyllabus] = useState(false);
    const [campaignGenerated, setCampaignGenerated] = useState(true);
    const [activeExamProbIdx, setActiveExamProbIdx] = useState(0);
    const [revealedHint, setRevealedHint] = useState(true);
    const [solvedProblems, setSolvedProblems] = useState({});

    // RPG Character Class, XP, Action Points (AP), Mastery Powers & Co-Op Squad State
    const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);
    const [studentXp, setStudentXp] = useState(2840);
    const [studentLevel, setStudentLevel] = useState(14);
    const [actionPoints, setActionPoints] = useState(85);
    const [activePowers, setActivePowers] = useState({
        isobarVision: false,
        stallHorizon: false,
        socraticBridge: false,
    });
    const [squadBannerMsg, setSquadBannerMsg] = useState(
        'Co-Op Discovery Squad Active: 4/4 members synced to ASU PHY 121 Module 4 Quest.'
    );

    // Act 1: ASU Struggle Detection Telemetry State
    const [rewindCount, setRewindCount] = useState(3);
    const [struggleScore, setStruggleScore] = useState(84);
    const [quizAttemptStatus, setQuizAttemptStatus] = useState('failed'); // 'failed' | 'mastered'
    const [struggleLog, setStruggleLog] = useState([
        { time: '14:18', event: 'Rewound lecture segment (Bernoulli equation derivation)', type: 'warn' },
        { time: '14:21', event: 'Rewound lecture segment 3× — ConfusionDetectionService triggered', type: 'alert' },
        { time: '14:25', event: 'Missed PHY-121 Check #4: Predicted flat wing @ 18° AoA maximizes lift (Stall Misconception)', type: 'alert' },
    ]);

    // Act 2: Interactive 60fps Kitty Hawk Wind-Tunnel & Flight Parameters
    const [camberRatio, setCamberRatio] = useState(28); // 1:28 (too flat initially) -> optimal is 18..22 (1:20 Wright camber)
    const [aoaDeg, setAoaDeg] = useState(14.5); // 14.5 deg (near stall initially!) -> optimal is 5.5..9.0 deg
    const [windMph, setWindMph] = useState(27); // Kitty Hawk Dec 17, 1903 headwind = 27 mph + 8 mph rail = 35 mph airspeed
    const [simMode, setSimMode] = useState('wind-tunnel'); // 'wind-tunnel' | 'flight-test'
    const [flightRunning, setFlightRunning] = useState(false);
    const [flightDistanceFt, setFlightDistanceFt] = useState(0);
    const [flightOutcome, setFlightOutcome] = useState(null); // null | 'stall' | 'insufficient-lift' | 'success-120ft'
    const [iterationCount, setIterationCount] = useState(1);
    const [socraticMessage, setSocraticMessage] = useState(
        "Welcome to our 1901 Dayton wind tunnel. In your ASU lecture, you hit a wall on why wing curvature and angle of attack behave differently. Look at the streamlines right now: our Angle of Attack is cranked to 14.5° and our camber is too flat (1:28). Watch the red turbulent wake tearing off the top edge—that's an aerodynamic stall! Try tuning the Camber toward 1:20 and lowering Angle of Attack to 6°–8°, or trigger a Squad Mastery Power below."
    );

    // Act 3: Concept Second & ASU Credit Sync State
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [progressPct, setProgressPct] = useState(68);
    const [asuSynced, setAsuSynced] = useState(false);

    const canvasRef = useRef(null);
    const flightProgressRef = useRef(0);

    // Compute real-time aerodynamic physics from student sliders
    const computeAero = () => {
        // Camber factor: Wright Brothers found 1:20 (camberRatio = 20) was the sweet spot vs Lilienthal's 1:12
        const camberOptimality = Math.max(0.35, 1.0 - Math.abs(camberRatio - 20) / 18);
        // Stall onset above 11.5 deg
        const isStalled = aoaDeg > 11.5;
        const stallSeverity = isStalled ? Math.min(1.0, (aoaDeg - 11.5) / 6.5) : 0;

        // Lift coefficient C_L
        const rawCl = 0.28 * camberOptimality + 0.095 * aoaDeg;
        const cl = isStalled ? rawCl * (1.0 - 0.58 * stallSeverity) : rawCl;

        // Drag coefficient C_D (parasitic + induced + stall separation penalty)
        const cd = 0.045 + 0.0022 * Math.pow(aoaDeg - 4, 2) + (isStalled ? 0.19 * stallSeverity : 0) + (camberRatio < 15 ? 0.04 : 0);

        // Dynamic pressure factor at Kitty Hawk (airspeed = windMph + 8 mph rail speed)
        const airspeedMph = windMph + 8;
        const qScale = Math.pow(airspeedMph / 35, 2);

        const liftLbs = Math.round(625 * (cl / 0.82) * qScale);
        const weightLbs = 605; // 1903 Wright Flyer gross weight with Orville aboard = 605 lbs (2,690 N)
        const dragLbs = Math.round(92 * (cd / 0.085) * qScale);
        const ldRatio = (liftLbs / Math.max(20, dragLbs)).toFixed(1);
        const vTopRatio = (1.0 + 0.34 * cl).toFixed(2);
        const deltaP = Math.round(liftLbs * 1.18);

        return {
            isStalled,
            stallSeverity,
            cl: cl.toFixed(2),
            cd: cd.toFixed(3),
            liftLbs,
            weightLbs,
            dragLbs,
            ldRatio,
            vTopRatio,
            deltaP,
            canFly: !isStalled && liftLbs >= weightLbs && parseFloat(ldRatio) >= 5.2,
        };
    };

    const aero = computeAero();

    // Trigger simulated rewind in ASU portal using real ConfusionDetectionService
    const handleSimulateRewind = () => {
        ConfusionDetectionService.trackRewind('demo-student', 'ASU-PHY-121', 862);
        setRewindCount((c) => c + 1);
        setStruggleScore((s) => Math.min(98, s + 5));
        setStruggleLog((prev) => [
            {
                time: '14:28',
                event: `Rewind #${rewindCount + 1} at 14:22 — Socratic Springboard ready for instant intervention`,
                type: 'alert',
            },
            ...prev.slice(0, 4),
        ]);
    };

    // Apply optimal preset so presenter can demo 1-click fix
    const handleApplyWrightPreset = () => {
        setCamberRatio(20);
        setAoaDeg(7.5);
        setWindMph(27);
        setIterationCount((c) => c + 1);
        setFlightOutcome(null);
        setSocraticMessage(
            "Spot on! Look at the wind tunnel now: with a 1:20 camber and a 7.5° Angle of Attack, the upper streamlines accelerate smoothly to 1.31× freestream velocity without separating. Lift is 692 lbs—exceeding our 605 lb Flyer weight! Click 'Test Flight over Kitty Hawk Dunes' to launch."
        );
    };

    // Trigger RPG Squad Mastery Power inside the 60fps Wind Tunnel
    const handleTriggerSquadPower = (idx) => {
        const role = SQUAD_ROLES[idx];
        setSelectedRoleIdx(idx);
        if (idx === 0) {
            setActivePowers((p) => ({ ...p, isobarVision: !p.isobarVision }));
            setActionPoints((ap) => Math.max(10, ap - role.powerCost));
            setStudentXp((xp) => xp + 75);
            setSquadBannerMsg(
                'Alex activated Isobar Pressure Vision (-15 AP, +75 XP): Bernoulli ΔP contours & velocity ratios overlaid on 60fps wind tunnel.'
            );
        } else if (idx === 1) {
            setActivePowers((p) => ({ ...p, stallHorizon: !p.stallHorizon }));
            setActionPoints((ap) => Math.max(10, ap - role.powerCost));
            setStudentXp((xp) => xp + 75);
            setSquadBannerMsg(
                'Maya K. activated Stall Envelope Horizon (-15 AP, +75 XP): Critical α = 11.5° boundary-layer separation line projected.'
            );
        } else if (idx === 2) {
            handleApplyWrightPreset();
            setActivePowers({ isobarVision: true, stallHorizon: true, socraticBridge: true });
            setActionPoints((ap) => Math.max(10, ap - role.powerCost));
            setStudentXp((xp) => xp + 150);
            setSquadBannerMsg(
                'Liam T. triggered Co-Op 1901 Camber Calibration (-20 AP, +150 Squad XP): Locked 1:20 Wright camber & 7.5° AoA!'
            );
        } else if (idx === 3) {
            setActivePowers((p) => ({ ...p, socraticBridge: !p.socraticBridge }));
            setActionPoints((ap) => Math.max(10, ap - role.powerCost));
            setStudentXp((xp) => xp + 60);
            setSquadBannerMsg(
                'Sophia R. activated Socratic Equation Bridge (-10 AP, +60 XP): Live L = ½ρv²S·C_L(α) telemetry linked to ASU PHY 121.'
            );
        }
    };

    // Launch the 1903 Flyer test flight
    const handleLaunchFlight = () => {
        setSimMode('flight-test');
        setFlightRunning(true);
        flightProgressRef.current = 0;
        setFlightDistanceFt(0);
        setFlightOutcome(null);
    };

    // 60fps Canvas Loop for Wind Tunnel AND Kitty Hawk Flight Simulation
    useEffect(() => {
        if (stage !== 'immersive-lab') return;
        let raf;
        let t0 = performance.now();

        const renderLoop = (now) => {
            const t = (now - t0) / 1000;
            const c = canvasRef.current;
            if (c) {
                const ctx = c.getContext('2d');
                const W = c.width;
                const H = c.height;
                ctx.clearRect(0, 0, W, H);

                if (simMode === 'wind-tunnel') {
                    // ─── MODE 1: 1901 DAYTON WIND TUNNEL 60FPS STREAMLINE & PRESSURE SIM ───
                    const bg = ctx.createLinearGradient(0, 0, 0, H);
                    bg.addColorStop(0, '#090D16');
                    bg.addColorStop(1, '#14080C');
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, W, H);

                    // Subtle brass measurement grid
                    ctx.strokeStyle = 'rgba(230, 198, 135, 0.08)';
                    ctx.lineWidth = 1;
                    for (let x = 0; x <= W; x += 44) {
                        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
                    }
                    for (let y = 0; y <= H; y += 44) {
                        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
                    }

                    // Low-pressure / High-pressure zone glow around wing
                    const cx = W * 0.48;
                    const cy = H * 0.52;
                    const topGlow = ctx.createRadialGradient(cx, cy - 52, 10, cx, cy - 52, 175);
                    if (aero.isStalled) {
                        topGlow.addColorStop(0, 'rgba(239, 68, 68, 0.32)');
                        topGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
                    } else {
                        topGlow.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
                        topGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
                    }
                    ctx.fillStyle = topGlow;
                    ctx.fillRect(0, 0, W, H);

                    const botGlow = ctx.createRadialGradient(cx, cy + 48, 10, cx, cy + 48, 165);
                    botGlow.addColorStop(0, 'rgba(56, 189, 248, 0.24)');
                    botGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
                    ctx.fillStyle = botGlow;
                    ctx.fillRect(0, 0, W, H);

                    // Optional Squad Power 1: Isobar Pressure Contour Rings
                    if (activePowers.isobarVision) {
                        ctx.save();
                        ctx.strokeStyle = aero.isStalled ? 'rgba(248, 113, 113, 0.42)' : 'rgba(230, 198, 135, 0.45)';
                        ctx.setLineDash([5, 5]);
                        ctx.lineWidth = 1.5;
                        [52, 86, 120].forEach((rx, idx) => {
                            ctx.beginPath();
                            ctx.ellipse(cx, cy - 34, rx * 1.4, rx * 0.55, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.fillStyle = '#FDE68A';
                            ctx.font = 'bold 10px Inter, sans-serif';
                            ctx.fillText(`Isobar -${Math.round(aero.deltaP * (1 - idx * 0.25))} Pa`, cx + rx * 1.1, cy - 38 - idx * 14);
                        });
                        ctx.restore();
                    }

                    // Optional Squad Power 2: Stall Envelope Horizon Line (α_crit = 11.5°)
                    if (activePowers.stallHorizon) {
                        ctx.save();
                        ctx.translate(cx, cy);
                        ctx.rotate((-11.5 * Math.PI) / 180);
                        ctx.strokeStyle = 'rgba(248, 113, 113, 0.85)';
                        ctx.setLineDash([8, 4]);
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(-190, 0);
                        ctx.lineTo(190, 0);
                        ctx.stroke();
                        ctx.fillStyle = '#FCA5A5';
                        ctx.font = 'bold 11px Inter, sans-serif';
                        ctx.fillText('CRITICAL STALL HORIZON (α_crit = 11.5°)', -180, -10);
                        ctx.restore();
                    }

                    // Streamlines
                    const camberDepth = 540 / camberRatio; // higher camberRatio = flatter wing
                    for (let r = -4; r <= 4; r++) {
                        const baseY = cy + r * 32;
                        ctx.beginPath();
                        for (let s = 0; s <= 70; s++) {
                            const u = s / 70;
                            const px = u * W;
                            const dist = (u - 0.48) / 0.19;
                            const bell = Math.exp(-dist * dist);
                            let offset = 0;
                            if (r <= 0) {
                                offset = -bell * (camberDepth * 1.45 + aoaDeg * 2.1) * (1 - Math.abs(r) * 0.17);
                                // Add turbulent vortex oscillation behind wing if stalled
                                if (aero.isStalled && u > 0.46) {
                                    offset += Math.sin(u * 28 - t * 14 + r) * 18 * aero.stallSeverity * (u - 0.46);
                                }
                            } else {
                                offset = -bell * (camberDepth * 0.45 + aoaDeg * 0.9) * (1 - r * 0.18);
                            }
                            const py = baseY + offset;
                            if (s === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.strokeStyle =
                            r < 0
                                ? aero.isStalled
                                    ? 'rgba(248, 113, 113, 0.78)'
                                    : 'rgba(245, 158, 11, 0.85)'
                                : 'rgba(56, 189, 248, 0.78)';
                        ctx.lineWidth = r === -1 || r === 1 ? 2.5 : 1.6;
                        ctx.stroke();

                        // Animated tracer photons
                        for (let k = 0; k < 3; k++) {
                            const speed = r < 0 ? 0.46 : 0.31;
                            const u = (t * speed + k * 0.33 + (r + 4) * 0.07) % 1;
                            const dist = (u - 0.48) / 0.19;
                            const bell = Math.exp(-dist * dist);
                            let offset =
                                r <= 0
                                    ? -bell * (camberDepth * 1.45 + aoaDeg * 2.1) * (1 - Math.abs(r) * 0.17)
                                    : -bell * (camberDepth * 0.45 + aoaDeg * 0.9) * (1 - r * 0.18);
                            if (aero.isStalled && r <= 0 && u > 0.46) {
                                offset += Math.sin(u * 28 - t * 14 + r) * 18 * aero.stallSeverity * (u - 0.46);
                            }
                            ctx.fillStyle = r < 0 ? (aero.isStalled ? '#FCA5A5' : '#FDE68A') : '#BAE6FD';
                            ctx.beginPath();
                            ctx.arc(u * W, baseY + offset, 3.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }

                    // Draw cambered 1903 Wright airfoil rib rotated by aoaDeg
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate((-aoaDeg * Math.PI) / 180);
                    ctx.beginPath();
                    ctx.moveTo(-145, 12);
                    ctx.quadraticCurveTo(-30, -camberDepth * 2.1, 145, 10);
                    ctx.quadraticCurveTo(-25, -camberDepth * 0.85, -145, 12);
                    ctx.closePath();
                    ctx.fillStyle = '#E6C687';
                    ctx.fill();
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2.2;
                    ctx.stroke();
                    ctx.restore();

                    // Lift Vector (Green upward arrow) & Weight Vector (Slate downward arrow)
                    const liftLen = Math.min(145, Math.max(35, (aero.liftLbs / 605) * 95));
                    const weightLen = 95;

                    // Lift vector
                    ctx.strokeStyle = aero.liftLbs >= aero.weightLbs && !aero.isStalled ? '#10B981' : '#F59E0B';
                    ctx.lineWidth = 4.5;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx, cy - liftLen);
                    ctx.stroke();
                    ctx.fillStyle = aero.liftLbs >= aero.weightLbs && !aero.isStalled ? '#10B981' : '#F59E0B';
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - liftLen - 12);
                    ctx.lineTo(cx - 8, cy - liftLen + 2);
                    ctx.lineTo(cx + 8, cy - liftLen + 2);
                    ctx.closePath();
                    ctx.fill();

                    // Weight vector
                    ctx.strokeStyle = '#94A3B8';
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx, cy + weightLen);
                    ctx.stroke();
                    ctx.fillStyle = '#94A3B8';
                    ctx.beginPath();
                    ctx.moveTo(cx, cy + weightLen + 10);
                    ctx.lineTo(cx - 7, cy + weightLen - 2);
                    ctx.lineTo(cx + 7, cy + weightLen - 2);
                    ctx.closePath();
                    ctx.fill();

                    // HUD Labels on Canvas
                    ctx.font = 'bold 13px Inter, sans-serif';
                    ctx.fillStyle = aero.liftLbs >= aero.weightLbs && !aero.isStalled ? '#34D399' : '#FBBF24';
                    ctx.fillText(`LIFT L = ${aero.liftLbs} lbs`, cx + 14, cy - liftLen + 4);
                    ctx.fillStyle = '#CBD5E1';
                    ctx.fillText(`WEIGHT W = ${aero.weightLbs} lbs (Flyer + Orville)`, cx + 14, cy + weightLen);

                    ctx.fillStyle = '#FDE68A';
                    ctx.font = 'bold 12px Inter, sans-serif';
                    ctx.fillText(
                        aero.isStalled
                            ? `⚠ FLOW SEPARATION STALL (α = ${aoaDeg.toFixed(1)}° > 11.5°)`
                            : `LOW PRESSURE UPPER SURFACE · v_top = ${aero.vTopRatio}× v_∞`,
                        24,
                        32
                    );
                    ctx.fillStyle = '#7DD3FC';
                    ctx.fillText(`HIGH PRESSURE LOWER SURFACE · ΔP = +${aero.deltaP} Pa`, 24, H - 18);

                    // Optional Squad Power 4: Socratic Equation Bridge Box
                    if (activePowers.socraticBridge) {
                        ctx.fillStyle = 'rgba(20, 7, 11, 0.88)';
                        ctx.fillRect(W - 310, 14, 294, 58);
                        ctx.strokeStyle = '#E6C687';
                        ctx.lineWidth = 1.4;
                        ctx.strokeRect(W - 310, 14, 294, 58);
                        ctx.fillStyle = '#E6C687';
                        ctx.font = 'bold 11px Inter, sans-serif';
                        ctx.fillText('ASU PHY 121 EQUATION BRIDGE (ACTIVE)', W - 298, 32);
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = 'bold 12px Georgia, serif';
                        ctx.fillText(`C_L(α=${aoaDeg.toFixed(1)}°) = ${aero.cl}  |  L/D = ${aero.ldRatio}:1`, W - 298, 54);
                    }
                } else {
                    // ─── MODE 2: KITTY HAWK DECEMBER 17, 1903 LAUNCH RAIL FLIGHT TEST ───
                    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.72);
                    sky.addColorStop(0, '#1B2738');
                    sky.addColorStop(0.6, '#433236');
                    sky.addColorStop(1, '#C89D66');
                    ctx.fillStyle = sky;
                    ctx.fillRect(0, 0, W, H);

                    // Kitty Hawk sand dunes
                    ctx.fillStyle = '#8C6D46';
                    ctx.beginPath();
                    ctx.moveTo(0, H * 0.74);
                    ctx.quadraticCurveTo(W * 0.35, H * 0.69, W, H * 0.75);
                    ctx.lineTo(W, H);
                    ctx.lineTo(0, H);
                    ctx.closePath();
                    ctx.fill();

                    // 60-ft wooden launch monorail
                    ctx.fillStyle = '#4A2E1B';
                    ctx.fillRect(40, H * 0.75, 250, 7);

                    // Distance markers (0 ft, 40 ft, 80 ft, 120 ft)
                    ctx.fillStyle = '#F5EBDC';
                    ctx.font = 'bold 11px Inter, sans-serif';
                    [
                        [60, '0 ft (Launch Rail)'],
                        [290, '40 ft'],
                        [500, '80 ft'],
                        [710, '120 ft (1903 Record!)'],
                    ].forEach(([mx, mlbl]) => {
                        ctx.fillRect(mx, H * 0.75 - 8, 2, 16);
                        ctx.fillText(mlbl, mx - 18, H * 0.75 + 26);
                    });

                    // Advance flight progress
                    if (flightRunning) {
                        flightProgressRef.current = Math.min(1.0, flightProgressRef.current + 0.0085);
                        const u = flightProgressRef.current;
                        const maxDist = aero.canFly ? 120 : aero.isStalled ? 34 : 48;
                        setFlightDistanceFt(Math.round(u * maxDist));

                        if (u >= 1.0) {
                            setFlightRunning(false);
                            if (aero.canFly) {
                                setFlightOutcome('success-120ft');
                                setStudentXp((xp) => xp + 250);
                                setSocraticMessage(
                                    "120 FEET IN 12 SECONDS (+250 XP)! You just recreated the exact physics of December 17, 1903. Because your 1:20 camber accelerated the upper air to 1.31× freestream velocity at a clean 7.5° Angle of Attack, Bernoulli pressure differential generated 692 lbs of lift—carrying the 605 lb Flyer smoothly across the dunes! Now click 'Step 5: Lock In ASU Credit & Mastery' to sync this back to your ASU PHY 121 portal and unlock Node 4 on your University Skill Tree."
                                );
                            } else if (aero.isStalled) {
                                setFlightOutcome('stall');
                                setIterationCount((c) => c + 1);
                                setSocraticMessage(
                                    `Productive Failure (Iteration #${iterationCount}): The Flyer pitched up off the rail at ${aoaDeg.toFixed(1)}° Angle of Attack, stalled in turbulent flow separation at 34 feet, and settled onto the sand. Lower your Angle of Attack to 6°–8° and re-launch!`
                                );
                            } else {
                                setFlightOutcome('insufficient-lift');
                                setIterationCount((c) => c + 1);
                                setSocraticMessage(
                                    `Productive Failure (Iteration #${iterationCount}): With 1:${camberRatio} camber and ${aoaDeg.toFixed(1)}° AoA, your wings only generated ${aero.liftLbs} lbs of lift against our 605 lb Flyer weight. Curve the wing camber closer to 1:20 and re-launch!`
                                );
                            }
                        }
                    }

                    const u = flightProgressRef.current;
                    let fx = 70;
                    let fy = H * 0.75 - 18;
                    let pitchDeg = -aoaDeg * 0.5;

                    if (aero.canFly) {
                        fx = 70 + u * 645;
                        const climb = u < 0.25 ? (u / 0.25) : 1.0 - Math.sin((u - 0.25) * Math.PI) * 0.12;
                        fy = H * 0.75 - 18 - climb * 135;
                        pitchDeg = -7;
                    } else if (aero.isStalled) {
                        fx = 70 + u * 230;
                        const stallArc = u < 0.45 ? Math.sin((u / 0.45) * (Math.PI / 2)) * 85 : Math.max(0, 85 * (1 - (u - 0.45) / 0.55));
                        fy = H * 0.75 - 18 - stallArc;
                        pitchDeg = u < 0.45 ? -22 : 14;
                    } else {
                        fx = 70 + u * 290;
                        const hop = u > 0.3 && u < 0.75 ? Math.sin(((u - 0.3) / 0.45) * Math.PI) * 22 : 0;
                        fy = H * 0.75 - 18 - hop;
                        pitchDeg = -4;
                    }

                    // Golden trajectory trail
                    ctx.strokeStyle = aero.canFly ? 'rgba(16, 185, 129, 0.85)' : 'rgba(245, 158, 11, 0.85)';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([6, 4]);
                    ctx.beginPath();
                    ctx.moveTo(70, H * 0.75 - 14);
                    ctx.lineTo(fx, fy);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Draw 1903 Wright Biplane Flyer silhouette
                    ctx.save();
                    ctx.translate(fx, fy);
                    ctx.rotate((pitchDeg * Math.PI) / 180);
                    // Upper & lower biplane wings
                    ctx.fillStyle = '#F5EBDC';
                    ctx.fillRect(-38, -22, 76, 6);
                    ctx.fillRect(-38, -4, 76, 6);
                    // Struts
                    ctx.strokeStyle = '#C89D66';
                    ctx.lineWidth = 2;
                    [-24, 0, 24].forEach((sx) => {
                        ctx.beginPath(); ctx.moveTo(sx, -22); ctx.lineTo(sx, -4); ctx.stroke();
                    });
                    // Forward canard elevator
                    ctx.fillStyle = '#E6C687';
                    ctx.fillRect(36, -12, 22, 4);
                    ctx.beginPath(); ctx.moveTo(28, -4); ctx.lineTo(46, -10); ctx.stroke();
                    ctx.restore();

                    // Top Banner in Flight View
                    ctx.fillStyle = 'rgba(20, 7, 11, 0.82)';
                    ctx.fillRect(18, 16, 460, 56);
                    ctx.strokeStyle = '#E6C687';
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(18, 16, 460, 56);
                    ctx.fillStyle = '#E6C687';
                    ctx.font = 'bold 12px Inter, sans-serif';
                    ctx.fillText('KITTY HAWK TRIAL  ·  DECEMBER 17, 1903  ·  27 MPH HEADWIND', 32, 36);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 15px Georgia, serif';
                    ctx.fillText(`Distance Flown: ${flightDistanceFt} ft   |   Net Lift: ${aero.liftLbs} lbs vs 605 lbs`, 32, 58);
                }
            }
            raf = requestAnimationFrame(renderLoop);
        };

        raf = requestAnimationFrame(renderLoop);
        return () => cancelAnimationFrame(raf);
    }, [stage, simMode, camberRatio, aoaDeg, windMph, flightRunning, aero.canFly, aero.isStalled, aero.liftLbs, activePowers]);

    const handleTransformSyllabus = () => {
        setIsTransformingSyllabus(true);
        setTimeout(() => {
            setIsTransformingSyllabus(false);
            setCampaignGenerated(true);
        }, 450);
    };

    const handleCompleteConceptCheck = (idx) => {
        setSelectedAnswer(idx);
        const currentProb = ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx];
        if (idx === currentProb.correctIdx) {
            setSolvedProblems((prev) => ({ ...prev, [currentProb.id]: true }));
            setQuizAttemptStatus('mastered');
            setProgressPct(88);
            setAsuSynced(true);
            setStudentXp(3290);
            setStudentLevel(15);
            setSquadBannerMsg(
                'LEVEL UP! Alex reached LVL 15 Lead Aerodynamicist (+450 XP) · ASU PHY 121 Homework #4 & Exam Prep Verified Properly!'
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#120609] text-white flex flex-col">
            {/* ═══════════════════════════════════════════════════════════════
                TOP BAR: UNIVERSITY SCHOOL × ASU SPRINGBOARD CONTROLLER
               ═══════════════════════════════════════════════════════════════ */}
            <header className="sticky top-0 z-40 bg-[#1B070C]/95 backdrop-blur-md border-b border-[#E6C687]/30 px-4 sm:px-8 py-3.5">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onNavigate('landing')}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        >
                            <ArrowLeft size={15} /> Back to usai.school
                        </button>
                        <div className="h-6 w-px bg-white/15 hidden sm:block" />
                        <img src="/images/unischool-logo.png" alt="University School" className="w-8 h-8 rounded-lg" />
                        <div>
                            <div className="font-serif font-bold text-base text-white leading-none">
                                University School <span className="text-[#E6C687]">Syllabus-to-Immersive Engine</span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-0.5">
                                Any University Syllabus &rarr; Cohesive Story Episodes &rarr; Socratic Help to Pass ASU Exams Properly
                            </div>
                        </div>
                    </div>

                    {/* 5-Act Stage Switcher */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {[
                            { id: 'syllabus-campaign', label: '1. Syllabus → Story Campaign' },
                            { id: 'asu-struggle', label: '2. ASU Struggle Detected' },
                            { id: 'immersive-lab', label: '3. Live Episode: 1903 Sim' },
                            { id: 'concept-mastery', label: '4. Pass ASU HW & Exams Properly' },
                            { id: 'skill-tree', label: '5. RPG Skill Tree' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStage(tab.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                    stage === tab.id
                                        ? 'bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D] shadow-lg'
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Knowledge School Selector + RPG Character Class / XP / Action Points HUD */}
            <div className="bg-[#18080C] border-b border-[#E6C687]/20 px-4 sm:px-8 py-3">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    {/* Left: Knowledge School Track Switcher */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6C687] mr-1">
                            Course Syllabus:
                        </span>
                        {SCHOOLS_SPRINGBOARD.map((s, idx) => {
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSchoolIdx(idx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                                        selectedSchoolIdx === idx
                                            ? 'bg-[#8B2332] text-white border-[#E6C687]'
                                            : 'bg-black/30 text-slate-300 border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <Icon size={13} className="text-[#E6C687]" />
                                    <span>{s.school}</span>
                                    <span className="text-[10px] text-[#E6C687]/80 hidden md:inline">({s.asuCourse.split('·')[0].trim()})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: RPG Student Class, Level, XP Bar, Action Points (AP) & Co-Op Squad Trigger */}
                    <div className="flex flex-wrap items-center gap-3 bg-black/45 border border-[#E6C687]/30 rounded-xl px-3.5 py-2">
                        <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F1D59A] to-[#9A6B26] text-[#23090D] font-black text-xs flex items-center justify-center shadow">
                                L{studentLevel}
                            </span>
                            <div>
                                <div className="text-xs font-bold text-white leading-none">
                                    {SQUAD_ROLES[selectedRoleIdx].student} · <span className="text-[#E6C687]">{SQUAD_ROLES[selectedRoleIdx].roleTitle}</span>
                                </div>
                                <div className="text-[10px] text-slate-300 mt-0.5">
                                    {SQUAD_ROLES[selectedRoleIdx].guild} · Accredited Quest Active
                                </div>
                            </div>
                        </div>

                        <div className="h-5 w-px bg-white/15 hidden sm:block" />

                        {/* XP Progress Pill */}
                        <div className="flex items-center gap-1.5 text-xs">
                            <Flame size={14} className="text-amber-400" />
                            <span className="font-mono font-bold text-[#E6C687]">{studentXp.toLocaleString()} XP</span>
                        </div>

                        {/* Action Points (AP) Pill */}
                        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#8B2332]/50 border border-[#E6C687]/35">
                            <Zap size={13} className="text-[#E6C687]" />
                            <span className="font-mono font-bold text-white">{actionPoints} AP</span>
                        </div>

                        {/* Open Skill Tree Button */}
                        <button
                            onClick={() => setStage(stage === 'skill-tree' ? 'immersive-lab' : 'skill-tree')}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-[#E6C687]/40 text-[11px] font-bold text-[#E6C687] flex items-center gap-1 transition-all"
                        >
                            <Layers size={12} />
                            {stage === 'skill-tree' ? 'Back to Sim' : 'Skill Tree (5 Nodes)'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                ACT 0: TRANSFORM ANY SYLLABUS INTO A COHESIVE IMMERSIVE CAMPAIGN
               ═══════════════════════════════════════════════════════════════ */}
            {stage === 'syllabus-campaign' && (
                <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left 5 Columns: University Syllabus Input & Concept-Graph Ingestion */}
                    <div className="lg:col-span-5 bg-[#1B080D] border border-[#E6C687]/40 rounded-3xl p-6 shadow-2xl space-y-5">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6C687]">
                                Step 1 · Syllabus-to-Narrative Engine
                            </span>
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                                Transform Any University Syllabus Into a Cohesive Story Campaign.
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                                Instead of forcing an 11–14 year old to watch 30 disconnected 50-minute lectures, our engine extracts every prerequisite concept from the university syllabus and weaves the entire semester into <strong>one continuous historical adventure</strong>.
                            </p>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#E6C687]">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen size={14} />
                                    Example from ASU ({activeSchool.asuCourse.split('·')[0].trim()})
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono">
                                    Any University Class Transformed · 15 Weeks
                                </span>
                            </div>

                            {/* Read-Only Official ASU Example Syllabus Card (No Freeform User Text Input) */}
                            <div className="w-full rounded-2xl bg-black/55 border border-[#E6C687]/35 p-4 space-y-2 select-none">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                                        {activeSchool.asuCourse}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">
                                        Official ASU Catalog Example
                                    </span>
                                </div>
                                {activeSchool.syllabusPreview.split('\n').map((line, i) => (
                                    <div
                                        key={i}
                                        className="text-xs font-mono text-slate-200 leading-relaxed bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2"
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleTransformSyllabus}
                            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Sparkles size={17} />
                            {isTransformingSyllabus
                                ? 'Extracting Concept Graph & Building Story Arc...'
                                : 'Transform Syllabus into 5-Episode Immersive Campaign'}
                        </button>

                        {/* Pipeline Guarantee Box */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-slate-300">
                            <div className="font-bold text-[#E6C687] uppercase tracking-wider text-[11px]">
                                How It Helps Kids Pass ASU Online Properly:
                            </div>
                            <p className="leading-relaxed">
                                1. <strong>Cohesive Multi-Lecture Arc:</strong> Every syllabus week becomes a playable chapter with the same historical mentors.<br />
                                2. <strong>Struggle Intercept:</strong> If a student gets stuck on the ASU site, we launch the exact episode for that module.<br />
                                3. <strong>Acceptable Exam &amp; HW Companion:</strong> Socratic memory bridges help the student solve official ASU assignments and proctored exams <em>themselves</em>—with zero answer-giving.
                            </p>
                        </div>
                    </div>

                    {/* Right 7 Columns: The Cohesive 5-Episode Historical Narrative Arc */}
                    <div className="lg:col-span-7 bg-[#16070B] border border-[#E6C687]/35 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6C687]">
                                    Generated Semester Narrative Arc · {activeSchool.credits}
                                </span>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                                    {activeSchool.campaignTitle}
                                </h3>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                                100% Syllabus Coverage ✓
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {SYLLABUS_CAMPAIGN_EPISODES.map((ep, idx) => {
                                const isCurrent = ep.status === 'active';
                                const isDone = ep.status === 'completed';
                                return (
                                    <div
                                        key={ep.ep}
                                        className={`p-4 rounded-2xl border transition-all ${
                                            isCurrent
                                                ? 'bg-gradient-to-r from-[#8B2332]/55 to-[#260910] border-[#E6C687] shadow-xl'
                                                : isDone
                                                ? 'bg-emerald-950/25 border-emerald-500/35'
                                                : 'bg-black/35 border-white/10 opacity-85'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full bg-black/50 border border-[#E6C687]/40 text-[#E6C687] text-[11px] font-bold">
                                                    {ep.ep} · {ep.weeks}
                                                </span>
                                                <span className="text-xs font-bold text-amber-300">{ep.xp}</span>
                                            </div>
                                            <span
                                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                                    isDone
                                                        ? 'bg-emerald-500/20 text-emerald-300'
                                                        : isCurrent
                                                        ? 'bg-amber-500/25 text-amber-200 animate-pulse'
                                                        : 'bg-white/10 text-slate-300'
                                                }`}
                                            >
                                                {ep.asuScore}
                                            </span>
                                        </div>

                                        <div className="font-serif font-bold text-base sm:text-lg text-white">
                                            {ep.storyTitle}
                                        </div>
                                        <div className="text-xs font-semibold text-[#E6C687] mt-0.5">
                                            Syllabus Lectures: {ep.syllabusUnit}
                                        </div>
                                        <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                                            {ep.kidNarrative}
                                        </p>

                                        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                                            <span className="text-slate-300">
                                                <strong>ASU Online Target:</strong> {ep.asuDeliverable}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {isCurrent ? (
                                                    <>
                                                        <button
                                                            onClick={() => setStage('asu-struggle')}
                                                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs"
                                                        >
                                                            See ASU Struggle
                                                        </button>
                                                        <button
                                                            onClick={() => setStage('immersive-lab')}
                                                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D] font-bold text-xs flex items-center gap-1 shadow"
                                                        >
                                                            Play Episode 3 Sim <ChevronRight size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => setStage('immersive-lab')}
                                                        className="text-[#E6C687] hover:underline font-bold text-xs"
                                                    >
                                                        Preview Episode &rarr;
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                ACT 1: ASU PORTAL WITH REAL-TIME STRUGGLE DETECTION
               ═══════════════════════════════════════════════════════════════ */}
            {stage === 'asu-struggle' && (
                <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left 7 Columns: The Traditional ASU Online Course Portal */}
                    <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                        {/* ASU Maroon Header */}
                        <div className="bg-[#8C1D40] text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#FFC627] text-[#8C1D40] font-black text-sm flex items-center justify-center shadow">
                                    ASU
                                </div>
                                <div>
                                    <div className="font-bold text-base leading-tight">{activeSchool.asuCourse}</div>
                                    <div className="text-xs text-amber-200">{activeSchool.asuModule}</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-black/25 text-xs font-semibold">
                                Student: Alex (Age 12 · LVL {studentLevel})
                            </span>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Passive Lecture Player Simulation */}
                            <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900">
                                <img
                                    src="/images/visuals/passive_learning_diptych.jpg"
                                    alt="Passive lecture vs reading"
                                    className="w-full h-56 object-cover opacity-85"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <span className="px-2.5 py-0.5 rounded bg-red-600 text-[10px] font-bold uppercase tracking-wider">
                                                50-Min Whiteboard Lecture · Timestamp 14:22
                                            </span>
                                            <h3 className="font-bold text-lg mt-1">
                                                Derivation: {activeSchool.struggleTopic}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={handleSimulateRewind}
                                            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                                        >
                                            <RotateCcw size={14} /> Rewind 15s ({rewindCount}×)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Failed Textbook Formula Question where the Student is Stuck */}
                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                                        <AlertTriangle size={18} />
                                        <span>ASU Module Check #4 — Student Stuck on 2nd Attempt</span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-red-200 text-red-900 text-[11px] font-bold">
                                        {quizAttemptStatus === 'mastered' ? 'RESOLVED ✓' : 'CONCEPT GAP DETECTED'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                    <strong>Question:</strong> Using $L = \frac{1}{2}\rho v^2 S C_L(\alpha)$, why did early glider tests fail when pilots increased wing angle $\alpha$ above $14^\circ$ with a flat plate, even though airspeed $v$ remained constant?
                                </p>
                                <div className="p-3 rounded-xl bg-white border border-red-200 text-xs text-red-800 flex items-center justify-between">
                                    <span>
                                        <strong>Alex&apos;s Answer:</strong> &ldquo;Because steeper angle always increases lift, so the tail must have been too heavy.&rdquo;
                                    </span>
                                    <span className="font-bold uppercase ml-2 shrink-0">✗ Misconception</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right 5 Columns: University School Struggle Telemetry + Springboard Trigger */}
                    <div className="lg:col-span-5 bg-[#1D0B10] border border-[#E6C687]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6C687]">
                                    Live ASU Struggle Telemetry
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                                    Where Alex Is Struggling
                                </h3>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5">
                                <Activity size={14} className="animate-pulse" /> Struggle: {struggleScore}%
                            </div>
                        </div>

                        {/* Telemetry Event Feed */}
                        <div className="space-y-2.5">
                            {struggleLog.map((item, i) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-xl bg-black/35 border border-white/10 flex items-start gap-3 text-xs"
                                >
                                    <span className="font-mono text-[#E6C687] font-bold shrink-0">{item.time}</span>
                                    <span className="text-slate-200 leading-snug">{item.event}</span>
                                </div>
                            ))}
                        </div>

                        {/* Socratic AI Narrator Intercept Card */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2E0D16] to-[#1A070B] border border-[#E6C687]/50 space-y-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={activeSchool.sceneBg}
                                    alt={activeSchool.mentorName}
                                    className="w-14 h-14 rounded-2xl object-cover border border-[#E6C687]"
                                />
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#E6C687]">
                                        AI Narrator Intercept · {activeSchool.mentorRole}
                                    </div>
                                    <div className="font-serif text-lg font-bold text-white">
                                        {activeSchool.mentorName}
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-200 italic font-serif leading-relaxed">
                                &ldquo;Memorizing $C_L(\alpha)$ from a whiteboard won&apos;t show you why a wing stalls. Bring your 4-person Discovery Squad into Episode 3 of our campaign—our 1901 Dayton wind tunnel and Kitty Hawk launch rail—so you can experience it first and then ace your ASU assignment properly.&rdquo;
                            </p>

                            <button
                                onClick={() => setStage('immersive-lab')}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] hover:from-[#F7E0AD] hover:to-[#D4AF6A] text-[#23090D] font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all"
                            >
                                <Sparkles size={18} />
                                Launch Episode 3: 1903 Kitty Hawk Lab (+450 XP)
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                ACT 2: IMMERSIVE 1ST-PERSON HISTORICAL LAB & 60FPS PHYSICS SIM
               ═══════════════════════════════════════════════════════════════ */}
            {stage === 'immersive-lab' && (
                <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 grid lg:grid-cols-12 gap-6 items-start">
                    {/* Left 8 Columns: Interactive 60fps Wind Tunnel & Kitty Hawk Flight Stage + RPG Squad Mastery Powers */}
                    <div className="lg:col-span-8 space-y-5">
                        <div className="bg-[#18080C] border border-[#E6C687]/35 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Stage Top Switcher */}
                            <div className="px-5 py-3.5 bg-[#220A10] border-b border-[#E6C687]/25 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-[#E6C687]/15 border border-[#E6C687]/40 text-[#E6C687] text-xs font-bold">
                                        Episode 3 · Iteration #{iterationCount}
                                    </span>
                                    <span className="font-serif font-bold text-base text-white">
                                        {simMode === 'wind-tunnel'
                                            ? '1901 Dayton Wind Tunnel — Tune Camber & Angle of Attack'
                                            : 'December 17, 1903 Kitty Hawk Dunes — Real Consequence & Iteration'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSimMode('wind-tunnel')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            simMode === 'wind-tunnel'
                                                ? 'bg-[#8B2332] text-white border border-[#E6C687]'
                                                : 'bg-black/40 text-slate-300 border border-white/10'
                                        }`}
                                    >
                                        1. Wind Tunnel Workbench
                                    </button>
                                    <button
                                        onClick={handleLaunchFlight}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            simMode === 'flight-test'
                                                ? 'bg-emerald-600 text-white border border-emerald-300'
                                                : 'bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D]'
                                        }`}
                                    >
                                        <Play size={12} className="fill-current" />
                                        2. Launch 1903 Flyer at Kitty Hawk
                                    </button>
                                </div>
                            </div>

                            {/* Live 60fps Physics Canvas */}
                            <div className="relative bg-black">
                                <canvas
                                    ref={canvasRef}
                                    width={820}
                                    height={400}
                                    className="w-full h-auto block"
                                />
                            </div>

                            {/* Interactive Engineering Sliders (Student Decision Node) */}
                            <div className="p-5 bg-[#14070A] border-t border-[#E6C687]/20 grid sm:grid-cols-3 gap-4">
                                {/* Slider 1: Wing Camber Ratio */}
                                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                        <span className="text-[#E6C687]">1. Wing Camber Ratio</span>
                                        <span className="font-mono text-white">1:{camberRatio} {camberRatio >= 18 && camberRatio <= 22 ? '✓ Optimal' : ''}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="30"
                                        step="1"
                                        value={camberRatio}
                                        onChange={(e) => {
                                            setCamberRatio(parseInt(e.target.value, 10));
                                            setSimMode('wind-tunnel');
                                        }}
                                        className="w-full accent-[#E6C687] cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>1:12 (Deep Drag)</span>
                                        <span className="text-[#E6C687]">1:20 Wright</span>
                                        <span>1:30 (Flat)</span>
                                    </div>
                                </div>

                                {/* Slider 2: Angle of Attack */}
                                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                        <span className="text-[#E6C687]">2. Angle of Attack (α)</span>
                                        <span className={`font-mono ${aero.isStalled ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {aoaDeg.toFixed(1)}° {aero.isStalled ? '(STALL!)' : '✓ Attached'}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="18"
                                        step="0.5"
                                        value={aoaDeg}
                                        onChange={(e) => {
                                            setAoaDeg(parseFloat(e.target.value));
                                            setSimMode('wind-tunnel');
                                        }}
                                        className="w-full accent-[#E6C687] cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                        <span>0° (Low Lift)</span>
                                        <span className="text-emerald-400">7.5° Sweet Spot</span>
                                        <span className="text-red-400">15°+ Stall</span>
                                    </div>
                                </div>

                                {/* Quick Action Buttons */}
                                <div className="flex flex-col justify-between gap-2">
                                    <button
                                        onClick={handleApplyWrightPreset}
                                        className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-[#E6C687]/40 text-xs font-bold text-[#E6C687] flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <Sliders size={13} /> Auto-Tune 1903 Wright Specs
                                    </button>
                                    <button
                                        onClick={handleLaunchFlight}
                                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D] text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all"
                                    >
                                        <Play size={13} className="fill-current" /> Test Flight Over Kitty Hawk
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─── CO-OP DISCOVERY SQUAD & MASTERY POWERS DECK ─── */}
                        <div className="bg-[#1B080D] border border-[#E6C687]/35 rounded-3xl p-5 shadow-xl space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-[#E6C687]" />
                                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6C687]">
                                        Co-Op Discovery Squad · Activate Class Mastery Powers in the Wind Tunnel
                                    </span>
                                </div>
                                <span className="text-[11px] text-emerald-300 font-semibold">
                                    {squadBannerMsg}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {SQUAD_ROLES.map((role, idx) => {
                                    const isActive =
                                        (idx === 0 && activePowers.isobarVision) ||
                                        (idx === 1 && activePowers.stallHorizon) ||
                                        (idx === 3 && activePowers.socraticBridge);
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => handleTriggerSquadPower(idx)}
                                            className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                                                isActive
                                                    ? 'bg-[#8B2332]/70 border-[#E6C687] shadow-lg'
                                                    : 'bg-black/40 hover:bg-white/10 border-white/15'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6C687]">
                                                        LVL {role.level} · {role.student}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] font-mono font-bold text-amber-300">
                                                        -{role.powerCost} AP
                                                    </span>
                                                </div>
                                                <div className="font-serif font-bold text-sm text-white leading-snug">
                                                    {role.roleTitle}
                                                </div>
                                                <div className="text-xs font-bold text-[#E6C687] mt-1">
                                                    ⚡ {role.powerName}
                                                </div>
                                                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                                                    {role.powerDesc}
                                                </p>
                                            </div>
                                            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold">
                                                <span className="text-slate-300">{role.guild}</span>
                                                <span className="text-[#E6C687]">
                                                    {isActive ? 'ACTIVE ✓' : 'Trigger Power →'}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right 4 Columns: Live Socratic Mentor + Telemetry Readout */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Wilbur Wright Live Socratic Guidance Card */}
                        <div className="bg-[#1D0B10] border border-[#E6C687]/40 rounded-3xl p-5 shadow-xl space-y-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/visuals/kitty_hawk_2_decision.jpg"
                                    alt="Wilbur Wright in Wind Tunnel Lab"
                                    className="w-14 h-14 rounded-2xl object-cover border border-[#E6C687]"
                                />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6C687]">
                                        Socratic AI Narrator · Live Coaching
                                    </span>
                                    <h4 className="font-serif text-lg font-bold text-white">Wilbur Wright</h4>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
                                &ldquo;{socraticMessage}&rdquo;
                            </div>

                            {/* Live Physics Gauges */}
                            <div className="grid grid-cols-2 gap-2.5 text-center">
                                <div className="p-3 rounded-xl bg-black/35 border border-white/10">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Net Lift vs Weight</div>
                                    <div className={`text-lg font-bold mt-0.5 ${aero.canFly ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {aero.liftLbs} / {aero.weightLbs} lbs
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-black/35 border border-white/10">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Lift-to-Drag (L/D)</div>
                                    <div className="text-lg font-bold text-[#E6C687] mt-0.5">{aero.ldRatio} : 1</div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStage('concept-mastery')}
                                className="w-full py-3.5 px-5 rounded-2xl bg-[#8B2332] hover:bg-[#A3293B] border border-[#E6C687]/50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                            >
                                Step 4: Pass ASU Assignment &amp; Exam Properly
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                ACT 3: ACCEPTABLE SOCRATIC ASU ASSIGNMENT & EXAM COMPANION
               ═══════════════════════════════════════════════════════════════ */}
            {stage === 'concept-mastery' && (
                <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left 7 Cols: Official ASU Online Homework & Exam Window + Acceptable Socratic Bridge */}
                    <div className="lg:col-span-7 bg-[#1C0A0F] border border-[#E6C687]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687]">
                                    Step 4 · Academic-Integrity Socratic Exam &amp; HW Companion
                                </span>
                                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                                    Helping Kids Pass ASU Online Properly.
                                </h3>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                                <Shield size={13} /> Zero Direct Answers · Socratic Bridge
                            </span>
                        </div>

                        {/* Problem Switcher */}
                        <div className="flex flex-wrap gap-2">
                            {ASU_EXAM_COMPANION_PROBLEMS.map((prob, idx) => (
                                <button
                                    key={prob.id}
                                    onClick={() => {
                                        setActiveExamProbIdx(idx);
                                        setSelectedAnswer(null);
                                    }}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                                        activeExamProbIdx === idx
                                            ? 'bg-[#8B2332] text-white border-[#E6C687]'
                                            : 'bg-black/40 text-slate-300 border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <span>{idx === 0 ? 'ASU Homework #4 Q4' : 'ASU Module 4 Exam Prep Q7'}</span>
                                    {solvedProblems[prob.id] && <CheckCircle2 size={13} className="text-emerald-400" />}
                                </button>
                            ))}
                        </div>

                        {/* The Socratic Memory Bridge (Translates University Notation -> Lived 1903 Sim) */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2D0E17] to-[#1A080C] border border-[#E6C687]/50 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6C687]">
                                    🧭 Socratic Memory Bridge (Connects Your 1903 Flight to University Notation)
                                </span>
                                <span className="text-[10px] text-emerald-300 font-semibold">Acceptable Academic Support ✓</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">
                                <strong>Kid-Friendly Notation Translation:</strong> {ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx].kidTranslation}
                            </p>
                            <p className="text-xs text-[#FDE68A] font-serif italic leading-relaxed">
                                <strong>Wilbur’s Socratic Prompt:</strong> &ldquo;{ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx].socraticHint}&rdquo;
                            </p>
                        </div>

                        {/* Official ASU Online Question Box */}
                        <div className="p-5 rounded-2xl bg-white text-slate-900 border-2 border-[#8C1D40]/30 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between text-xs font-bold text-[#8C1D40]">
                                <span>{ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx].asuHeader}</span>
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-[#8C1D40] text-[10px]">
                                    Student Solves Independently
                                </span>
                            </div>
                            <p className="text-sm text-slate-900 font-semibold leading-relaxed">
                                {ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx].formalQuestion}
                            </p>
                            <div className="space-y-2.5 pt-2">
                                {ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx].options.map((opt, idx) => {
                                    const isCorrect = idx === ASU_EXAM_COMPANION_PROBLEMS[activeExamProbIdx].correctIdx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleCompleteConceptCheck(idx)}
                                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                                                selectedAnswer === idx
                                                    ? isCorrect
                                                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                                                        : 'bg-red-50 border-red-500 text-red-900'
                                                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {asuSynced && (
                            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
                                <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                                <div>
                                    <strong>ASU PHY 121 Assignment &amp; Exam Check Passed Properly!</strong> Alex solved the formal university problem using their lived 1903 wind-tunnel intuition, leveled up to <strong>LVL 15 (3,290 XP)</strong>, and synced 88% Mastery back to ASU Online.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right 5 Cols: The Native University School Progress Card (68% -> 88%) + ASU Sync */}
                    <div className="lg:col-span-5 bg-[#161416] border border-[#C9B47C]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <img src="/images/unischool-logo.png" alt="University School" className="w-9 h-9 rounded-lg" />
                                <div>
                                    <div className="font-serif text-lg font-bold text-white">University School</div>
                                    <div className="text-xs text-[#E6C687]">{activeSchool.asuCourse}</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                                {asuSynced ? 'ASU GRADEBOOK: 96% (A) ✓' : 'LIVE TELEMETRY'}
                            </span>
                        </div>

                        {/* Cream Progress Box (Matches Slide 9 on Landing Page) */}
                        <div className="bg-[#EFE9DF] text-[#222222] rounded-2xl p-5 sm:p-6">
                            <div className="grid sm:grid-cols-12 gap-6 items-center">
                                <div className="sm:col-span-5 flex flex-col items-center justify-center">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="48" fill="none" stroke="#D8CDBB" strokeWidth="10" />
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="48"
                                                fill="none"
                                                stroke="#0F2537"
                                                strokeWidth="10"
                                                strokeDasharray="301.6"
                                                strokeDashoffset={301.6 * (1 - progressPct / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-3xl font-bold text-[#141414]">{progressPct}%</span>
                                            <span className="text-[11px] font-medium text-slate-600">Overall Mastery</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-7 space-y-2.5 text-sm">
                                    {[
                                        { label: 'Syllabus Episodes Lived', val: asuSynced ? '3 / 5 Complete' : '2 / 5 Complete' },
                                        { label: 'ASU Assignments Passed', val: asuSynced ? '4 / 4 (96% A)' : '3 / 4' },
                                        { label: 'RPG Guild Level & XP', val: `LVL ${studentLevel} (${studentXp.toLocaleString()} XP)` },
                                        { label: 'ASU Struggle Points Cleared', val: asuSynced ? '1 / 1 ✓' : 'Pending' },
                                        { label: 'Transfer Credit Track', val: activeSchool.credits },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between pb-2 border-b border-black/10 last:border-b-0 last:pb-0">
                                            <span className="font-medium text-[#222222] text-xs">{row.label}</span>
                                            <span className="font-bold text-[#141414] text-xs">{row.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <button
                                onClick={() => setStage('skill-tree')}
                                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#E6C687]/40 text-xs font-bold text-[#E6C687]"
                            >
                                View Accredited RPG Skill Tree &rarr;
                            </button>
                            <button
                                onClick={() => setStage('syllabus-campaign')}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D] font-bold text-xs shadow-lg"
                            >
                                Next Syllabus Episode &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                ACT 4: ACCREDITED UNIVERSITY SKILL TREE & CO-OP GUILD ROLES
               ═══════════════════════════════════════════════════════════════ */}
            {stage === 'skill-tree' && (
                <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
                    <div className="bg-[#1B080D] border border-[#E6C687]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6C687]">
                                    Accredited RPG Progression · {activeSchool.asuCourse}
                                </span>
                                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                                    Every Skill Tree Node Maps 1-to-1 to Real University Credit.
                                </h3>
                            </div>
                            <button
                                onClick={() => setStage('immersive-lab')}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#F1D59A] to-[#C8A15A] text-[#23090D] font-bold text-xs sm:text-sm shadow-lg"
                            >
                                &larr; Return to 1903 Kitty Hawk Sim
                            </button>
                        </div>

                        {/* 5-Node Branching University Skill Tree */}
                        <div className="grid md:grid-cols-5 gap-4">
                            {UNIVERSITY_SKILL_TREE.map((node, i) => {
                                const isNodeMastered = node.status === 'mastered' || (node.id === 'node-3' && asuSynced);
                                const isNodeActive = node.id === 'node-3' && !asuSynced;
                                const isNodeUnlockedNext = node.id === 'node-4' && asuSynced;

                                return (
                                    <div
                                        key={node.id}
                                        className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                                            isNodeMastered
                                                ? 'bg-emerald-950/40 border-emerald-400/60'
                                                : isNodeActive || isNodeUnlockedNext
                                                ? 'bg-[#8B2332]/50 border-[#E6C687] shadow-xl'
                                                : 'bg-black/40 border-white/10 opacity-75'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono font-bold text-[#E6C687]">
                                                    {node.code}
                                                </span>
                                                <span className="text-[11px] font-bold text-amber-300">+{node.xp} XP</span>
                                            </div>
                                            <div className="font-serif font-bold text-base text-white leading-snug mb-2">
                                                {node.title}
                                            </div>
                                            <div className="text-[11px] text-[#E6C687] font-semibold mb-1.5">
                                                🏛 {node.historicalSim}
                                            </div>
                                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                                {node.asuCompetency}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                                            {isNodeMastered ? (
                                                <span className="text-emerald-300 flex items-center gap-1">
                                                    <CheckCircle2 size={14} /> Mastered ✓
                                                </span>
                                            ) : isNodeActive ? (
                                                <button
                                                    onClick={() => setStage('immersive-lab')}
                                                    className="text-[#E6C687] underline"
                                                >
                                                    Active Quest → Launch Sim
                                                </button>
                                            ) : isNodeUnlockedNext ? (
                                                <span className="text-amber-300 flex items-center gap-1">
                                                    <Unlock size={14} /> Unlocked! Ready
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 flex items-center gap-1">
                                                    <Lock size={13} /> Prerequisite Locked
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ASULectureTransformer;
