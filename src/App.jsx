import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import sortBy from "lodash/sortBy";
import "./App.css";
import { fetchTopStories } from "./api/newsApi";
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
    const loadStories = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await fetchTopStories(500);
        setStories(results);
      } catch {
        setError("Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };

    loadStories();
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

  const onSortByScore = () => {
    const sorted = sortBy(stories, (story) => -(story?.score || 0));
    setStories(sorted);
  };

  return (
    <main className="app-shell">
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

      <header className="header">
        <p className="eyebrow">High-Performance React Build</p>
        <h1>React News Hub</h1>
        <p>
          Top 500 Hacker News stories with optimized rendering for LCP, INP, and
          CLS stability.
        </p>
      </header>

      <section className="controls">
        <input
          className="search-input"
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="Filter by title"
          type="text"
          value={queryInput}
        />
        <button className="sort-button" onClick={onSortByScore} type="button">
          Sort by score
        </button>
        <button
          className="insights-button"
          onClick={() => setShowInsights((value) => !value)}
          type="button"
        >
          {showInsights ? "Hide" : "Show"} optimization notes
        </button>
      </section>

      {loading ? (
        <p className="status">Loading stories in parallel...</p>
      ) : null}
      {error ? <p className="status error">{error}</p> : null}

      {showInsights ? (
        <Suspense fallback={<p className="status">Loading insights...</p>}>
          <PerformanceInsights />
        </Suspense>
      ) : null}

      {loading || error ? null : (
        <ArticleListVirtualized stories={filteredStories} />
      )}
    </main>
  );
}

export default App;
