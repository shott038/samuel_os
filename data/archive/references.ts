import type { ArchiveFolderModule } from "./types";

export const references: ArchiveFolderModule = {
  folder: {
    slug: "references",
    displayName: "/references",
    description: "People who can speak to my work and character.",
    section: "links",
    overviewSlug: "references-overview",
  },
  files: [
    {
      slug: "references-overview",
      filename: "references_overview",
      title: "References Overview",
      description: "People who can speak to my work and character.",
      folder: "references",
      label: "OVERVIEW",
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
  ],
};
