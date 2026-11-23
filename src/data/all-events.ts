export interface DetailedEvent {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string[];
  highlights?: string[];
  prerequisites?: string[];
  date: string;
  displayDate: string;
  month?: string;
  day?: string;
  time?: string;
  location: string;
  venue?: string;
  seats?: string;
  rsvpUrl?: string;
  recapUrl?: string;
  status: "upcoming" | "past";
  tag?: string;
  registrationType?: string;
  bannerStyle?: "featured" | "design" | "challenge" | "genai" | "techfest" | "techsprint";
}

export const DIRECT_EVENT_RSVP_URL = "https://gdg.community.dev/e/mc349m/";
export const OFFICIAL_BPPIMT_CHAPTER_URL =
  "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/";

export const ALL_EVENTS: DetailedEvent[] = [
  // --- UPCOMING EVENT ---
  {
    id: "gdg-bppimt-mc349m",
    title: "GDG On Campus BPPIMT — Featured Event & Workshop",
    shortDescription:
      "A community is built by the people in it. Join Google Developer Groups on Campus BPPIMT at C Block for our upcoming community session.",
    fullDescription: [
      "Welcome to Google Developer Groups on Campus BPPIMT's upcoming featured technical workshop! This interactive on-campus session is designed to connect students with modern developer ecosystems, industry-standard practices, and hands-on Google technologies.",
      "Whether you're starting your journey in software development, AI, cloud engineering, or UI/UX design, this session will give you the roadmap, mentorship, and peer collaboration needed to kickstart your tech journey.",
      "Get direct exposure to upcoming hackathons, Google Solution Challenge, Cloud Study Jams, and exclusive swag & certification opportunities."
    ],
    highlights: [
      "Introduction to Google Developer Groups on Campus initiatives and upcoming calendar",
      "Overview of Solution Challenge 2026 and community-driven open-source projects",
      "Interactive Q&A and networking with core team organizers, tech leads, and mentors",
      "Direct guidance on setting up developer tools, Google Cloud Arcade, and Gemini APIs",
      "Exciting announcements regarding upcoming hackathons, team recruitments, and perks"
    ],
    prerequisites: [
      "No prior coding experience required; open to all college departments and years",
      "Bring your laptop or notebook to jot down key takeaways and resource links",
      "Active Google account and enthusiasm to learn and collaborate with fellow builders"
    ],
    date: "2026-11-25",
    displayDate: "Nov 25, 2026",
    month: "NOV",
    day: "25",
    time: "4:00 – 5:00 PM (IST)",
    location: "C BLOCK, BPPIMT Campus",
    venue: "C Block Seminar Hall, B.P. Poddar Institute of Management and Technology, Kolkata",
    seats: "Open Registration",
    rsvpUrl: DIRECT_EVENT_RSVP_URL,
    status: "upcoming",
    tag: "Featured Event & Workshop",
    registrationType: "Free registration",
    bannerStyle: "featured"
  },

  // --- PAST EVENTS (All 14 Completed Events) ---
  {
    id: "pixel-to-perfection-day-3",
    title: "Pixel to Perfection: Mastering Design with Adobe Photoshop (Day 3)",
    shortDescription:
      "Hands-on UI/UX and graphic design workshop series focused on mastering Adobe Photoshop tools, composition, and visual storytelling.",
    fullDescription: [
      "Day 3 of the 'Pixel to Perfection' series brought students deep into real-world creative workflows. Participants mastered color theory, photo manipulation techniques, complex selection masking, and digital asset preparation for web and product UI.",
      "Attendees walked away with hands-on portfolio-ready projects and a strong grasp of design hierarchy required for modern digital products."
    ],
    highlights: [
      "Advanced layer masking and non-destructive adjustments",
      "Visual balance, typography pairings, and micro-composition",
      "Exporting assets optimized for modern web and mobile apps",
      "Live critique session and showcase of student designs"
    ],
    date: "2026-05-30",
    displayDate: "May 30, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Main Computer Lab, BPPIMT Kolkata",
    registrationType: "External registration",
    tag: "Design Workshop • Day 3",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-pixel-to-perfection-mastering-design-with-adobe-photoshop-2026-05-30/"
  },
  {
    id: "pixel-to-perfection-day-2",
    title: "Pixel to Perfection: Mastering Design with Adobe Photoshop (Day 2)",
    shortDescription:
      "Intermediate Adobe Photoshop design session covering layer blending, typography hierarchy, and digital poster creation.",
    fullDescription: [
      "The second installment of the 'Pixel to Perfection' workshop pushed students past basic toolbars into intermediate creative techniques. Attendees practiced blending modes, pen tool bezier curves, and custom brush dynamics.",
      "The practical session focused on designing promotional event posters and digital marketing collateral from scratch."
    ],
    highlights: [
      "Vector shape building and precise Pen Tool mastery",
      "Typography styling, kerning, and hierarchy rules",
      "Designing impactful poster layouts for campus festivals",
      "Color grading workflows and background blending"
    ],
    date: "2026-05-23",
    displayDate: "May 23, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Main Computer Lab, BPPIMT Kolkata",
    registrationType: "External registration",
    tag: "Design Workshop • Day 2",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-pixel-to-perfection-mastering-design-with-adobe-photoshop-2026-05-23/"
  },
  {
    id: "pixel-to-perfection-day-1",
    title: "Pixel to Perfection: Mastering Design with Adobe Photoshop (Day 1)",
    shortDescription:
      "Kickoff session of Pixel to Perfection introducing students to creative workflows and visual design fundamentals with Adobe Photoshop.",
    fullDescription: [
      "The inaugural session of 'Pixel to Perfection' welcomed aspiring designers to the fundamentals of digital art and UI graphics. Participants were introduced to the Photoshop interface, canvas setups, resolution guidelines, and basic layer mechanics.",
      "Students completed their first interactive graphic assignment by the end of the 2-hour session."
    ],
    highlights: [
      "Workspace setup, canvas sizing, and color profiles (RGB vs CMYK)",
      "Layer organization, grouping, and smart objects",
      "Essential selection tools and basic retouching",
      "Introduction to design principles for digital creators"
    ],
    date: "2026-05-16",
    displayDate: "May 16, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Main Computer Lab, BPPIMT Kolkata",
    registrationType: "External registration",
    tag: "Design Workshop • Day 1",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-pixel-to-perfection-mastering-design-with-adobe-photoshop-2026-05-16/"
  },
  {
    id: "techsprint-wrapup-2026",
    title: "TechSprint Wrapup and Winner Declaration",
    shortDescription:
      "Celebrating top builders, project demos, and official winner announcements for the BPPIMT TechSprint hackathon series.",
    fullDescription: [
      "The grand conclusion to TechSprint 2026! Over 40 student teams competed over an intensive sprint period to build real-world software prototypes addressing community challenges.",
      "This finale featured project presentations, jury evaluations by alumni and faculty, live product demos, and the official distribution of certificates, prizes, and GDG merchandise."
    ],
    highlights: [
      "Pitch sessions from top 8 finalist teams",
      "Feedback from industry judges on codebase scalability and UX",
      "Declaration of Winners, Runner-ups, and Best Innovative Project",
      "Networking dinner and team celebration"
    ],
    date: "2026-01-25",
    displayDate: "Jan 25, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Auditorium, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "TechSprint Finale",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-techsprint-wrapup-and-winner-declaration/"
  },
  {
    id: "techsprint-improvement-day-2026",
    title: "Techsprint Improvement Day: Level Up Your Skills!",
    shortDescription:
      "Mentorship and sprint refinement session helping student teams polish their prototypes, architecture, and pitch decks.",
    fullDescription: [
      "A dedicated mid-hackathon checkpoint where mentors provided 1-on-1 code reviews, architectural advice, and UI refinement tips to registered TechSprint teams.",
      "Students learned how to debug bottlenecks, implement clean API boundaries, and structure effective 3-minute project pitch decks."
    ],
    highlights: [
      "1-on-1 breakout mentoring rooms with domain leads",
      "Git branch troubleshooting and deployment on Firebase/Vercel",
      "Refining project pitch narratives and slide storytelling",
      "Mock presentation trials with constructive feedback"
    ],
    date: "2026-01-11",
    displayDate: "Jan 11, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Seminar Hall & Lab 3, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Mentorship",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-techsprint-improvement-day-level-up-your-skills/"
  },
  {
    id: "techsprint-101-2026",
    title: "TechSprint 101: Introduction to Google Technologies",
    shortDescription:
      "Orientation and developer onboarding session exploring Google Cloud, Firebase, Gemini APIs, and modern full-stack workflows.",
    fullDescription: [
      "The kickoff orientation for TechSprint 2026 introduced participants to essential Google developer platforms, cloud compute, Firebase authentication & databases, and Gemini generative AI endpoints.",
      "Attendees formed cross-disciplinary teams and received official hackathon guidelines, problem statements, and evaluation criteria."
    ],
    highlights: [
      "Overview of Google Cloud console and student cloud credits",
      "Setting up Firebase Firestore, Auth, and Hosting in under 15 minutes",
      "Consuming Google Gemini API for intelligent app features",
      "Team matching and hackathon registration verification"
    ],
    date: "2026-01-05",
    displayDate: "Jan 5, 2026",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Main Auditorium, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "TechSprint 101",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-techsprint-101-introduction-to-google-technologies/"
  },
  {
    id: "google-cloud-study-jams-wrapup-2025",
    title: "Google Cloud Study Jams Wrap Up",
    shortDescription:
      "Closing ceremony and milestone celebration for students completing Google Cloud Arcade and Generative AI labs.",
    fullDescription: [
      "A grand celebratory gathering recognizing all campus builders who successfully completed the Google Cloud Study Jams curriculum.",
      "Top performers who unlocked Cloud Arcade skill badges and Generative AI pathways were awarded official Google Cloud swag kits, tees, bags, and milestone certificates."
    ],
    highlights: [
      "Campus statistics report: 150+ badges completed across departments",
      "Distribution of exclusive Google Cloud certificates and swag bundles",
      "Student talks on key takeaways from hands-on Cloud Shell labs",
      "Roadmap for continuing Google Cloud certification pathways"
    ],
    date: "2025-11-19",
    displayDate: "Nov 19, 2025",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Auditorium, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Cloud Study Jams",
    bannerStyle: "techsprint",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-google-cloud-study-jams-wrap-up/"
  },
  {
    id: "techstorm-2-25",
    title: "Techstorm 2.25",
    shortDescription:
      "Annual TechFest flagship collaboration featuring coding battles, technical challenges, robotics, and creative student competitions.",
    fullDescription: [
      "In collaboration with TechForum Abhiyantran, GDG on Campus BPPIMT co-organized Techstorm 2.25, the college's premier annual technical festival.",
      "The multi-track extravaganza hosted hundreds of participants across competitive algorithmic coding, web hackathons, hardware robotics, and design showcases."
    ],
    highlights: [
      "Multi-college participation with over 500+ attendees",
      "Competitive programming arenas and web development sprints",
      "Keynote addresses from engineering leaders and alumni",
      "Exciting prize pools and campus trophies"
    ],
    date: "2025-05-29",
    displayDate: "May 29, 2025",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "BPPIMT Campus grounds & Auditorium",
    registrationType: "Free registration",
    tag: "Annual TechFest",
    bannerStyle: "techfest",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-techstorm-225/"
  },
  {
    id: "pixel-to-prototype-figma-2025",
    title: "Pixel To Prototype - Workshop on Frontend Design using Figma",
    shortDescription:
      "Live interactive workshop on wireframing, design systems, and clickable prototyping using Figma for frontend developers.",
    fullDescription: [
      " Bridging the gap between UI design and frontend engineering! This hands-on Figma masterclass taught students how to turn concept ideas into high-fidelity clickable prototypes.",
      "Participants learned auto-layout, design tokens, component variants, and how developers translate Figma specs into clean Tailwind CSS code."
    ],
    highlights: [
      "Understanding Auto-Layout, constraints, and responsive frames",
      "Building reusable component libraries and design tokens",
      "Creating interactive prototypes with transitions and smart animate",
      "Dev Mode walkthrough for CSS and asset handoff"
    ],
    date: "2025-02-22",
    displayDate: "Feb 22, 2025",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Lab 2, C Block, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Figma Workshop",
    bannerStyle: "design",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-pixel-to-prototype-workshop-on-frontend-design-using-figma/"
  },
  {
    id: "tech-winter-break-2024",
    title: "Tech Winter Break + B. P. Poddar Institute of Management and Technology",
    shortDescription:
      "Winter developer sprint and Solution Challenge ideation camp empowering students to build impactful community solutions.",
    fullDescription: [
      "An intensive winter camp designed to jumpstart student participation in the annual Google Solution Challenge.",
      "Teams brainstormed ideas aligning with the United Nations 17 Sustainable Development Goals (SDGs), selected their tech stacks, and outlined MVP delivery schedules."
    ],
    highlights: [
      "In-depth breakdown of Google Solution Challenge guidelines and judging rubrics",
      "Ideation workshop on UN Sustainable Development Goals",
      "Tech stack consultation for Flutter, Web, Cloud, and Machine Learning",
      "Team formation and project repository setups"
    ],
    date: "2024-12-30",
    displayDate: "Dec 30, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Seminar Hall, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Solution Challenge",
    bannerStyle: "challenge",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-tech-winter-break-b-p-poddar-institute-of-management-and-technology/"
  },
  {
    id: "build-with-ai-genai-2024",
    title: "Build with AI",
    shortDescription:
      "GenAI Study Jams info session and hands-on lab introducing Gemini models, prompt engineering, and AI application development.",
    fullDescription: [
      "A flagship AI session focusing on the transformative capabilities of Generative AI and Google Gemini.",
      "Participants engaged in interactive notebook sessions exploring zero-shot prompting, few-shot prompting, multimodal inputs, and building simple AI assistants using Python and Google AI Studio."
    ],
    highlights: [
      "Introduction to Large Language Models and Generative AI fundamentals",
      "Hands-on prompt engineering experiments with Google AI Studio",
      "Building a lightweight chatbot using Gemini 1.5 APIs",
      "Understanding multimodal AI: processing text, audio, and images together"
    ],
    date: "2024-10-15",
    displayDate: "Oct 15, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Main Auditorium, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "GenAI Study Jams",
    bannerStyle: "genai",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-build-with-ai/"
  },
  {
    id: "smart-coder-2-24",
    title: "Smart Coder 2.24",
    shortDescription:
      "Inter-college competitive programming and algorithmic problem-solving contest hosted at C Block, BPPIMT Campus.",
    fullDescription: [
      "Smart Coder 2.24 brought together competitive programmers from colleges across Kolkata for an intense algorithmic battle.",
      "Contestants tackled dynamic programming, graph traversal, and mathematical optimization problems under tight time constraints."
    ],
    highlights: [
      "2-hour competitive coding round hosted on a custom evaluation platform",
      "Challenging problem sets designed by alumni competitive coders",
      "Live leaderboard updates and dynamic ranking shifts",
      "Prize distribution for top algorithmic problem solvers"
    ],
    date: "2024-09-21",
    displayDate: "Sep 21, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "C Block Labs, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Coding Competition",
    bannerStyle: "techfest",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-smart-coder-224/"
  },
  {
    id: "juno-2-24",
    title: "Juno 2.24",
    shortDescription:
      "Arduino programming and embedded systems inter-college competition organized in collaboration with TechForum Abhiyantran.",
    fullDescription: [
      "An exciting embedded hardware competition testing circuit design, sensor integration, and Arduino C++ programming skills.",
      "Teams were tasked with building real-time telemetry systems, automated sensor circuits, and IoT devices within a 3-hour build period."
    ],
    highlights: [
      "Hands-on breadboarding, sensor wiring, and hardware debugging",
      "Microcontroller programming with Arduino IDE",
      "Evaluation on code modularity, circuit efficiency, and latency",
      "Showcase of novel IoT solutions built under time pressure"
    ],
    date: "2024-09-20",
    displayDate: "Sep 20, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "Electronics & Hardware Lab, D Block, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Hardware & Arduino",
    bannerStyle: "techfest",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-juno-224/"
  },
  {
    id: "forma-2-24",
    title: "Forma 2.24",
    shortDescription:
      "Hardware model design and engineering showcase competition hosted at D Block, BPPIMT Campus.",
    fullDescription: [
      "A creative engineering competition where student innovators showcased physical prototypes, robotics kits, and working scientific models.",
      "Participants demonstrated real-world feasibility, mechanical design, and societal impact to a panel of expert engineering professors."
    ],
    highlights: [
      "Physical prototype exhibition featuring 25+ student inventions",
      "Live demonstrations of robotics, automated systems, and clean-tech models",
      "Jury reviews on structural integrity, innovation, and cost feasibility",
      "Recognition and cash awards for leading hardware models"
    ],
    date: "2024-09-20",
    displayDate: "Sep 20, 2024",
    location: "GDG on Campus BPPIMT - Kolkata, India",
    venue: "D Block Foyer & Labs, BPPIMT Kolkata",
    registrationType: "Free registration",
    tag: "Hardware Design",
    bannerStyle: "techfest",
    status: "past",
    recapUrl:
      "https://gdg.community.dev/events/details/google-gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india-presents-forma-224/"
  }
];

export function getEventById(id: string): DetailedEvent | undefined {
  return ALL_EVENTS.find((e) => e.id.toLowerCase() === id.toLowerCase());
}

export function getUpcomingEvents(): DetailedEvent[] {
  return ALL_EVENTS.filter((e) => e.status === "upcoming");
}

export function getPastEvents(): DetailedEvent[] {
  return ALL_EVENTS.filter((e) => e.status === "past");
}
