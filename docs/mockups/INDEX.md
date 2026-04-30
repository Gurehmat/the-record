# Stitch Mockups Reference — The Record

## Setup Screens

### `setup-record-mode.png`
Setup page with **Record Mode** selected. Features:
- Top navbar: "THE RECORD" logo left, "RECORD MODE" / "FORUM MODE" nav links center (Record underlined as active), pen + gear icons right
- Page heading: "INITIALIZE PROCEEDINGS" in large Space Grotesk, subtitle "ESTABLISH DEBATE PARAMETERS AND SUBJECT MATTER." in JetBrains Mono uppercase, red divider line below
- Mode selector: two side-by-side cards. Record card = red bg (#C8102E), white text, people icon top-right. Forum card = parchment bg, black text, person-with-magnifier icon top-right. Each card has: mode name bold top, red divider, subtitle "TWO HUMANS // LIVE DEBATE" or "1V1 // VS A PHILOSOPHER", description paragraph in JetBrains Mono ~13px
- Config section: fieldset-style bordered card with legend "RECORD MODE PARAMETERS" embedded in top border. Inside: Speaker A and Speaker B inputs side-by-side (2-col grid), labels uppercase JetBrains Mono bold, inputs with 2px black border, placeholder "ENTER NAME..." uppercase. Red divider between speakers and topic. Full-width "DEBATE TOPIC" textarea, placeholder "ENTER PRIMARY THESIS OR RESOLUTION..."
- Bottom: full-width "BEGIN PROCEEDINGS →" button, black bg (#1A1A1A), white JetBrains Mono uppercase text, arrow icon, thick border

### `setup-forum-mode.png`
Setup page with **Forum Mode** selected. Features:
- Same navbar and heading as Record
- Mode selector: Forum card now red bg, Record card now parchment bg (swapped)
- Config section: fieldset-style card with header "FORUM MODE CONFIGURATION", red divider under header
- "YOUR ALIAS" input with dark bg, placeholder "CITIZEN_X" in uppercase mono
- "SELECT OPPONENT" section: 3 stacked full-width rows (NOT a grid)
  - Socrates row: selected state = dark bg (#1A1A1A), white text. "SOCRATES — Athens, 470 BC." first line, "Asks more than he answers. Defines terms." second line
  - Hitchens row: unselected = parchment bg, black text, pen icon left. "CHRISTOPHER HITCHENS — Modern." / "Sharp, witty, literary, takes no prisoners."
  - Nietzsche row: unselected, temple icon left. "FRIEDRICH NIETZSCHE — Röcken, 1844." / "Provocative. Confrontational. Breaks your idols."
- "INPUT METHOD" toggle: two segments side-by-side. "VOICE INPUT" (mic icon, dark bg selected) and "TEXT INPUT" (keyboard icon, parchment bg). Same thick border style
- "DEBATE TOPIC (OPTIONAL PREMISE)" textarea, placeholder "E.g., The concept of objective truth is obsolete in the digital age."
- Same full-width "BEGIN PROCEEDINGS →" button

## Debate Screens

## Debate Screens

### `forum-debate.png`
Forum Mode live debate screen. Features:
- Navbar: "THE RECORD // FORUM // SESSION 002" italic Space Grotesk left, "SESSION INFO" / "INPUT: TEXT" badge / "LOGS" (red, active) / "NETWORK" center nav, "● ON RECORD" live indicator + pen + feed icons right
- Matchup header: smiley avatar + "YOU: PARTICIPANT_01" left, "VS" in red center, "SOCRATES // 470 BC - 399 BC" + temple icon right. Red divider below
- Main chat area (left ~65% width): bordered card, scrollable transcript
  - Messages alternate: user messages have red left border bar, philosopher messages have light yellow/cream bg
  - Each message: timestamp badge "[14:02:45]", speaker name bold "PARTICIPANT_01" or "SOCRATES", message text in JetBrains Mono
  - Active/latest philosopher message has yellow bg highlight + audio waveform indicator (red bars)
  - Typing indicator "●●●" at bottom
- Right sidebar (~35% width), two stacked panels:
  - "FALLACY LOG" panel: clock icon top-right, cards with "FLAGGED" badge, fallacy name in red (e.g., "STRAW MAN"), quoted text, explanation. Card bg is light pink/red tint
  - "FACT CHECK LOG" panel: gear icon top-right, cards with "VERIFIED" badge, category in green (e.g., "HISTORICAL CONTEXT"), explanation. Card bg is light green tint
- Bottom input bar: "🎤 SWITCH TO VOICE" button left (bordered), text input "TYPE YOUR ARGUMENT..." center (bordered, full width), "SUBMIT →" button right (black bg, white text)

### `record-debate.png`
Record Mode live debate screen. Features:
- Navbar: "THE RECORD" bold italic left, "// SESSION 001 // 00:14:23" timer, "SESSION INFO" (underlined active) / "LOGS" / "NETWORK" center, "● ON RECORD" red live indicator + gear + clock icons right
- Top half — two speaker columns side-by-side:
  - Speaker A card: "SPEAKER A" header, "🎤 ACTIVE" status badge (mic active), red audio waveform visualization bars, timestamped transcript entries in mono, highlighted/yellow bg on flagged statements, "⊕ CREDIBILITY SCORE: 87%" black badge at bottom
  - Speaker B card: "SPEAKER B" header, "🎤 STANDBY" status (muted), same transcript format, "⊕ CREDIBILITY SCORE: 92%" bordered badge at bottom
  - Flagged statements highlighted in yellow within transcript
- Bottom half — three equal columns:
  - "⚠ FALLACY LOG" panel: warning icon, entries with timestamp, speaker badge (black bg), fallacy type in red (AD HOMINEM, STRAW MAN), "DETECTED"/"FLAGGED" red badges, brief explanation text. Cards have red-tinted left border
  - "☰ LIVE TRANSCRIPT" panel: "AUTO-SCROLL ON" toggle top-right, running transcript with "[SPEAKER A/B]" tags, timestamps, flagged lines highlighted yellow
  - "✉ FACT CHECK LOG" panel: entries with timestamp, "CLAIM:" in bold, verdict badges "✓ VERIFIED" (green) / "✗ FALSE" (red), source attribution, "AUTO-CHECKING VIA GEMINI + GOOGLE SEARCH" footer text

  

### `fallacy-modal.png`
Fallacy detection notification modal overlaying the debate screen. Features:
- Background: dimmed/grayed out debate transcript visible behind
- Above modal: "↑ AUDIO PING 🔊" indicator in red
- Modal: black header bar with "[14:23:07] FALLACY DETECTED" white text left, warning triangle icon right
- Body on parchment bg:
  - Fallacy name "AD HOMINEM" in large red Space Grotesk
  - "FLAGGED FROM SPEAKER A" in uppercase mono
  - Red divider line
  - Quoted text with red left border (blockquote style): "But you're just a shill for big tech, so why should we listen?"
  - Explanation box with subtle border: description of the fallacy in uppercase JetBrains Mono
  - Red divider line
  - Two buttons: "RESUME PROCEEDINGS →" (red bg, white text) and "DISPUTE FLAG" (parchment bg, black text, thick border)
- Modal itself has red right border accent and thick black border

## Verdict Screens

### `verdict-record.png`
Record Mode verdict/summary screen. Features:
- Navbar: "THE RECORD" left, "ARCHIVE" / "SESSION" (underlined active) / "STATUTES" center nav, temple + clock icons right
- "VERDICT" large centered Space Grotesk heading
- Case metadata row: bordered card with "CASE NO. ........ 001", "DATE ........ 2026-04-30", "DURATION ........ 24 MIN 12 SEC", "TOPIC .......... 'MINIMUM WAGE INCREASES'" — dotted leader style in mono
- Two speaker scorecards side-by-side:
  - Each card: thick black border, speaker label + person icon top
  - Large credibility score percentage (Speaker A: "87%" in green, Speaker B: "42%" in red)
  - "CREDIBILITY SCORE" label below percentage
  - Stats table: CLAIMS MADE, CLAIMS VERIFIED, FALLACIES (fallacy count in red) — right-aligned numbers
  - Bottom verdict bar: Speaker A = green bg "VERDICT: CREDIBLE", Speaker B = red bg "VERDICT: NEEDS WORK"
- "FACT CHECK SUMMARY" section: Space Grotesk heading, red divider
  - Individual fact check cards: timestamp badge "[12:45]", status "✓ CLAIM VERIFIED" (green) or "✗ CLAIM FALSE" (red), quoted claim in mono, dashed divider, "SOURCE:" attribution line
- "FALLACY SUMMARY" section: Space Grotesk heading, red divider
  - Fallacy cards: timestamp "[16:05]", speaker badge "SPEAKER B" black bg, type badge "STRAW MAN" red bg, italic quoted text, dashed divider, "EXPLANATION:" analysis paragraph
- Bottom actions: three buttons — "DOWNLOAD AS PDF" (black bg), "SHARE LINK" (parchment bg), "NEW SESSION" (black bg with + icon)
- Footer: "ON THE RECORD — GENERATED BY GEMINI + ELEVENLABS — CONHACKS 2026"

### `verdict-forum.png`
Forum Mode verdict/summary screen. Features:
- Left sidebar: "STENOGRAPHER_AI" avatar label, "SESSION_ID: 882-AX", nav items: VERDICT (active, red bg), TRANSCRIPT, EVIDENCE, REBUTTAL, APPEAL
- Header: "VERDICT // FORUM SESSION 002" in Space Grotesk
- Case metadata row: ID, DATE, DURATION, OPPONENT (SOCRATES), TOPIC
- Two scorecards side-by-side:
  - PARTICIPANT_01 card: person icon, large "82%" credibility, stats (CLAIMS MADE: 9, FALLACIES: 1 in red), "VERDICT: CREDIBLE" green bar
  - OPPONENT: SOCRATES card: temple icon, score "99", iconic Socrates quote in italic mono, stats (QUESTIONS POSED: 14, DEFINITIONS REQUESTED: 6)
- "DIALOGUE HIGHLIGHTS" section: red bg label, timestamp-tagged exchange pairs showing key moments from the debate in bordered cards
- Side-by-side summary sections:
  - "FACT CHECK SUMMARY": claim cards with VERIFIED (green badge) / FALSE (red badge), quoted claims, system notes
  - "FALLACY SUMMARY": fallacy cards with type badge, quoted text with red left border, analysis. "NO FURTHER FALLACIES DETECTED / LOGIC STREAM VALIDATED" with checkmark when clean
- Bottom actions: "DOWNLOAD AS PDF", "SHARE LINK", "NEW SESSION" buttons
- Footer: same attribution line
- Left side: floating "+ NEW_DEBATE" button
