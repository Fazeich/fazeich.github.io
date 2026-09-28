# Project Gallery

A first-person walk through a bright gallery hall where every painting is one of my projects.
Walk up to a painting, it lights up with a yellow outline, and pressing **E** takes you to the project.

Live: https://fazeich.github.io/

## Controls

| Action | Keys |
|---|---|
| Start / capture the cursor | click the scene |
| Walk | `W A S D` / arrows (works on the Russian layout too) |
| Hurry | `Shift` |
| Look around | mouse |
| Enter the project you're facing | `E` (`У` on the Russian layout) |
| Free the cursor | `Esc` |

## Adding a project

Everything shown lives in `src/content/projects.ts` — add an entry to `PAINTINGS`
(title, description, link, wall and position along the hall).
Painting artwork is drawn procedurally in `src/lib/art.ts`.

## Development

```bash
npm install
npm run start      # http://localhost:3000/
npm run lint
npm run typecheck
npm test
npm run deploy     # builds and publishes dist/ to the gh-pages branch
```

## Structure

- `src/app/App.tsx` — page: canvas, welcome card, crosshair, hints and the `E` key
- `src/scene/` — react-three-fiber scene: `Room`, `Painting` (outline, spotlight, info card), `Walker` (WASD + pointer-lock mouse look, head bob)
- `src/lib/` — pure helpers: layout/focus/collision (with tests), procedural art, room constants, mutable walker state
- `src/content/projects.ts` — greeting, contacts and paintings
- `src/store/gallery.ts` — Effector events/stores for the focused painting, the welcome card and cursor capture
- `src/ui/styles.ts` — styled-components for the DOM overlays

Built with React 18, Vite, TypeScript, three.js + react-three-fiber/drei, Effector and styled-components.
