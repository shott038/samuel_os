import type { ArchiveFolderModule } from "./types";

export const baseball: ArchiveFolderModule = {
  folder: {
    slug: "baseball",
    displayName: "/baseball",
    description: "The game that shaped how I think about performance and data.",
    section: "archive",
    overviewSlug: "baseball-overview",
  },
  files: [
    {
      slug: "baseball-overview",
      filename: "baseball_overview",
      title: "Baseball Overview",
      description: "The game that shaped how I think about performance, data, and competition.",
      folder: "baseball",
      label: "OVERVIEW",
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
  ],
};
