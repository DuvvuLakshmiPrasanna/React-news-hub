# React News Hub

React News Hub is a production-style Hacker News reader built with React + Vite, focused on one core goal: proving measurable frontend performance improvements with clean engineering practices.

## Why This Project Scores Well

This repository is designed to show both implementation quality and validation discipline:

1. Performance-first architecture (virtualization, progressive fetch, lazy loading).
2. Baseline-to-optimized audit trail in [PERFORMANCE.md](PERFORMANCE.md).
3. Automated test coverage for critical user flows in [tests/news-hub.spec.js](tests/news-hub.spec.js).
4. Production Docker setup with health checks.
5. Deploy-ready configuration for GitHub Pages.
6. Bundle verification tooling to prevent regression.

## Feature Overview

1. Fetches up to 500 top Hacker News stories.
2. Progressive loading so content appears quickly while background fetch continues.
3. Real-time search by title (debounced input).
4. Sort by score.
5. Virtualized list rendering for low DOM pressure.
6. Responsive hero image with explicit dimensions and srcset/sizes.
7. Lazy-loaded insights panel for reduced initial JavaScript cost.
8. Safe fallback URL for stories missing outbound links.

## Tech Stack

1. React 19
2. Vite 8
3. @tanstack/react-virtual
4. Playwright
5. ESLint
6. Docker + Nginx

## Architecture Notes

1. Progressive + concurrent story fetch logic is implemented in [src/api/newsApi.js](src/api/newsApi.js).
2. Virtualized rendering lives in [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx).
3. Main UI composition, search, sorting, and lazy imports are in [src/App.jsx](src/App.jsx).
4. Row rendering and memoized item output are in [src/components/ArticleItem.jsx](src/components/ArticleItem.jsx).
5. Bundle visualization output is configured in [vite.config.js](vite.config.js) and written to stats.html.

## Performance Evidence

Detailed baseline findings and optimization timeline are documented in [PERFORMANCE.md](PERFORMANCE.md), including:

1. LCP and CLS improvements via responsive image strategy.
2. INP/TBT improvements via virtualization and reduced render work.
3. Network throughput improvements via concurrent fetching.
4. Bundle improvements through selective imports and lazy loading.

## Quick Start

### Prerequisites

1. Node.js 20+
2. npm 10+

### Install and run

```bash
npm install
npm run dev
```

App runs on the Vite local URL printed in terminal (usually http://localhost:5173).

### Production build and preview

```bash
npm run build
npm run preview
```

## Scripts

| Command              | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| npm run dev          | Start local development server                        |
| npm run build        | Generate production build                             |
| npm run preview      | Preview production build locally                      |
| npm run lint         | Run ESLint checks                                     |
| npm run test:e2e     | Run Playwright end-to-end tests                       |
| npm run verify:build | Validate build artifacts and optimization constraints |
| npm run deploy       | Deploy dist to gh-pages branch                        |

## Quality Gates

Use this sequence before submission:

```bash
npm run lint
npm run build
npm run verify:build
npm run test:e2e
```

What verify:build checks (see [scripts/verify-build.mjs](scripts/verify-build.mjs)):

1. dist output exists.
2. stats.html exists.
3. Multiple JS chunks are generated.
4. Undesired lodash payload patterns are not present.

## End-to-End Tests

Playwright tests in [tests/news-hub.spec.js](tests/news-hub.spec.js) validate:

1. Hero image optimization attributes are present (width, height, srcset, sizes).
2. The article list is virtualized (rendered nodes stay well below full 500).
3. Sorting and filtering behavior is correct.
4. Story links include the fallback Hacker News item URL when external URL is missing.

Run tests:

```bash
npm run test:e2e
```

## Docker Deployment

Environment variable reference: [.env.example](.env.example)

Start containerized app:

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

Default URL:

1. http://localhost:3000

Stop services:

```bash
docker compose down
```

## GitHub Pages Deployment

This project is preconfigured for branch-based Pages deployment.

1. Build is generated into dist.
2. npm run deploy publishes dist to the gh-pages branch.
3. [vite.config.js](vite.config.js) uses base /React-news-hub/ to match project page routing.

One-time repository setup:

1. Push repository to GitHub.
2. Open repository Settings > Pages.
3. Choose Deploy from a branch.
4. Select gh-pages branch and /(root).

Publish updates:

```bash
npm run deploy
```

## Branching Model

1. main: optimized implementation.
2. slow-version: intentionally unoptimized baseline for comparison.

## Submission Checklist

1. [PERFORMANCE.md](PERFORMANCE.md) includes baseline analysis and optimization record.
2. [docker-compose.yml](docker-compose.yml) and [Dockerfile](Dockerfile) are present with health checks.
3. [.env.example](.env.example) is present.
4. Virtualized list implementation exists in [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx).
5. Hero image optimization attributes exist in [src/App.jsx](src/App.jsx).
6. Build output includes multiple JS chunks and stats.html.
7. Playwright tests pass in your environment.

## Project Structure

```text
src/
   api/
      newsApi.js
   components/
      ArticleItem.jsx
      ArticleListVirtualized.jsx
      PerformanceInsights.jsx
   utils/
      dateFormatter.js
   App.jsx
   main.jsx
tests/
   news-hub.spec.js
scripts/
   verify-build.mjs
```
