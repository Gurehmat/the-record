# THE RECORD ⚖️
A live AI debate referee that fact-checks claims and flags logical fallacies in real time.

## The Problem
Debates shape how people think, from politics to policy to everyday online arguments.  
There is still no real referee in the room. Bad logic slides through, false claims get repeated, and confidence often beats truth.  
I built The Record to challenge arguments while they happen, not hours later in a fact-check article nobody reads.

## What It Does
Two modes, one mission: make debate more accountable.

**Forum Mode**  
Debate 1v1 against history's greatest minds: Socrates, Christopher Hitchens, or Friedrich Nietzsche.  
Each opponent responds in character with their own voice using ElevenLabs.  
Every argument is analyzed for fallacies and fact-checked against live sources.  
If a fallacy is detected, The Record triggers an audio ping and opens a courtroom-style ruling modal with the exact quote and explanation.

**Record Mode**  
Two humans debate live using one mic and real-time transcription.  
You tag which speaker is talking.  
The Record listens in the background, flags logical fallacies, fact-checks claims with Google Search grounding, and continuously updates a credibility score for each speaker.  
When the session ends, both speakers get a full verdict report with stats, evidence logs, and scoring breakdowns.

## How It Works (Technical Depth)
This is where The Record earns Technical Complexity points.

**Gemini 2.5 Flash, integrated in 4 distinct ways**
1. **Philosopher AI engine**: persona simulation with voice, rhetorical style, and argument behavior per philosopher. Single structured JSON response returns philosopher reply, fallacy analysis, and extracted claims together.
2. **Fallacy detection pipeline**: real-time classification across 15+ fallacy types, including ad hominem, straw man, appeal to consequences, and hasty generalization.
3. **Fact-checking with Google Search grounding**: claims are verified against live web sources with citations and verdict labels: verified, false, misleading, or unverifiable.
4. **Audio transcription in Forum voice flow**: spoken input is transcribed and routed directly into the same analysis pipeline.

**ElevenLabs Flash v2.5**
- Philosopher-specific voice personas with low-latency streaming output.
- Spoken responses are synced with animated waveform indicators for real-time feedback.

**Web Speech API**
- Record Mode uses continuous speech recognition for live transcript capture.
- Speaker tagging assigns claims and fallacies to the correct debater for clean attribution.

**Application architecture**
- React 18 + TypeScript (strict mode) + Vite.
- Zustand global state for messages, fallacies, fact-checks, and credibility scores.
- Custom request throttling and rate limiting to keep AI calls stable under rapid input.
- Debounced Record Mode analysis pipeline to avoid over-calling during continuous speech.
- Credibility scoring algorithm starts at 100 and applies penalties for fallacies (-15) and false claims (-10).

## Design
The visual system is neo-brutalist courtroom, designed in Google Stitch and implemented end to end with consistency.

- Parchment base (`#F5F1E8`), thick black borders, hard drop shadows, and dense information layout.
- Space Grotesk for headings, JetBrains Mono for transcript and evidence logs.
- Court transcript language across setup, live proceedings, and final verdict screens.
- Courtroom-style fallacy ruling modal with audio ping for instant intervention.
- Real-time credibility badges, waveform visualization, and typewriter-style transcript behavior to keep debate legible under pressure.

Every screen is designed to feel official, fast, and high-stakes.

## Built With
React 18, TypeScript, Vite, Tailwind CSS, Zustand, Gemini 2.5 Flash, ElevenLabs Flash v2.5, Web Speech API, Google Stitch, Vercel

## Prize Categories
- **Best Use of Gemini API**: 4 distinct integrations in one product (philosopher AI, fallacy detection, fact-checking with search grounding, audio transcription).
- **Best Use of ElevenLabs**: low-latency philosopher voice personas that make live argument simulation feel real.
- **Best UI/UX**: cohesive neo-brutalist courtroom design system carried across setup, debate, intervention modal, and verdict experiences.

## Try It
Live: [https://the-record-rosy.vercel.app]  
Repo: [github.com/Gurehmat/the-record](https://github.com/Gurehmat/the-record)

Built solo by Gurehmat Chahal at ConHacks 2026.
