import type { ArchiveFolderModule } from "./types";

export const finance: ArchiveFolderModule = {
  folder: {
    slug: "finance",
    displayName: "/finance",
    description: "Thesis work — markets, investments, and capital thinking.",
    section: "archive",
    overviewSlug: "finance-overview",
  },
  files: [
    {
      slug: "finance-overview",
      filename: "finance_overview",
      title: "Finance Overview",
      description: "Why finance fits my brain — and where I think the next decade is headed.",
      folder: "finance",
      label: "OVERVIEW",
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
  ],
};
