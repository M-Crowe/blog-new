# my-canvas-blog Guidelines

## Code Style
- **Framework**: Pure Astro without frontend framework integrations (no React/Vue/Svelte).
- **Language**: TypeScript with strict mode enabled.
- **Styling**: Scoped CSS within `.astro` files using CSS custom properties (variables) and glassmorphic effects (e.g., `backdrop-filter`). No utility-class frameworks like Tailwind are used.
- **Locale**: Chinese (`zh-CN`) is the default language for UI text and date formatting.

## Architecture
- **Content Management**: Built on Astro Content Collections (defined in `src/content.config.ts`) with Zod schema validation. Markdown posts live in `src/content/posts/`.
- **Components**: Reusable UI pieces are pure `.astro` components (e.g., `src/components/PostList.astro`).
- **Routing**: Static Site Generation (SSG). Dynamic routes for posts are handled in `src/pages/posts/[slug].astro` using `getStaticPaths()`.
- **Theming & Assets**: Dynamic seasonal and time-based SVG generation for covers is handled programmatically via `src/lib/homepageCover.ts`.

## Build and Test
- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (runs at `localhost:4321`)
- **Build production site**: `npm run build`
*(See the root [README.md](../README.md) for more Astro CLI options).*

## Conventions
- **Markdown Frontmatter**: Every post must include `title` (string), `date` (valid date string), `excerpt` (string), and `tags` (array of strings). See `src/content/posts/astro-6-features.md` for an example.
- **Sorting Pattern**: Content is historically sorted by `date` descending (newest first). The homepage layout inherently treats the latest post as a "featured" item and subsequent posts in a compact grid structure.
