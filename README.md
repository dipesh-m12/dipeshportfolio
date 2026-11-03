# Dipesh Mishra — Ideas into systems

A custom portfolio with an interactive Three.js sculpture and structural view, GSAP transitions, eight project stories, detailed professional experience, readable typography, education, awards, and a working contact form.

## Run locally

From this folder, run `npm run dev`, then open http://127.0.0.1:4175. Node.js is the only requirement. There is no dependency installation or build step.

The deployable website is the `dist/` directory. Use an HTTP server rather than opening `index.html` directly, because browser modules require HTTP.

## Edit

- `dist/index.html`: page structure, visible copy, project artwork, and links.
- `dist/style.css`: responsive layout, typography, palette, and artwork styles.
- `dist/enhancements.css`: larger typography, experience, education, honors, contact form, and responsive refinements.
- `dist/projects.js`: project descriptions, stacks, capabilities, and destination links.
- `dist/app.js`: navigation, filters, dialogs, local time, and copy email.
- `dist/contact.js`: validated contact form using the same public API as the original portfolio.
- `dist/motion.js`: GSAP entrance/reveal animations, pointer-only card depth, and reading progress.
- `dist/scene.js`: procedural 3D, drag/keyboard controls, motion preferences, and static fallback.
- `dist/assets/forestverse.png`: generated concept artwork; full prompt in `IMAGE-PROVENANCE.md`.

## Design sources

Applied the [Owl-Listener designer-skills](https://github.com/Owl-Listener/designer-skills) guidance for layout grids, visual hierarchy, spacing, typography, color, responsive behavior, animation, and project case-study structure. The reference repository is saved alongside this project as `designer-skills-reference`.

The résumé supplied on 3 November 2026 is authoritative for professional experience, education, skills, awards and production-project metrics. Meetandmore's contract dates were confirmed directly as April 2025–January 2026. BrowserStack and Enpointe.io roles, Rizzerv/Inovact metrics, and honors are preserved. The earlier portfolio supplies the additional creative projects. Rizzerv's thumbnail is an interface study; ForestVerse uses labeled concept artwork. Other thumbnails are authored visual interpretations, not product screenshots. Supporting product/app/certificate links appear in the relevant sections and project details.

## Controls and accessibility

The 3D sculpture supports pointer drag, arrow keys when focused, Home to reset, a motion toggle, and an Explore structure button revealing the geometry beneath the surface. It pauses offscreen and in background tabs; reduced-motion users start with a still scene. A CSS illustration remains available when WebGL cannot load. Project dialogs support Escape, modal focus containment, and focus restoration. Mobile navigation supports Escape and link dismissal. Main reading text is at least 16px at tested widths, with larger desktop text. Content stays readable without animation or the 3D scene.

## Assets and privacy

Manrope, Three.js and GSAP are self-hosted with license notices in `dist/assets/`. There are no analytics or external font requests. The contact form sends name, email and message to `https://email-service-tk9b.vercel.app/api/email`, using the original portfolio's public API contract and fixed recipient `mavinash422@gmail.com`. It validates fields, prevents duplicate submissions, has a 15-second timeout, preserves messages on failure, and offers a mail-app fallback. One approved live test on 3 November 2026 returned HTTP 200 and was confirmed in the recipient's inbox. No API credentials are embedded. External project links open a new tab.

## Validation

`npm run check` validates JavaScript syntax. `qa-v2.cjs` runs the current browser checks with the Playwright installation already available on this PC; adjust its local browser/package paths to run elsewhere. This suite mocks contact responses and does not send mail. Screenshots and results are saved in `.qa/` and excluded from published source. `qa.cjs` is the historical first-version suite.

Hosting identity is recorded in `.openai/hosting.json`. For GitHub Pages or Vercel, see [DEPLOYMENT.md](DEPLOYMENT.md). Deploy `dist/`; no build step or backend hosting is required for this frontend.
