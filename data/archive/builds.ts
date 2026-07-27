import type { ArchiveFolderModule } from "./types";

export const builds: ArchiveFolderModule = {
  folder: {
    slug: "builds",
    displayName: "/builds",
    description: "What I've shipped — products, systems, and projects.",
    section: "archive",
    overviewSlug: "builds-overview",
  },
  files: [
    {
      slug: "builds-overview",
      filename: "builds_overview",
      title: "Builds Overview",
      description: "Products and systems I've shipped — what I built, how, and what it did.",
      folder: "builds",
      label: "OVERVIEW",
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
          subtitle: "AI marketing + intake system — May 2026–present",
          body:
            "The AEO and intake system running my dad's law firm in Montgomery, Alabama. A desktop app he opens and a headless service on the office's always-on PC: it scouts the news daily, pitches a story for his approval, then drafts in his voice and publishes to the website and socials — nothing goes out until a human says yes. Also tracks what five AI engines say about Alabama personal injury law, and handles intake end to end. Built solo in 61 days. See the full case study in this folder.",
          tags: ["AI Agents", "AEO", "Python", "FastAPI", "Supabase", "Claude Code"],
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
      slug: "tortbot",
      filename: "tortbot_case_study",
      title: "TortBot — Case Study",
      description:
        "Two months, one person: the AEO and intake system running a Montgomery law firm.",
      folder: "builds",
      label: "TORTBOT",
      badge: "CASE STUDY",
      sections: [
        {
          kind: "text",
          body:
            "Two months ago I was tasked with building AEO for my dad's law firm — get the firm cited by AI, bring in more cases, and ultimately help more people and make more money. I decided that meant two things: prepare the firm for AEO from the ground up, and build the software in-house instead of renting it, cutting the subscription overhead at the same time.",
        },
        {
          kind: "text",
          body:
            "Today it's running. TortBot is the AI marketing and intake system for Barfoot & Schoettker in Montgomery, Alabama. Backend, desktop app, website, every integration — I built all of it.",
        },
        {
          kind: "video",
          src: "/media/tortbot-showcase.mp4",
          poster: "/media/tortbot-showcase-poster.jpg",
          filename: "tortbot_showcase.mp4",
          caption: "A walkthrough of the running system. All client records shown are demo data.",
        },
        {
          kind: "stat_row",
          stats: [
            { label: "Build time", value: "61 days" },
            { label: "Commits", value: "509" },
            { label: "Lines", value: "~78,000" },
            { label: "Automated tests", value: "1,891" },
          ],
        },
        {
          kind: "list",
          heading: "What that took",
          items: [
            "Two deployables — a lightweight desktop app my dad opens, and a headless service running around the clock on the office's always-on PC doing the scouting, drafting and publishing. They share nothing but a database.",
            "11 external services wired into one system — Anthropic, OpenAI, Gemini, Perplexity and Grok for the models; Clio for case management; X for publishing; Supabase for data; Cloudflare for deploys; Gmail for intake; IndexNow for search.",
            "OAuth 1.0a implemented straight against the spec instead of pulling in a library — one less dependency to babysit on an office PC.",
            "An AEO-first website rebuild, structured so language models can actually read and quote it.",
            "A content engine that scouts the news daily, drafts in my dad's voice, and won't publish a word until a human approves it.",
            "A measurement layer that asks five AI engines the same question set every run and logs every answer, its sources, and which competitors got named.",
            "An intake CRM with automated follow-up, appointment booking, and Clio hand-off.",
          ],
        },
        {
          kind: "text",
          body:
            "Built with Claude Code and modern AI tooling. I didn't know most of this stack in May — I learned it because the goal required it.",
        },
        {
          kind: "text",
          body:
            "That's the part worth taking from it. Not the tech — the fact that I can be handed a vision with no map to it, work out what it actually needs, and go ship it. Making a dozen systems that were never designed to talk to each other behave like one product is the job. So is knowing what not to build.",
        },
        {
          kind: "text",
          body:
            "If the skills required to build this interest you, the contact folder has the fastest way to reach me.",
        },
      ],
      suggestedPrompts: [
        "How did Samuel wire 11 different services into one system?",
        "What is AEO and why did he build for it instead of SEO?",
        "Why does a human have to approve everything TortBot writes?",
      ],
    },
  ],
};
