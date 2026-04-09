# React News Hub

High-performance Hacker News aggregator built in React and Vite, designed to demonstrate measurable optimization against Core Web Vitals and modern frontend bottlenecks.

## Project Goals

1. Build an intentionally slow baseline implementation and preserve it on slow-version.
2. Ship an optimized version on main with proven improvements.
3. Document all performance findings in [PERFORMANCE.md](PERFORMANCE.md).
4. Deliver production-ready containerization and GitHub Pages deployment support.

## Implemented Features

1. Fetch top 500 Hacker News stories and render title, author, score, timestamp, and outbound link.
2. Filter by title in near real-time.
3. Sort by score descending.
4. Virtualized article list for low DOM count and smooth interactions.
5. Responsive, optimized hero image with LCP/CLS-safe attributes.
6. Code splitting via lazy-loaded non-critical UI module.
7. Bundle analysis output through stats.html.

## Architecture Highlights

1. Parallel network fetching with Promise.all in [src/api/newsApi.js](src/api/newsApi.js).
2. Virtualized rendering in [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx).
3. Memoized row component and shared date formatter:
   [src/components/ArticleItem.jsx](src/components/ArticleItem.jsx)
   [src/utils/dateFormatter.js](src/utils/dateFormatter.js)
4. Cherry-picked lodash modules in [src/App.jsx](src/App.jsx).
5. Build chunk visualization in [vite.config.js](vite.config.js).

## Functional Proof (Automated)

Playwright tests in [tests/news-hub.spec.js](tests/news-hub.spec.js) verify:

1. Hero image includes width, height, srcset, and sizes.
2. Article list is virtualized with visible nodes kept below threshold.
3. Sorting and filtering interactions work.
4. Article links are always openable, including fallback to Hacker News item page when a direct URL is missing.

Run:

```bash
npm run test:e2e
```

## Branch Strategy

1. main: final optimized build.
2. slow-version: intentionally unoptimized baseline with anti-patterns.

## Local Setup

```bash
npm install
npm run dev
```

Build and preview production output:

```bash
npm run build
npm run preview
```

## Docker (Production Serving)

Environment variables are documented in [.env.example](.env.example).

Start:

```bash
docker compose up -d --build
```

Check status and health:

```bash
docker compose ps
```

Open app:

1. http://localhost:3000
2. If you override PORT locally, use that mapped port instead, for example http://localhost:3001

Stop:

```bash
docker compose down
```

## GitHub Pages Deployment Ready

This repository includes a deployment workflow:

1. [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

Vite base path auto-adjusts for project pages in [vite.config.js](vite.config.js) using the GitHub Actions repository context.

### One-time GitHub setup

1. Push main to GitHub.
2. In repository settings, open Pages.
3. Set Source to GitHub Actions.
4. Push to main (or run the workflow manually) to publish.

## Verification Commands

```bash
npm run lint
npm run build
npm run verify:build
npm run test:e2e
```

## Submission Checklist

1. [docker-compose.yml](docker-compose.yml) and [Dockerfile](Dockerfile) exist with healthchecks.
2. [PERFORMANCE.md](PERFORMANCE.md) includes baseline table and optimization log.
3. [.env.example](.env.example) exists and documents runtime variables.
4. slow-version branch exists.
5. Hero image optimization attributes exist in [src/App.jsx](src/App.jsx).
6. Virtualized list contracts exist in [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx).
7. Multiple JS chunks and stats.html are generated during build.
8. Full lodash bundle is avoided through module-level imports.
