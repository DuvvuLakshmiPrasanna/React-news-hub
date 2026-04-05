# React News Hub - Performance Engineering Project

A Hacker News aggregator built to demonstrate practical frontend performance engineering.

This repository contains:

- An intentionally slow baseline implementation on branch slow-version.
- A fully optimized implementation on main.

## Features

- Fetch and display top 500 Hacker News stories.
- Filter stories by title.
- Sort stories by score.
- Optimized hero image with responsive attributes.
- Virtualized story list for low DOM overhead.
- Lazy-loaded optimization insights panel (code splitting).
- Bundle analysis report generation (stats.html).

## Tech Stack

- React + Vite
- @tanstack/react-virtual
- Lodash (cherry-picked module imports)
- Docker + Docker Compose
- Nginx (production static serving)

## Branches

- main: optimized final implementation
- slow-version: unoptimized baseline with deliberate anti-patterns

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Run Slow Version Locally

```bash
git checkout slow-version
npm install
npm run dev
```

Switch back to optimized build:

```bash
git checkout main
```

## Docker

Environment variables are documented in [.env.example](.env.example).

1. Start containerized app:

```bash
docker-compose up -d --build
```

2. Open in browser:

- http://localhost:3000

3. Check container health:

```bash
docker-compose ps
```

4. Stop services:

```bash
docker-compose down
```

## Verification

Run the available automated checks:

```bash
npm run lint
npm run build
npm run verify:build
npm run test:e2e
```

The Playwright suite mocks Hacker News responses so the hero-image and virtualization checks are deterministic.

## Required Artifacts Included

- [docker-compose.yml](docker-compose.yml)
- [Dockerfile](Dockerfile)
- [.env.example](.env.example)
- [PERFORMANCE.md](PERFORMANCE.md)
- [stats.html](stats.html) generated after running npm run build

## How Requirements Are Addressed

- Network optimization:
  - Parallel fetching with Promise.all in [src/api/newsApi.js](src/api/newsApi.js).
- List performance:
  - Virtualization in [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx).
- Dependency optimization:
  - Cherry-picked lodash imports in [src/App.jsx](src/App.jsx).
- Expensive computation optimization:
  - Reused date formatter in [src/utils/dateFormatter.js](src/utils/dateFormatter.js).
- Code splitting:
  - React.lazy + Suspense in [src/App.jsx](src/App.jsx) for [src/components/PerformanceInsights.jsx](src/components/PerformanceInsights.jsx).
- Hero image optimization:
  - width, height, srcset, sizes, and data-testid attributes in [src/App.jsx](src/App.jsx).

## Notes for Evaluation

- Build artifacts are generated via npm run build in dist/assets.
- Multiple JavaScript files are produced because of lazy-loaded chunking.
- The app container includes health checks in both Dockerfile and docker-compose.
