import type { ArchiveFolderModule } from "./types";

export const hobbies: ArchiveFolderModule = {
  folder: {
    slug: "hobbies",
    displayName: "/hobbies",
    description: "What I do when I'm not building.",
    section: "archive",
    overviewSlug: "hobbies-overview",
  },
  files: [
    {
      slug: "hobbies-overview",
      filename: "hobbies_overview",
      title: "Hobbies Overview",
      description: "What I do when I'm not building.",
      folder: "hobbies",
      label: "OVERVIEW",
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
  ],
};
