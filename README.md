# Semantic Resize

Multi-dimensional text reshaping powered by AI -- go beyond simple "shorter/longer" with five independent style sliders.

![Demo](screenshot.png)

## Concept

Traditional text editing treats length as a single axis. Semantic Resize treats text as a malleable object with multiple stylistic dimensions that can be tuned independently and simultaneously. Drag any combination of sliders and watch the same core message reshape itself in real time.

## Dimensions

| Slider | Min | Max |
|---|---|---|
| **Length** | Tweet | Essay |
| **Formality** | Text Message | Legal Document |
| **Complexity** | ELI5 | PhD Thesis |
| **Energy** | Exhausted | Caffeinated |
| **Mood** | Pessimistic | Optimistic |

## Getting Started

```bash
git clone <repo-url>
cd primitive-semantic-resize
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your-key-here
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

Slider changes are debounced (500ms) and sent to a Next.js API route that calls the Claude API with a system prompt encoding all five dimensions. The rewritten text streams back and replaces the display. A history timeline tracks every version so you can revisit or compare past reshapings.

## Stack

- **Next.js** -- app router, API routes
- **Tailwind CSS** -- styling
- **Claude API** -- text rewriting via `claude-sonnet-4-20250514`

## Part of

This is one of 7 demos for **New Interaction Primitives for GenAI** -- a collection exploring novel UI patterns for working with large language models.
