import type { ArchiveFolderModule } from "./types";

export const contactInfo: ArchiveFolderModule = {
  folder: {
    slug: "contact_info",
    displayName: "Contact",
    description: "Encrypted operator channel — direct line to Samuel.",
    section: "links",
    overviewSlug: "contact_info-overview",
  },
  files: [
    {
      slug: "contact_info-overview",
      filename: "contact_info_overview",
      title: "Contact Overview",
      description: "Get in touch.",
      folder: "contact_info",
      label: "OVERVIEW",
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
  ],
};
