import type { ArchiveFolderModule } from "./types";

export const academics: ArchiveFolderModule = {
  folder: {
    slug: "academics",
    displayName: "/academics",
    description: "Credentials and formal training.",
    section: "archive",
    overviewSlug: "academics-overview",
  },
  files: [
    {
      slug: "academics-overview",
      filename: "academics_overview",
      title: "Academics Overview",
      description: "Credentials and formal training — where I learned to think rigorously.",
      folder: "academics",
      label: "OVERVIEW",
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
  ],
};
