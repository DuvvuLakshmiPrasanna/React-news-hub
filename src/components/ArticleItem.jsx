import { memo } from "react";
import { formatUnixTime } from "../utils/dateFormatter";

function ArticleItem({ story, style }) {
  const score = story.score || 0;
  const articleHref = story?.url
    ? story.url
    : `https://news.ycombinator.com/item?id=${story?.id || ""}`;

  return (
    <article className="article-item" data-testid="article-item" style={style}>
      <h2 className="article-title">{story.title || "Untitled story"}</h2>

      <div className="article-meta-row">
        <span className="article-score">{score}</span>
        <p className="article-meta">
          By {story.by || "unknown"} · Posted {formatUnixTime(story.time || 0)}
        </p>
      </div>

      <a
        aria-label={`Open article: ${story.title || "Untitled story"}`}
        className="article-link"
        href={articleHref}
        rel="noreferrer"
        target="_blank"
      >
        Open article
      </a>
    </article>
  );
}

export default memo(ArticleItem);
