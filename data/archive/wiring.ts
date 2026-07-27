import type { ArchiveFolderModule } from "./types";

export const wiring: ArchiveFolderModule = {
  folder: {
    slug: "wiring",
    displayName: "/how_i_think",
    description: "Sets the lens — how I see the world and what I optimize for.",
    section: "archive",
    overviewSlug: "how-i-think-overview",
  },
  files: [
    {
      slug: "how-i-think-overview",
      filename: "how_i_think_overview",
      title: "How I Think Overview",
      description: "How I see the world — the mental models and values that drive everything else.",
      folder: "wiring",
      label: "OVERVIEW",
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
            "I'm more of a creative than the finance degree lets on. The problems that light me up are the ones nobody's solved yet — nothing figured out, shape of the answer unclear.",
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
  ],
};
