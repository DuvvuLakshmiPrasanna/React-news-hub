import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import sortBy from "lodash/sortBy";
import "./App.css";
import { fetchTopStoriesProgressive } from "./api/newsApi";
import ArticleListVirtualized from "./components/ArticleListVirtualized";

const PerformanceInsights = lazy(
  () => import("./components/PerformanceInsights"),
);

function App() {
  const [stories, setStories] = useState([]);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const debouncedSetQuery = debounce((value) => setQuery(value), 180);
    debouncedSetQuery(queryInput);

    return () => {
      debouncedSetQuery.cancel();
    };
  }, [queryInput]);

  useEffect(() => {
    let isActive = true;

    const loadStories = async () => {
      setLoading(true);
      setError("");
      setStories([]);

      try {
        await fetchTopStoriesProgressive(500, {
          batchSize: 40,
          onBatch: (batch) => {
            if (!isActive || batch.length === 0) {
              return;
            }

            setStories((previousStories) => [...previousStories, ...batch]);
          },
        });
      } catch {
        if (isActive) {
          setError("Failed to load stories.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadStories();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredStories = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return stories;
    }

    return stories.filter((story) =>
      (story?.title || "").toLowerCase().includes(value),
    );
  }, [stories, query]);

  const metrics = useMemo(() => {
    const storyCount = stories.length;
    const filteredCount = filteredStories.length;
    const highestScore = stories.reduce(
      (maxScore, story) => Math.max(maxScore, story?.score || 0),
      0,
    );
    const averageScore = storyCount
      ? Math.round(
          stories.reduce((total, story) => total + (story?.score || 0), 0) /
            storyCount,
        )
      : 0;

    return {
      storyCount,
      filteredCount,
      highestScore,
      averageScore,
    };
  }, [stories, filteredStories.length]);

  const onSortByScore = () => {
    const sorted = sortBy(stories, (story) => -(story?.score || 0));
    setStories(sorted);
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />

      <header className="topbar">
        <div>
          <p className="eyebrow">Partnr News Intelligence</p>
          <h1>React News Hub</h1>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          Live feed
        </div>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <p className="hero-kicker">High signal. Low friction.</p>
          <h2>Editorial reading for fast-moving teams.</h2>
          <p className="hero-description">
            A newsroom-style interface that keeps the focus on scanning,
            sorting, and finding the story that matters before the rest of the
            noise.
          </p>

          <div className="hero-actions">
            <label className="search-field">
              <span>Search stories</span>
              <input
                className="search-input"
                onChange={(event) => setQueryInput(event.target.value)}
                placeholder="Filter by title"
                type="text"
                value={queryInput}
              />
            </label>

            <div className="action-buttons">
              <button
                className="sort-button"
                onClick={onSortByScore}
                type="button"
              >
                Sort by score
              </button>
              <button
                className="insights-button"
                onClick={() => setShowInsights((value) => !value)}
                type="button"
              >
                {showInsights ? "Hide" : "Show"} notes
              </button>
            </div>
          </div>

          <div className="metrics-grid" aria-label="article metrics">
            <article className="metric-card">
              <span>Total stories</span>
              <strong>{metrics.storyCount}</strong>
            </article>
            <article className="metric-card">
              <span>Visible results</span>
              <strong>{metrics.filteredCount}</strong>
            </article>
            <article className="metric-card">
              <span>Highest score</span>
              <strong>{metrics.highestScore}</strong>
            </article>
            <article className="metric-card">
              <span>Average score</span>
              <strong>{metrics.averageScore}</strong>
            </article>
          </div>
        </div>

        <div className="hero-visual">
          <img
            alt="Breaking news hero"
            className="hero-image"
            data-testid="hero-image"
            height="540"
            sizes="(max-width: 768px) 100vw, 1200px"
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=75&fm=webp"
            srcSet="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=640&q=70&fm=webp 640w, https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=960&q=72&fm=webp 960w, https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=75&fm=webp 1200w"
            width="1200"
          />

          <div className="hero-overlay">
            <span>Performance tuned</span>
            <strong>Virtualized reading experience</strong>
            <p>
              Keeps the DOM compact while preserving a premium, magazine-style
              layout.
            </p>
          </div>
        </div>
      </section>

      {loading && stories.length === 0 ? (
        <p className="status status-loading">Loading stories...</p>
      ) : null}
      {loading && stories.length > 0 ? (
        <p className="status status-loading status-soft-loading">
          Loaded {stories.length} stories. Fetching more in the background...
        </p>
      ) : null}
      {error ? <p className="status status-error">{error}</p> : null}

      {showInsights ? (
        <Suspense fallback={<p className="status">Loading insights...</p>}>
          <PerformanceInsights />
        </Suspense>
      ) : null}

      {error || stories.length === 0 ? null : (
        <ArticleListVirtualized stories={filteredStories} />
      )}
    </main>
  );
}

export default App;
