# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal blog (Marinus's Blog) built with Astro 6 and `@chenglou/pretext` for canvas-based text typography. Deployed to Cloudflare Pages. Content is in Chinese (zh-CN).

## Commands

| Command             | Action                                  |
| :------------------ | :-------------------------------------- |
| `npm install`       | Install dependencies (Node >= 22.12.0)  |
| `npm run dev`       | Dev server at `localhost:4321`          |
| `npm run build`     | Production build to `./dist/`           |
| `npm run preview`   | Preview production build locally        |
| `npm run astro ...` | Run Astro CLI commands                  |

## Architecture

**Framework**: Pure Astro — no React/Vue/Svelte integrations. All components are `.astro` files with scoped `<style>` blocks. TypeScript strict mode (`astro/tsconfigs/strict`).

**Content**: Astro Content Collections with Zod schema validation.
- Posts live in `src/content/posts/` as `.md` files
- Schema defined in `src/content.config.ts` — required fields: `title`, `date`, `excerpt`, `tags`; optional: `cover`, `author`, `authorUrl`, `aiGenerated`, `aiModel`
- Gallery items defined statically in `src/data/galleryItems.ts`

**Routing (SSG)**:
- `src/pages/index.astro` — homepage with hero cover, post list, and gallery view
- `src/pages/posts/[slug].astro` — individual post pages with `getStaticPaths()`
- `src/pages/archive.astro` — posts grouped by year
- `src/pages/about.astro` — about page
- `src/pages/gallery/[id].astro` — gallery item README pages

**Key library — Pretext** (`@chenglou/pretext`): Global typography engine located in `src/lib/pretextTypography.ts` integrated via `src/layouts/BaseLayout.astro`. Uses `prepareWithSegments` and `layoutWithLines` to measure text via Canvas and render it as precisely-sized `.pretext-line` blocks across all pages (home, posts, about, archive, gallery, 404), preserving nested DOM formatting (links, bold, code). The `pretext-canvas-typography` post enables interactive mouse gravity attraction (`data-pretext-attract="true"`).

**Cover system** (`src/lib/homepageCover.ts`): Generates seasonal/time-based SVG covers programmatically. Seasons (spring/summer/autumn/winter) and moments (morning/noon/evening/night) produce different color palettes. The homepage currently uses a manual cover (`/covers/spings/night.jpg`).

**Styling**: CSS custom properties with glassmorphic effects. No Tailwind or utility frameworks. Responsive breakpoints at 768px, 600px, 480px, and 1024px (for TOC drawer).

## Conventions

- **Locale**: All UI text and date formatting use `zh-CN`
- **Navigation**: Header nav appears on every page (首页, 归档, 关于) — currently duplicated in each page template
- **Post sorting**: By `date` descending (newest first)
- **Static assets**: Images in `public/covers/`, avatar at `public/avatar.jpg`
- **No layout file**: Each page is a standalone full HTML document (no shared layout component)
