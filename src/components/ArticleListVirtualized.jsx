import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ArticleItem from "./ArticleItem";

const ESTIMATED_ROW_SIZE = 120;

export default function ArticleListVirtualized({ stories }) {
  const parentRef = useRef(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: stories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_SIZE,
    overscan: 6,
  });

  return (
    <section
      className="virtual-list"
      data-testid="article-list"
      ref={parentRef}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const story = stories[virtualItem.index];

          return (
            <ArticleItem
              key={story.id}
              story={story}
              style={{
                left: 0,
                position: "absolute",
                top: 0,
                transform: `translateY(${virtualItem.start}px)`,
                width: "100%",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
