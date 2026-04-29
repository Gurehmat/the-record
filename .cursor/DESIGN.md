# Design System: THE RECORD

## Vision & Aesthetic
**The Record** is an institutional "live debate referee" platform. The aesthetic is **Neo-Brutalist meets Courtroom Transcript**. It aims to feel like a high-density court reporter terminal from 1985 rendered with modern high-fidelity tech in 2026. It is authoritative, raw, utilitarian, and document-like.

---

## Color Palette
The palette is intentionally limited to reinforce the "printed document" and "terminal" feel.

- **Background (Parchment):** `#F5F1E8` (A warm, off-white parchment texture).
- **Primary Text/Borders:** `#1A1A1A` (Near-black for maximum contrast).
- **Accent Red (Fallacies/Alerts):** `#C8102E` (Used for flags, false claims, and primary action buttons).
- **Verified Green (Accurate Claims):** `#2D5016` (Used for positive status indicators and credible scores).
- **Warning Amber (Context):** `#B8860B` (Used for missing context or moderate warnings).
- **Highlights:** Light yellow background used for the active/most recent transcript line.

---

## Typography
Consistency in type is critical for the "official record" aesthetic.

- **Headlines & Section Labels:** Bold, uppercase sans-serif (**Space Grotesk**). Large weights with extra letter-spacing for an institutional feel.
- **Body Text & Transcripts:** Monospace (**JetBrains Mono** or **IBM Plex Mono**). Used for all logs, timestamps, and dialogue.
- **Timestamps:** Formatted as `[HH:MM:SS]` in monospace.

---

## Visual & Structural Rules
- **Borders:** Every card and major container has a 2-3px solid black border (`#1A1A1A`).
- **Shadows:** Hard offset drop shadows (4px right, 4px down) with no blur and solid black color. No soft shadows allowed.
- **Corners:** Generally square or minimal rounding (max 4px).
- **Information Density:** High-density layout with no "wasted" pretty space. Every panel should feel packed with relevant data.
- **Separation:** Use vertical color stripes (red/black) on the left edge of transcript entries to distinguish speakers.
- **Buttons:** Rectangular, thick-bordered, with hard shadows that "press" (translate) on click.

---

## Key Components

### 1. The Terminal Header
Full-width black background with white monospace text showing session IDs, real-time clocks, and pulsing "ON RECORD" indicators.

### 2. Status Cards (Mode Toggle)
Large, side-by-side cards with high-contrast selection states (Red fill with white text when active) to define the primary application mode.

### 3. Transcript Feed
Document-style scrolling list (not chat bubbles). Entries are interleaved with speaker labels and timestamps.

### 4. Verification Logs (Fallacy & Fact-Check)
Dense vertical lists with color-coded left-edge stripes (Red for fallacies, Green/Red for facts) and source citations in tiny monospace.

### 5. Official Verdicts
Formatted like a legal summons or court transcript, centered on a 900px document-width, featuring metadata blocks and asymmetric speaker scorecards.

### 6. Interrupt Modals
Heavy system-style alerts with dark 70% overlays, featuring large red fallacy headers and simple "AUDIO PING" visualizers.

---

## Mood Adjectives
- Institutional
- Authoritative
- Utilitarian
- Deliberate
- No-nonsense
- Stamped
- Weighty
