import type { ArchiveFolderModule } from "./types";

export const aiAgents: ArchiveFolderModule = {
  folder: {
    slug: "ai_agents",
    displayName: "/ai_agents",
    description: "Agent methodology and AI-native systems I've built.",
    section: "archive",
    overviewSlug: "ai-agents-overview",
  },
  files: [
    {
      slug: "ai-agents-overview",
      filename: "ai_agents_overview",
      title: "AI Agents Overview",
      description: "Agent methodology — how I design, scope, and run AI-native systems.",
      folder: "ai_agents",
      label: "OVERVIEW",
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
            "TortBot — the AEO and intake system I built end-to-end for a law firm in 61 days: it scouts news daily, pitches a story for approval, then writes, formats, and publishes the piece plus social teasers itself. Zero manual steps once the attorney approves — and nothing publishes until he does. AEO, not SEO: the goal is showing up when someone asks an AI for a lawyer recommendation.",
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
  ],
};
