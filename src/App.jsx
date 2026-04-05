import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import "./App.css";

const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const STORY_URL = "https://hacker-news.firebaseio.com/v0/item";

function App() {
  const [stories, setStories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(TOP_STORIES_URL);
        const ids = await response.json();
        const results = [];

        // Intentional anti-pattern: sequential requests in a loop.
        for (const id of ids.slice(0, 500)) {
          const storyResponse = await fetch(`${STORY_URL}/${id}.json`);
          const story = await storyResponse.json();
          if (story) {
            results.push(story);
          }
        }

        setStories(results);
      } catch {
        setError("Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
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
    const sorted = _.sortBy(stories, (story) => -(story?.score || 0));
    setStories(sorted);
  };

  return (
    <main className="app-shell">
      <img
        alt="Breaking news hero"
        className="hero-image"
        src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=2800&q=100"
      />

      <header className="header">
        <h1>React News Hub (Slow Baseline)</h1>
        <p>
          Top 500 stories from Hacker News with intentional performance issues.
        </p>
      </header>

      <section className="controls">
        <input
          className="search-input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by title"
          type="text"
          value={query}
        />
        <button className="sort-button" onClick={onSortByScore} type="button">
          Sort by score
        </button>
      </section>

      {loading ? (
        <p className="status">Loading 500 stories in sequence...</p>
      ) : null}
      {error ? <p className="status error">{error}</p> : null}

      <ul className="article-list" data-testid="article-list">
        {filteredStories.map((story) => (
          <li
            className="article-item"
            data-testid="article-item"
            key={story.id}
          >
            <h2 className="article-title">{story.title || "Untitled"}</h2>
            <p className="article-meta">
              By {story.by || "unknown"} | Score: {story.score || 0} | Posted:{" "}
              {new Date((story.time || 0) * 1000).toLocaleString()}
            </p>
            <a
              className="article-link"
              href={story.url || "#"}
              rel="noreferrer"
              target="_blank"
            >
              Read article
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
