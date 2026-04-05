import { memo } from "react";
import { formatUnixTime } from "../utils/dateFormatter";

function ArticleItem({ story, style }) {
  return (
    <article className="article-item" data-testid="article-item" style={style}>
      <h2 className="article-title">{story.title || "Untitled story"}</h2>
      <p className="article-meta">
        By {story.by || "unknown"} | Score: {story.score || 0} | Posted:{" "}
        {formatUnixTime(story.time || 0)}
      </p>
      <a
        className="article-link"
        href={story.url || "#"}
        rel="noreferrer"
        target="_blank"
      >
        Open article
      </a>
    </article>
  );
}

export default memo(ArticleItem);
