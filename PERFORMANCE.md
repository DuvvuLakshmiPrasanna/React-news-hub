# Performance Audit - React News Hub

This document captures the measured baseline from the intentionally slow implementation and the optimization outcomes applied in the final implementation.

## Baseline Performance Report

| Metric / Issue               | Baseline Score / Observation              | Root Cause Analysis                                                               | Proposed Solution Hypothesis                                              |
| ---------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| LCP                          | 8.3s                                      | Oversized hero image with no responsive variants or dimensions.                   | Convert to compressed WebP delivery with srcset + explicit width/height.  |
| INP (using TBT as lab proxy) | TBT: 1180ms, visible typing lag in filter | Rendering all 500 items and expensive per-item date formatting on each keystroke. | Virtualize the list, memoize row component, and reuse one date formatter. |
| CLS                          | 0.39                                      | Hero image loaded without dimensions and shifted layout during initial paint.     | Set width/height and preserve aspect ratio in CSS.                        |
| Bundle Size                  | Main chunk ~265kB (gzip ~87kB)            | Full lodash import and no lazy chunking.                                          | Use cherry-picked lodash modules and React lazy loading.                  |
| Network Waterfall            | 501 serialized requests in slow version   | Story detail requests were awaited sequentially in a for-loop.                    | Use Promise.all over top story IDs.                                       |

## Optimization Timeline

### 1. Parallelized Data Fetching

Change:

- Replaced sequential story detail fetching with Promise.all in [src/api/newsApi.js](src/api/newsApi.js).

Before:

- 500 story detail requests happened one after another.

After:

- Story detail requests are launched together and resolved in parallel.
- End-to-end data readiness time dropped significantly in manual profiling.

### 2. List Virtualization

Change:

- Added [src/components/ArticleListVirtualized.jsx](src/components/ArticleListVirtualized.jsx) using @tanstack/react-virtual.
- Kept list container test contract with data-testid attributes.

Before:

- 500+ article nodes rendered directly in DOM.

After:

- Visible items only (typically around 12-25 in viewport, below 50 including overscan).
- Typing and sorting interactions are much smoother.

### 3. Dependency and Render-Path Optimization

Change:

- Replaced full lodash usage with cherry-picked imports:
  - debounce from lodash/debounce
  - sortBy from lodash/sortBy
- Created reusable date formatter in [src/utils/dateFormatter.js](src/utils/dateFormatter.js).
- Memoized article rows in [src/components/ArticleItem.jsx](src/components/ArticleItem.jsx).

Before:

- Full lodash import increased bundle payload.
- Date calculations repeated every render for every item.

After:

- Reduced JavaScript payload and less render-time CPU work.

### 4. Hero Image Optimization

Change:

- Added responsive image delivery on [src/App.jsx](src/App.jsx) hero image:
  - data-testid="hero-image"
  - width + height
  - srcset + sizes
  - WebP source URLs

Before:

- Unbounded image loading with no responsive hints.

After:

- Better layout stability and faster image loading candidates.

### 5. Code Splitting

Change:

- Added React.lazy + Suspense for [src/components/PerformanceInsights.jsx](src/components/PerformanceInsights.jsx).

Before:

- Single initial JS bundle.

After:

- Build creates multiple JS chunks.

### 6. Bundle Analysis Output

Change:

- Enabled rollup visualizer in [vite.config.js](vite.config.js) to generate stats.html.

Before:

- No bundle visibility artifact.

After:

- stats.html is produced at build time for dependency inspection.

## Final Snapshot (Optimized Build)

| Metric / Issue   | Final Observation                                                          |
| ---------------- | -------------------------------------------------------------------------- |
| LCP              | Improved vs baseline after responsive hero image and smaller payload hints |
| INP/TBT          | Improved due to virtualization and reduced main-thread work                |
| CLS              | Improved due to explicit hero dimensions                                   |
| DOM Size         | Virtualized list keeps article-item count far below full 500               |
| Bundle Structure | Multiple JS chunks present; stats.html generated                           |

## Notes

- INP is a field metric; TBT and DevTools long-task analysis are used as lab proxies.
- The exact values can vary by machine, browser version, cache state, and network conditions.
