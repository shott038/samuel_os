import type { ArchiveFolderModule } from "./types";

export const faithRoots: ArchiveFolderModule = {
  folder: {
    slug: "faith_roots",
    displayName: "/faith_roots",
    description: "The foundation — faith, family, and where I come from.",
    section: "archive",
    overviewSlug: "faith-roots-overview",
  },
  files: [
    {
      slug: "faith-roots-overview",
      filename: "faith_roots_overview",
      title: "Faith & Roots Overview",
      description: "The foundation — faith, family, and where I come from.",
      folder: "faith_roots",
      label: "OVERVIEW",
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
  ],
};
