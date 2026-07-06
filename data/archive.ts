export type ArchiveSection =
  | { kind: "text"; body: string }
  | { kind: "list"; heading?: string; items: string[] }
  | { kind: "project"; title: string; subtitle: string; body: string; tags?: string[] }
  | { kind: "person"; name: string; role: string; contact: string; address?: string }
  | { kind: "timeline"; entries: Array<{ year: string; label: string; detail?: string }> }
  | { kind: "stat_row"; stats: Array<{ label: string; value: string }> }
  | { kind: "contact_block"; email: string; phone: string; location: string }
  | { kind: "image"; src: string; alt: string; caption?: string; filename?: string; aspect?: "portrait" | "landscape" | "square"; align?: "left" | "right" | "center"; size?: "xs" | "sm" | "md" | "lg" }
  | { kind: "image_gallery"; heading?: string; size?: "sm" | "md" | "lg"; columns?: 2 | 3 | 4; images: Array<{ src: string; alt: string; filename?: string; caption?: string; aspect?: "portrait" | "landscape" | "square" }> };

export type ArchiveFolderSlug =
  | "wiring"
  | "builds"
  | "ai_agents"
  | "finance"
  | "academics"
  | "baseball"
  | "faith_roots"
  | "hobbies"
  | "references"
  | "contact_info";

export interface ArchiveFolder {
  slug: ArchiveFolderSlug;
  displayName: string;
  description: string;
  section: "archive" | "links";
}

export interface ArchiveFile {
  slug: string;
  filename: string;
  title: string;
  description: string;
  folder: ArchiveFolderSlug;
  sections: ArchiveSection[];
  suggestedPrompts?: string[];
}

export interface ArchiveTree {
  folders: readonly ArchiveFolder[];
  files: readonly ArchiveFile[];
}

const FOLDERS: readonly ArchiveFolder[] = [
  {
    slug: "wiring",
    displayName: "/how_i_think",
    description: "Sets the lens — how I see the world and what I optimize for.",
    section: "archive",
  },
  {
    slug: "builds",
    displayName: "/builds",
    description: "What I've shipped — products, systems, and projects.",
    section: "archive",
  },
  {
    slug: "ai_agents",
    displayName: "/ai_agents",
    description: "Agent methodology and AI-native systems I've built.",
    section: "archive",
  },
  {
    slug: "finance",
    displayName: "/finance",
    description: "Thesis work — markets, investments, and capital thinking.",
    section: "archive",
  },
  {
    slug: "academics",
    displayName: "/academics",
    description: "Credentials and formal training.",
    section: "archive",
  },
  {
    slug: "baseball",
    displayName: "/baseball",
    description: "The game that shaped how I think about performance and data.",
    section: "archive",
  },
  {
    slug: "faith_roots",
    displayName: "/faith_roots",
    description: "The foundation — faith, family, and where I come from.",
    section: "archive",
  },
  {
    slug: "hobbies",
    displayName: "/hobbies",
    description: "What I do when I'm not building.",
    section: "archive",
  },
  {
    slug: "references",
    displayName: "/references",
    description: "People who can speak to my work and character.",
    section: "links",
  },
  {
    slug: "contact_info",
    displayName: "Contact",
    description: "Encrypted operator channel — direct line to Samuel.",
    section: "links",
  },
];

const FILES: readonly ArchiveFile[] = [
  {
    slug: "how-i-think-overview",
    filename: "how_i_think_overview",
    title: "How I Think Overview",
    description: "How I see the world — the mental models and values that drive everything else.",
    folder: "wiring",
    sections: [
      {
        kind: "image",
        src: "/photos/portrait-headshot.webp",
        alt: "Samuel Schoettker — portrait headshot",
        filename: "operator_portrait.png",
        aspect: "portrait",
        align: "right",
        size: "xs",
      },
      {
        kind: "text",
        body:
          "I operate on conviction. I need to understand the why before I can work at full speed — not because I need permission, but because I need the logic to hold. Once it does, I move fast and I don't stop to second-guess. My highest leverage is in vision, decisions, and being the person in front of customers.",
      },
      {
        kind: "text",
        body:
          "I'm most effective partnered with strong builders and strong distribution people. My contribution is figuring out what to build and why, setting direction, and keeping things moving.",
      },
      {
        kind: "list",
        heading: "Default operating principles",
        items: [
          "Speed and clarity over completeness — a decisive 80% beats an endless 100%",
          "One thing at a time, all-in — I don't spread attention, I concentrate it",
          "Long-term thinking, short-term action — each move is a step in a longer arc",
          "Logical before anything else — I need the causal chain before I commit",
          "Clear about where I add the most value — and where I lean on others",
        ],
      },
      {
        kind: "list",
        heading: "What you get consistently",
        items: [
          "Someone who moves fast without waiting for perfect information",
          "Clear communication — I write well and I say what I mean",
          "High standards that don't slow things down",
          "A person who finishes what they start",
        ],
      },
      {
        kind: "list",
        heading: "My weakness — since every interview asks 😭🙏",
        items: [
          "I'm more right-brained than the finance degree lets on. The problems that light me up are the ones nobody's solved yet — nothing figured out, shape of the answer unclear.",
          "I want to be at the start of something, always. New problem, new unknown, next thing.",
          "What I don't enjoy: everything after building. Grinding for users, advertising, the slow unglamorous work of getting people to actually use it.",
          "I'll build the thing. Someone else can sell it.",
        ],
      },
    ],
    suggestedPrompts: [
      "What are Samuel's core operating principles?",
      "How does he think about his strengths and weaknesses?",
      "What does it look like to work with Samuel?",
    ],
  },
  {
    slug: "builds-overview",
    filename: "builds_overview",
    title: "Builds Overview",
    description: "Products and systems I've shipped — what I built, how, and what it did.",
    folder: "builds",
    sections: [
      {
        kind: "text",
        body:
          "I keep a running list of ideas — currently sitting at over 170 distinct concepts for things that don't exist yet but should. Some are software. Some are physical products. Some are much bigger. I go through them and ask what I can actually execute on right now, weighting heavily toward things with a low barrier to start. That's why I'm spending most of my time in software, apps, and agents — it's cheap to build, fast to iterate, and I can do it without a co-founder or a factory. The builds below are me working down the list.",
      },
      {
        kind: "project",
        title: "SideQuestr",
        subtitle: "iOS app — March 2026–present",
        body:
          "Map-first social coordination. The core problem: deciding what to do and getting people there. The group decision is the unit of the app — GPS-verified visits prove actual attendance. Built with a 7-agent Claude Code team. ~940 lines of Swift per day, ~50-person beta cohort forming.",
        tags: ["Swift", "SwiftUI", "Supabase", "Mapbox", "Claude Code", "iOS"],
      },
      {
        kind: "project",
        title: "TortBot",
        subtitle: "AI agent — 2025–present",
        body:
          "An AI agent that builds LLM-citable online presence for small law firms. It scouts the news daily, pitches relevant stories to the attorney for approval, then writes and publishes long-form articles plus social teasers — optimized for Answer Engine Optimization. The goal: when someone asks an AI assistant for a local lawyer recommendation, TortBot's clients surface in the answer.",
        tags: ["AI Agents", "AEO", "Content Automation", "Python"],
      },
      {
        kind: "project",
        title: "Saulene",
        subtitle: "Open-source Claude Code plugin — 2025–present",
        body:
          "A Claude Code plugin that gives AI agents a slowly-evolving personality. A deterministic engine simulates how an agent's character develops over time — updating through interactions, environment, and time. Built as a monorepo with modules for simulation, expression rendering, perception, and persistent storage. Open-source.",
        tags: ["Claude Code", "AI Agents", "TypeScript", "Open Source"],
      },
      {
        kind: "project",
        title: "Auto Attend",
        subtitle: "Mobile app — 2025–present",
        body:
          "A mobile app that automatically marks college students present by detecting physical classroom presence — GPS geofence plus Bluetooth beacon proximity, with a one-tap manual fallback. Anti-cheat stack prevents spoofing. Built to sell to institutions, so the product doubles as a sales-evidence factory: real usage data in every pitch.",
        tags: ["iOS", "Android", "GPS", "Bluetooth", "EdTech"],
      },
      {
        kind: "project",
        title: "Trading Agent",
        subtitle: "Autonomous AI agent — in development",
        body:
          "An autonomous trading agent that researches markets, generates signals, and executes positions on a defined strategy. Built as a long-running orchestrated system with separate research, decision, and execution roles.",
        tags: ["AI Agents", "Trading", "Python", "Autonomous Systems"],
      },
      {
        kind: "project",
        title: "Samuel Operating System",
        subtitle: "Personal website — 2026–present",
        body:
          "The site you're on right now. A personal website built as a fake operating system — terminal aesthetic, archive folders for every part of my life, and a chat panel that lets you query the archive directly. The UI is the concept: a system you can actually talk to instead of scroll through. Built with Next.js 16, React 19, TypeScript strict, Tailwind 4, and the Anthropic API.",
        tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "Anthropic API"],
      },
      {
        kind: "project",
        title: "E-Commerce Humidifier Resale",
        subtitle: "Amazon FBA — 2022, age 16",
        body:
          "Contracted a Chinese manufacturer, negotiated pricing, shipped 500+ units to Amazon FBA. Hired a product photographer, built the listings. $8,000 revenue, small net loss after ad spend. The real outcome: an early and expensive lesson in what happens when you enter a commodity market with no wedge.",
        tags: ["Amazon FBA", "Manufacturing", "E-Commerce", "Paid Acquisition"],
      },
      {
        kind: "project",
        title: "Agent Team Template",
        subtitle: "Multi-agent scaffold — 2025–present",
        body:
          "A reusable multi-agent orchestrator for building apps and websites. Clone once per project: an orchestrator routes work to specialist agents (frontend, backend, maps, security, QA, product), each with its own playbook and hard context budget. Powers SideQuestr's 7-agent team and is the template I drop into every new build.",
        tags: ["Claude Code", "Multi-Agent", "Orchestration", "AI Agents"],
      },
      {
        kind: "image_gallery",
        heading: "SideQuestr — live screens",
        columns: 3,
        images: [
          { src: "/photos/build-sidequestr-map.webp", alt: "SideQuestr map view with spots", filename: "sidequestr_map.png", caption: "Map view", aspect: "portrait" },
          { src: "/photos/build-sidequestr-friends.webp", alt: "SideQuestr crew & friend activity", filename: "sidequestr_crew.png", caption: "Crew", aspect: "portrait" },
          { src: "/photos/build-sidequestr-icon.webp", alt: "SideQuestr app icon", filename: "sidequestr_icon.png", caption: "Icon", aspect: "square" },
        ],
      },
    ],
    suggestedPrompts: [
      "Walk me through Samuel's most interesting build.",
      "What is SideQuestr?",
      "What has Samuel shipped and what did he learn from each?",
    ],
  },
  {
    slug: "ai-agents-overview",
    filename: "ai_agents_overview",
    title: "AI Agents Overview",
    description: "Agent methodology — how I design, scope, and run AI-native systems.",
    folder: "ai_agents",
    sections: [
      {
        kind: "text",
        body:
          "Agents aren't a side tool — they're the operating layer everything else runs on. This website's chatbot, a law firm's content pipeline, my trading agent, and the system that manages all of them were all built by agent teams, not by me typing every line. My judgment and taste stay mine. The agents do the reps.",
      },
      {
        kind: "text",
        body:
          "My own daily setup is three tiers deep. Kai is the top-level session — it routes me into whichever project I'm working on. Each project spins up its own orchestrator, which spawns feature-worker agents into isolated git worktrees, each bound to a MISSION.md that defines exactly what it's allowed to touch. When branches land, a dedicated merge agent reconciles them by reading what each branch was actually trying to do, not just diffing lines. Nothing bleeds across scope because the boundary is the worktree itself.",
      },
      {
        kind: "text",
        body:
          "The part most agent setups get wrong is memory. Mine doesn't forget between sessions — I built SSB (Samuel's Second Brain), a Supabase + pgvector database with local embeddings that holds every idea, project, decision, and person I've logged. Any agent I run can query it instead of re-reading a pile of files, so a new session picks up where the last one left off instead of starting cold.",
      },
      {
        kind: "text",
        body: "To give a sense of output — here's SideQuestr's numbers after 32 days of agent-assisted development:",
      },
      {
        kind: "stat_row",
        stats: [
          { label: "Commits (32 days)", value: "80" },
          { label: "Swift files", value: "118" },
          { label: "Lines of Swift", value: "~30,000" },
          { label: "Views", value: "55" },
          { label: "Services", value: "33" },
          { label: "Models", value: "17" },
          { label: "Lines/day", value: "~940" },
          { label: "Agent sessions", value: "150+" },
        ],
      },
      {
        kind: "text",
        body:
          "Speed doesn't mean sloppy. A senior developer who reviewed the codebase confirmed it — genuinely well-structured, logical, nothing close to the spaghetti mess fast agent output usually turns into. And every project ships with its own test suite, hundreds of tests deep, so I know the second something regresses instead of hearing about it from a user.",
      },
      {
        kind: "list",
        heading: "Where agents are doing real work for me right now",
        items: [
          "TortBot — an AI agent I built end-to-end for a law firm: it scouts news daily, pitches a story for approval, then writes, formats, and publishes the piece plus social teasers itself. Full pipeline, zero manual steps once it's approved. AEO, not SEO — the goal is showing up when someone asks an AI for a lawyer recommendation.",
          "Swing trading agent — trades a defined universe of equities. I set the intent and risk tolerance; it researches, signals, and manages the position without collapsing everything into a fixed stop-loss and walking away.",
          "SideQuestr — the map-first social coordination app all this machinery actually builds. ~50-person beta forming, shipped at roughly 940 lines of Swift a day.",
          "Kai — the system managing all of the above, plus my calendar, contacts, and a daily brief that lands on my phone before I'm awake.",
        ],
      },
      {
        kind: "text",
        body:
          "Most people are still figuring out how to prompt one model well. I'm past that — I've got multiple agents running in parallel, each in its own worktree, merged back by something that actually reads intent instead of just diffing lines. That's the actual game. I build with agents, and I'll keep building with them — getting better at it as I go.",
      },
    ],
    suggestedPrompts: [
      "How does Samuel use AI agents in his work?",
      "What's the system behind Kai?",
      "What agents are running for him right now?",
    ],
  },
  {
    slug: "finance-overview",
    filename: "finance_overview",
    title: "Finance Overview",
    description: "Why finance fits my brain — and where I think the next decade is headed.",
    folder: "finance",
    sections: [
      {
        kind: "text",
        body:
          "My major is finance. I picked it because I naturally think in risk-to-reward — every decision is a weighted bet, and I'm comfortable sizing those bets. That instinct is what finance rewards, and it's why the field clicks for me when others find it abstract.",
      },
      {
        kind: "text",
        body:
          "I'm good at taking a lot of information in, analyzing it, and reasoning about where things go next. That's the part I enjoy most: pattern-matching the present against the future and acting on what I see before everyone else does.",
      },
      {
        kind: "text",
        body:
          "Because of that, I can't help but see blockchain as a genuinely revolutionary financial technology. Specifically, I believe stablecoins will run the financial backend of the future — they already quietly do for a lot of cross-border and onchain flows, and that footprint is only going to expand. Programmable, always-on, transparent settlement is just better infrastructure than what we have now.",
      },
      {
        kind: "text",
        body:
          "Finance is the field my skills gravitate to most naturally — but deep down I'll always be an entrepreneur at heart. The two aren't in tension. Understanding capital is one of the most useful things a founder can know, and being a founder is one of the most useful lenses to bring to capital.",
      },
      {
        kind: "list",
        heading: "Sailfish Fund + CFP path",
        items: [
          "10+ credit hours on PBA's Sailfish Fund — student-managed ~$200k equity portfolio",
          "Analyzed individual equities for the fund's investment committee",
          "Mapping B.S. Finance degree against CFP Principal Knowledge Domains",
          "Goal: CFP certification and financial advisory career post-graduation (2028)",
          "Long-run vision: advisory firm with crypto/blockchain specialization",
        ],
      },
    ],
    suggestedPrompts: [
      "Why did Samuel pick finance?",
      "How does he think about blockchain and stablecoins?",
      "What is the Sailfish Fund?",
    ],
  },
  {
    slug: "academics-overview",
    filename: "academics_overview",
    title: "Academics Overview",
    description: "Credentials and formal training — where I learned to think rigorously.",
    folder: "academics",
    sections: [
      {
        kind: "timeline",
        entries: [
          {
            year: "2022–2025",
            label: "Alabama Christian Academy — Montgomery, AL",
            detail: "4.3 GPA, 28 ACT, Honor Roll. Completed 30+ college credits while in high school.",
          },
          {
            year: "2025–present",
            label: "Palm Beach Atlantic University — West Palm Beach, FL",
            detail: "B.S. Finance, expected 2028. Junior. 10+ credit hours on the Sailfish Fund (student-managed ~$200k equity portfolio). Mapping coursework against CFP Principal Knowledge Domains.",
          },
        ],
      },
      {
        kind: "list",
        heading: "Achievements and distinctions",
        items: [
          "4.3 GPA at ACA — weighted, with honors-track coursework",
          "28 ACT",
          "Honor Roll throughout high school",
          "30+ college credits earned before university enrollment",
          "Sailfish Fund analyst — equity analysis for a live $200k portfolio",
        ],
      },
      {
        kind: "image",
        src: "/photos/milestone-hs-graduation.webp",
        alt: "ACA graduating class — Class of 2025",
        filename: "aca_graduation_2025.png",
        aspect: "landscape",
        align: "center",
        size: "sm",
        caption: "Alabama Christian Academy — Class of 2025",
      },
    ],
    suggestedPrompts: [
      "What is Samuel's academic background?",
      "Where is he going to school and what is he studying?",
      "What are his academic credentials?",
    ],
  },
  {
    slug: "baseball-overview",
    filename: "baseball_overview",
    title: "Baseball Overview",
    description: "The game that shaped how I think about performance, data, and competition.",
    folder: "baseball",
    sections: [
      {
        kind: "text",
        body:
          "I played baseball from age 5 to 18. At some point I became obsessed with one question: what is actually the best way to hit a baseball? That question pulled me into physics, biology, biomechanics — fields I knew nothing about. I spent hours and hours researching, thinking, and working in the cage. Weeks and years of it.",
      },
      {
        kind: "text",
        body:
          "What baseball taught me isn't really about baseball. It's that when I care about something, I will go learn whatever field I need to learn to understand it at a deep level. I don't need a class, a credential, or someone to hand it to me. I'll find it, study it, and put in the reps until I get it. That's the pattern — and it shows up everywhere in my life.",
      },
      {
        kind: "text",
        body:
          "Baseball also taught me something about myself I couldn't have learned any other way. Playing under a string of high school coaches, I kept running into the same frustration: they had rules and drills and expectations, but no why behind any of it. It drove me crazy. I had to sit with that and actually diagnose myself — figure out why it bothered me so much when others just went along with it. What I found was that I can't operate on blind instruction. I need the logic to hold. If I can't see the reasoning, I can't fully commit. That's not stubbornness — it's how I'm wired, and knowing it has made me a much better operator.",
      },
      {
        kind: "image_gallery",
        heading: "Reps — age 5 to 18",
        columns: 4,
        images: [
          { src: "/photos/baseball-rays-jersey.webp", alt: "Samuel in Rays jersey on the field", filename: "rays_jersey.png", caption: "Little league — Rays jersey", aspect: "portrait" },
          { src: "/photos/baseball-cage-young.webp", alt: "Samuel in the batting cage, younger", filename: "cage_age_12.png", caption: "Cage work, early years", aspect: "portrait" },
          { src: "/photos/baseball-cage-teen.webp", alt: "Samuel in the batting cage, teen years", filename: "cage_teen.png", caption: "Cage work, high school", aspect: "landscape" },
          { src: "/photos/baseball-pitching.webp", alt: "Samuel on deck during a night game", filename: "night_on_deck.png", caption: "Night game on deck", aspect: "portrait" },
        ],
      },
    ],
    suggestedPrompts: [
      "What did baseball teach Samuel about how he learns?",
      "Tell me about his baseball background.",
      "How does his approach to baseball connect to how he works today?",
    ],
  },
  {
    slug: "faith-roots-overview",
    filename: "faith_roots_overview",
    title: "Faith & Roots Overview",
    description: "The foundation — faith, family, and where I come from.",
    folder: "faith_roots",
    sections: [
      {
        kind: "text",
        body:
          "Christ is quite literally the only reason I wake up in the morning. God chose to love me long before I could ever love Him — and that has changed my relationship with the Creator and with other people in a way nothing else could.",
      },
      {
        kind: "text",
        body:
          "I want to do something great. Two reasons. First: when I accomplish something great, people — Christians and non-Christians alike — will ask how I did it. And I can point to the power of the Holy Spirit. Second: God gave me these skills, this mind, the ability to walk and talk and breathe. The right response is to use all of it to bring as much value to Him and to others as I possibly can.",
      },
      {
        kind: "text",
        body:
          "I grew up in a family that went to church every Sunday. My father showed me what faith looks like mostly through action, not words. I can barely remember a single time he came home and took his frustration out on the family. He just showed me, consistently, what it looks like to live it.",
      },
      {
        kind: "text",
        body:
          "In high school I went through a real moment of reckoning. The wicked kids were the most popular. The good people weren't. It genuinely upset me — I couldn't make sense of it. So I read the Bible cover to cover. Since then I've only grown closer to the Lord. The best thing that's ever happened to me — and will ever happen to me — is gaining the joy of the Holy Spirit. There's no real reason to have joy in this world on its own. The only way to have it is supernaturally, through the Holy Spirit living through you. I'll stand on that.",
      },
      {
        kind: "list",
        heading: "Favorite books of the Bible",
        items: [
          "Romans — Paul is a goat. A completely logical, airtight argument for the Gospel.",
          "Lamentations — God speaking through his prophets shows the depth of His love for His people. Including me.",
          "Revelation — the book of promise. What it all results in, in His triumphant glory.",
        ],
      },
    ],
    suggestedPrompts: [
      "What grounds Samuel?",
      "How does his faith connect to his ambition?",
      "What does he mean by the joy of the Holy Spirit?",
    ],
  },
  {
    slug: "hobbies-overview",
    filename: "hobbies_overview",
    title: "Hobbies Overview",
    description: "What I do when I'm not building.",
    folder: "hobbies",
    sections: [
      {
        kind: "list",
        heading: "Current pursuits",
        items: [
          "Baseball — done playing, still obsessed with the analytics and mechanics behind it",
          "Chess — active on chess.com (shott_038), pattern-recognition work",
          "Poker — studying theory and playing; overlap with business decision-making under uncertainty",
          "Basketball and ping pong — casual but competitive",
          "FPV drones — flying and building; engineering and spatial awareness",
          "Race cars and automotive engineering — Porsche engineering philosophy, Ferrari aesthetics; long-run dream project is building a car",
          "Photography — composition, light, capturing moments without overthinking",
        ],
      },
      {
        kind: "image_gallery",
        heading: "What this actually looks like",
        columns: 4,
        images: [
          { src: "/photos/hobby-fpv-drone.webp", alt: "FPV drone with goggles, controller, and battery", filename: "fpv_rig.png", caption: "FPV rig — drone, goggles, transmitter", aspect: "square" },
          { src: "/photos/hobby-fishing-bass.webp", alt: "Samuel holding a largemouth bass on the boat", filename: "everglades_bass.png", caption: "Fly rod, largemouth, Florida", aspect: "portrait" },
          { src: "/photos/hobby-pilot.webp", alt: "Samuel in pilot's uniform at the terminal", filename: "pilot_terminal.png", caption: "Aviation — student pilot", aspect: "portrait" },
          { src: "/photos/hobby-minecraft.webp", alt: "Custom enchanted armor character in Minecraft", filename: "minecraft.png", caption: "Minecraft — has a long running maxed out survival world", aspect: "landscape" },
        ],
      },
    ],
    suggestedPrompts: [
      "What does Samuel do outside of work?",
      "What are his hobbies?",
      "What's the dream project he talks about building someday?",
    ],
  },
  {
    slug: "references-overview",
    filename: "references_overview",
    title: "References Overview",
    description: "People who can speak to my work and character.",
    folder: "references",
    sections: [
      {
        kind: "text",
        body:
          "Both references have known me for multiple years and can speak to character, work ethic, and integrity — not just credentials. Reach out with context about what you're evaluating.",
      },
      {
        kind: "person",
        name: "Will Barfoot",
        role: "Alabama State Senator",
        contact: "will.barfoot@alsenate.gov",
        address: "11 South Union Street, Suite 733, Montgomery, AL",
      },
      {
        kind: "person",
        name: "Mrs. Picken",
        role: "High School Teacher, Alabama Christian Academy",
        contact: "spicken@alabamachristian.org",
        address: "4700 Wares Ferry Road, Montgomery, AL 36109",
      },
    ],
    suggestedPrompts: [
      "Does Samuel have references?",
      "Who can speak to Samuel's character and work?",
      "How do I reach his references?",
    ],
  },
  {
    slug: "contact_info-overview",
    filename: "contact_info_overview",
    title: "Contact Overview",
    description: "Get in touch.",
    folder: "contact_info",
    sections: [
      {
        kind: "contact_block",
        email: "samuel.schoettker4@gmail.com",
        phone: "",
        location: "West Palm Beach, FL",
      },
      {
        kind: "text",
        body:
          "Email is the best way to reach me. I respond fast to people who are direct about what they want. If you're a recruiter or hiring manager, tell me the role, the company, and what specifically caught your attention — I'll give you an honest answer either way.",
      },
      {
        kind: "image",
        src: "/photos/portrait-suit-full.webp",
        alt: "Samuel Schoettker — full portrait",
        filename: "portrait_full.png",
        aspect: "portrait",
        align: "center",
        size: "sm",
      },
    ],
    suggestedPrompts: [
      "How can I contact Samuel?",
      "What's the best way to reach out to him?",
      "Is Samuel open to new opportunities?",
    ],
  },
];

export const ARCHIVE: ArchiveTree = { folders: FOLDERS, files: FILES };

export function getFile(slug: string): ArchiveFile | null {
  return ARCHIVE.files.find((f) => f.slug === slug) ?? null;
}

export function getFilesInFolder(folder: ArchiveFolderSlug): readonly ArchiveFile[] {
  return ARCHIVE.files.filter((f) => f.folder === folder);
}
