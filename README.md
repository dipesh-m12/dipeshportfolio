# Dipesh Mishra — Ideas into systems

A custom portfolio with an interactive Three.js sculpture, six project stories, project filters, accessible detail dialogs, expertise accordions, and direct email contact.

## Run locally

From this folder, run `npm run dev`, then open http://127.0.0.1:4175. Node.js is the only requirement. There is no dependency installation or build step.

The deployable website is the `dist/` directory. Use an HTTP server rather than opening `index.html` directly, because browser modules require HTTP.

## Edit

- `dist/index.html`: page structure, visible copy, project artwork, and links.
- `dist/style.css`: responsive layout, typography, palette, and artwork styles.
- `dist/projects.js`: project descriptions, stacks, capabilities, and destination links.
- `dist/app.js`: navigation, filters, dialogs, local time, and copy email.
- `dist/scene.js`: procedural 3D, drag/keyboard controls, motion preferences, and static fallback.
- `dist/assets/forestverse.png`: generated concept artwork; full prompt in `IMAGE-PROVENANCE.md`.

## Design sources

Applied the [Owl-Listener designer-skills](https://github.com/Owl-Listener/designer-skills) guidance for layout grids, visual hierarchy, spacing, typography, color, responsive behavior, animation, and project case-study structure. The reference repository is saved alongside this project as `designer-skills-reference`.

Professional content was drawn from the existing local portfolio and `CICD-tool/html/index.html`. The source portfolios were left intact. No invented client metrics, portrait, résumé, or employment dates were added. Rizzerv's thumbnail is an interface study; ForestVerse uses labeled concept artwork. Other thumbnails are authored visual interpretations, not product screenshots.

## Controls and accessibility

The 3D sculpture supports pointer drag, arrow keys when focused, Home to reset, and a motion toggle. It pauses offscreen and in background tabs; reduced-motion users start with a still scene. A CSS illustration remains available when WebGL cannot load. Project dialogs support Escape, modal focus containment, and focus restoration. Mobile navigation supports Escape and link dismissal. Content stays readable without the 3D scene.

## Assets and privacy

Manrope and Three.js are self-hosted with their licenses in `dist/assets/`. There are no analytics, cookies, tracking scripts, external font requests, or contact form service. Email links open the visitor's mail app. External project links open a new tab.

## Validation

`npm run check` validates JavaScript syntax. `qa.cjs` runs browser checks with the Playwright installation already available on this PC; adjust its local browser/package paths to run on another computer. Screenshots and browser results are saved in `.qa/` and excluded from published source.

Hosting identity is recorded in `.openai/hosting.json`. New Sites use private access by default.
