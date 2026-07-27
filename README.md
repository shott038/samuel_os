# Samuel Schoettker — Recovered Intelligence

A personal site themed as an archived high-tech system: split-screen file explorer + AI assistant
representing a reconstructed digital twin.

## Stack
- Next.js 16 / React 19 / TypeScript strict / Tailwind 4
- Vercel AI SDK + Anthropic provider for the chat (Claude streaming)
- motion for tasteful animation, lucide-react for iconography

## Setup
    cp .env.example .env.local
    # Add your ANTHROPIC_API_KEY
    npm install
    npm run dev

## Editing content
- Archive records live in `data/archive/` — one typed module per folder (`builds.ts`, `wiring.ts`, …), assembled by `data/archive/index.ts`. To add a file to a folder, append an entry to that folder's `files` array; it shows up in the rail, the viewer tray, and the chatbot context automatically.
- Chatbot system prompt lives in `lib/system-prompt.ts` — replace the placeholder with your CLAUDE.md content.

## Deploy
    vercel              # preview
    vercel --prod       # production
    # Set ANTHROPIC_API_KEY in Vercel project settings before first deploy.
