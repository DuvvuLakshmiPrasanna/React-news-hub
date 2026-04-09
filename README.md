# React News Hub

React News Hub is a production-style Hacker News reader built with React and Vite. The project is intentionally focused on frontend performance: fast initial paint, compact DOM size, low bundle overhead, and a testable deployment path.

## Overview

The application fetches the top Hacker News stories, renders them in a virtualized feed, and adds the kind of interface polish that makes performance work visible instead of theoretical. It is designed to demonstrate both product quality and engineering discipline.

The current implementation includes:

1. Progressive story loading so content appears before every request finishes.
2. Virtualized rendering for the article list so the DOM stays small.
3. Debounced title search and score sorting.
4. Responsive hero image delivery with explicit dimensions and responsive sources.
5. Lazy-loaded performance notes panel.
6. Fallback story links when an external URL is missing.
7. Docker and Nginx packaging for containerized deployment.
8. Bundle verification output through stats.html.

## Tech Stack

1. React 19
2. Vite 8
3. @tanstack/react-virtual
4. Lodash utilities for debounce and sorting
5. Playwright
6. ESLint
7. Docker and Nginx

## Features

1. Fetches up to 500 top Hacker News stories.
2. Loads stories progressively in batches while the request stream continues in the background.
3. Searches by title with a debounced input to avoid unnecessary render churn.
4. Sorts stories by score.
5. Keeps the rendered article count low with virtualization.
6. Reuses a single date formatter for efficient timestamp rendering.
7. Shows a responsive hero image with width, height, srcset, and sizes.
8. Includes a lazily loaded insight panel that explains the performance approach.
9. Falls back to the Hacker News item page when a story has no outbound URL.

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

## Architecture

The main data flow is split into a few focused layers:

1. [src/api/newsApi.js](src/api/newsApi.js) fetches the Hacker News top story IDs and resolves story details concurrently.
2. [src/App.jsx](src/App.jsx) handles loading state, debounced search, sorting, metrics, and the hero section.
3. [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx) renders only the visible stories plus a small overscan window.
4. [src/components/ArticleItem.jsx](src/components/ArticleItem.jsx) keeps row rendering simple and memoized.
5. [src/utils/dateFormatter.js](src/utils/dateFormatter.js) centralizes timestamp formatting.
6. [src/components/PerformanceInsights.jsx](src/components/PerformanceInsights.jsx) is lazy-loaded to reduce initial JavaScript cost.

Build-time bundle analysis is configured in [vite.config.js](vite.config.js), which writes stats.html through the Rollup visualizer.

## Performance Work

The optimization history is documented in [PERFORMANCE.md](PERFORMANCE.md). It covers:

1. Concurrent story fetching instead of sequential requests.
2. Virtualization to reduce DOM pressure and improve interaction responsiveness.
3. Narrow lodash imports instead of a full package import.
4. Memoized item rendering and shared date formatting.
5. Responsive hero image sizing to reduce layout shift.
6. Lazy loading for secondary UI.

## Getting Started

### Prerequisites

1. Node.js 20 or newer
2. npm 10 or newer

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Vite prints the local URL in the terminal, usually http://localhost:5173.

### Production preview

```bash
npm run build
npm run preview
```

## Available Scripts

| Command              | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| npm run dev          | Start the Vite development server.               |
| npm run build        | Create a production build.                       |
| npm run preview      | Preview the production build locally.            |
| npm run lint         | Run ESLint across the project.                   |
| npm run test:e2e     | Run the Playwright end-to-end suite.             |
| npm run verify:build | Validate build artifacts and bundle constraints. |
| npm run deploy       | Build and publish dist to the gh-pages branch.   |

## Verification

Before submitting changes, run:

```bash
npm run lint
npm run build
npm run verify:build
npm run test:e2e
```

The build verification script in [scripts/verify-build.mjs](scripts/verify-build.mjs) checks that:

1. dist exists.
2. stats.html exists.
3. At least two JavaScript chunks are generated.
4. Unexpected bundle patterns are not present.

## End-to-End Tests

The Playwright suite in [tests/news-hub.spec.js](tests/news-hub.spec.js) validates the user-facing behavior that matters most:

1. The hero image exposes the expected optimization attributes.
2. The article list stays virtualized and does not render the full dataset at once.
3. Score sorting works.
4. Title filtering works.
5. Stories without an outbound URL fall back to the Hacker News item link.

Run the tests with:

```bash
npm run test:e2e
```

## Docker

The repository includes a multi-stage [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml) for production-style hosting behind Nginx.

Start the container locally:

```bash
docker compose up -d --build
```

Check the service:

```bash
docker compose ps
```

Stop the container:

```bash
docker compose down
```

By default, the app is exposed on http://localhost:3000.

## Deployment

GitHub Pages deployment is already wired up for branch-based publishing.

1. The production build is emitted to dist.
2. npm run deploy publishes that output to the gh-pages branch.
3. [vite.config.js](vite.config.js) uses the base path /React-news-hub/ so the app works correctly on GitHub Pages.

One-time setup in GitHub:

1. Push the repository to GitHub.
2. Open repository Settings, then Pages.
3. Select deploy from a branch.
4. Choose gh-pages and the root folder.

To publish a new version:

```bash
npm run deploy
```

## Notes

1. The project does not currently rely on environment variables for local development.
2. The repository is documented around the optimized implementation, while the performance audit preserves the baseline-to-final comparison.
3. The tests and verification script are intended to protect the performance characteristics, not just the UI.
