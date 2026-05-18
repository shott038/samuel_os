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
  | "writings"
  | "baseball"
  | "faith_roots"
  | "hobbies"
  | "photography"
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
    slug: "writings",
    displayName: "/writings",
    description: "Thinking on the page — essays, notes, and long-form takes.",
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
    slug: "photography",
    displayName: "/photography",
    description: "Light, composition, and the moments worth keeping.",
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
    displayName: "/contact_info",
    description: "Get in touch.",
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
        src: "/photos/portrait-headshot.png",
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
          "I'm most effective partnered with strong builders and strong distribution people. My contribution is figuring out what to build and why, setting direction, and clearing the path so the team can do their best work.",
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
        kind: "project",
        title: "SideQuestr",
        subtitle: "iOS app — March 2026–present",
        body:
          "Map-first social coordination. The core problem: deciding what to do and getting people there. The group decision is the unit of the app — GPS-verified visits prove actual attendance. Built with a 7-agent Claude Code team. ~940 lines of Swift per day, ~50-person beta cohort forming.",
        tags: ["Swift", "SwiftUI", "Supabase", "Mapbox", "Claude Code", "iOS"],
      },
      {
        kind: "image_gallery",
        heading: "SideQuestr — live screens",
        columns: 3,
        images: [
          { src: "/photos/build-sidequestr-map.png", alt: "SideQuestr map view with spots", filename: "sidequestr_map.png", caption: "Map view", aspect: "portrait" },
          { src: "/photos/build-sidequestr-friends.png", alt: "SideQuestr crew & friend activity", filename: "sidequestr_crew.png", caption: "Crew", aspect: "portrait" },
          { src: "/photos/build-sidequestr-icon.png", alt: "SideQuestr app icon", filename: "sidequestr_icon.png", caption: "Icon", aspect: "square" },
        ],
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
    description: "Agent methodology — how I design and build AI-native systems.",
    folder: "ai_agents",
    sections: [
      {
        kind: "text",
        body:
          "I'm proficient with AI agents and I use them in everything I do. They're not a side tool for me — they're the default way I work. I treat agents and LLMs the way an earlier generation of operators treated spreadsheets or the internet: a foundational layer that makes the human running them dramatically faster and more capable.",
      },
      {
        kind: "text",
        body:
          "Agents enhance my skills, they don't replace them. My judgment, taste, and direction stay mine — the agents do the heavy lifting underneath. The result is that I ship more, ship faster, and ship at a higher quality bar than I ever could on my own.",
      },
      {
        kind: "text",
        body:
          "I stay up to date. I read the agent news daily — model releases, new frameworks, evals, how other builders are wiring their systems. The field moves weekly and I move with it. Anyone working with me gets the benefit of that constant currency.",
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
        kind: "list",
        heading: "How I actually use agents day-to-day",
        items: [
          "Multi-agent teams for shipping product — specialist agents (frontend, backend, QA, security) routed by an orchestrator",
          "Parallel execution — fan out independent work so multiple things ship at once",
          "Agents in the research loop — drafting theses, summarizing news, sanity-checking ideas before I commit",
          "Agents in the writing loop — outlining, drafting, and editing in my own voice",
          "Agents in the ops loop — automating recurring chores so I spend time on what only I can do",
          "Constant evaluation — testing new models and tools as they ship, swapping in what's better",
        ],
      },
      {
        kind: "text",
        body:
          "The bet I'm making with my career: the operators who win the next decade are the ones who learned to run agent teams early and well. I started early. I'm getting better at it every week.",
      },
    ],
    suggestedPrompts: [
      "How does Samuel use AI agents in his work?",
      "Why does he think agents are the future?",
      "What does his day-to-day with agents actually look like?",
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
        src: "/photos/milestone-hs-graduation.png",
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
    slug: "writings-overview",
    filename: "writings_overview",
    title: "Writings Overview",
    description: "Thinking on the page — essays, notes, and long-form takes.",
    folder: "writings",
    sections: [
      {
        kind: "text",
        body:
          "Writing is where I test whether I actually understand something. If I can't explain it clearly in one page, I don't understand it well enough. I write across registers — formal when the argument needs structure, casual when speed matters, and persuasive when I'm trying to change someone's mind.",
      },
      {
        kind: "list",
        heading: "Notable pieces and topics",
        items: [
          "\"The Value of Bitcoin\" (March 2026) — fiat's three core failures (inflation, centralized control, slow transfers), how Bitcoin addresses each, and the case for Bitcoin as a store of value. \"Bet on greed. Bet on Bitcoin.\"",
          "Finance and capital markets — theses on stablecoin rails, treasury management, and the onchain transition",
          "Theology — working through presuppositional apologetics and its implications",
          "Sports analytics — performance models, training philosophy, what separates elite athletes",
          "History and economics — how monetary systems collapse and what replaces them",
        ],
      },
    ],
    suggestedPrompts: [
      "What does Samuel write about?",
      "What is his best essay?",
      "How does he use writing in his thinking process?",
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
          { src: "/photos/baseball-rays-jersey.png", alt: "Samuel in Rays jersey on the field", filename: "rays_jersey.png", caption: "Little league — Rays jersey", aspect: "portrait" },
          { src: "/photos/baseball-cage-young.png", alt: "Samuel in the batting cage, younger", filename: "cage_age_12.png", caption: "Cage work, early years", aspect: "portrait" },
          { src: "/photos/baseball-cage-teen.png", alt: "Samuel in the batting cage, teen years", filename: "cage_teen.png", caption: "Cage work, high school", aspect: "landscape" },
          { src: "/photos/baseball-pitching.png", alt: "Samuel on deck during a night game", filename: "night_on_deck.png", caption: "Night game on deck", aspect: "landscape" },
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
          "Baseball — still training, focused on swing mechanics and contrast work",
          "Chess — active on chess.com (shott_038), pattern-recognition work",
          "Poker — studying theory and playing; overlap with business decision-making under uncertainty",
          "Basketball and ping pong — casual but competitive",
          "Building watches — mechanical assembly, precision work, patience",
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
          { src: "/photos/hobby-fpv-drone.png", alt: "FPV drone with goggles, controller, and battery", filename: "fpv_rig.png", caption: "FPV rig — drone, goggles, transmitter", aspect: "square" },
          { src: "/photos/hobby-fishing-bass.png", alt: "Samuel holding a largemouth bass on the boat", filename: "everglades_bass.png", caption: "Fly rod, largemouth, Florida", aspect: "portrait" },
          { src: "/photos/hobby-pilot.png", alt: "Samuel in pilot's uniform at the terminal", filename: "pilot_terminal.png", caption: "Aviation — student pilot", aspect: "landscape" },
          { src: "/photos/hobby-minecraft.png", alt: "Custom enchanted armor character in Minecraft", filename: "minecraft.png", caption: "Minecraft — still undefeated at building castles", aspect: "landscape" },
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
    slug: "photography-overview",
    filename: "photography_overview",
    title: "Photography",
    description: "Composition, light, and the moments worth keeping.",
    folder: "photography",
    sections: [
      {
        kind: "text",
        body:
          "I shoot the way I think — fast, intuitive, and chasing the moment instead of the setup. Most of these are iPhone frames caught on the way to somewhere else. The discipline isn't in the gear; it's in noticing when light, weather, and geometry briefly agree.",
      },
      {
        kind: "image_gallery",
        heading: "Selected frames",
        columns: 4,
        images: [
          { src: "/photos/photo-lake-sunrise.png", alt: "Sunrise reflection on a glassy lake", filename: "lake_mirror.png", caption: "Glassy water, sunrise, Alabama", aspect: "landscape" },
          { src: "/photos/photo-mountain-ridge.png", alt: "Blue Ridge layers at dusk", filename: "blue_ridge.png", caption: "Ridges, dusk", aspect: "landscape" },
          { src: "/photos/photo-tree-sunset.png", alt: "Lone gnarled tree at sunset over a field", filename: "lone_tree.png", caption: "Lone tree, last light", aspect: "portrait" },
          { src: "/photos/photo-ferrari-palms.png", alt: "Red Ferrari under palms with sunburst", filename: "ferrari_palms.png", caption: "Palm Beach, golden hour", aspect: "portrait" },
        ],
      },
    ],
    suggestedPrompts: [
      "Show me Samuel's photography.",
      "What does he look for in a photo?",
      "Where were these taken?",
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
        src: "/photos/portrait-suit-full.png",
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
