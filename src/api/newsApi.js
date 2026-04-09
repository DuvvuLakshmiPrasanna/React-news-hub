const TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json'
const STORY_URL = 'https://hacker-news.firebaseio.com/v0/item'

async function fetchStoryById(id) {
  const itemResponse = await fetch(`${STORY_URL}/${id}.json`)
  if (!itemResponse.ok) {
    return null
  }

  const item = await itemResponse.json()
  return item?.type === 'story' ? item : null
}

export async function fetchTopStoriesProgressive(
  limit = 500,
  { concurrency = 24, flushIntervalMs = 80, onBatch } = {},
) {
  const response = await fetch(TOP_STORIES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch top story ids')
  }

  const ids = await response.json()
  const selected = ids
  const stories = []
  const pendingBatch = []
  const resolvedStories = new Array(selected.length)
  const resolvedFlags = new Array(selected.length).fill(false)

  const maxConcurrent = Math.max(1, Math.min(concurrency, selected.length))
  let cursor = 0
  let collectedCount = 0
  let nextFlushIndex = 0

  const flushPending = () => {
    if (!onBatch || pendingBatch.length === 0) {
      return
    }

    onBatch(pendingBatch.splice(0, pendingBatch.length))
  }

  let flushTimer = null
  const scheduleFlush = () => {
    if (!onBatch || flushTimer) {
      return
    }

    flushTimer = setTimeout(() => {
      flushTimer = null
      flushPending()
    }, flushIntervalMs)
  }

  const flushReadyStories = () => {
    while (nextFlushIndex < resolvedStories.length && resolvedFlags[nextFlushIndex]) {
      const story = resolvedStories[nextFlushIndex]
      if (story) {
        stories.push(story)
        if (onBatch) {
          pendingBatch.push(story)
          scheduleFlush()
        }
      }
      nextFlushIndex += 1
    }
  }

  const nextIndex = () => {
    if (collectedCount >= limit) {
      return null
    }

    const currentIndex = cursor
    cursor += 1
    if (currentIndex >= selected.length) {
      return null
    }

    return currentIndex
  }

  const workers = Array.from({ length: maxConcurrent }, async () => {
    while (true) {
      const currentIndex = nextIndex()
      if (currentIndex === null) {
        return
      }

      const story = await fetchStoryById(selected[currentIndex])
      resolvedFlags[currentIndex] = true
      resolvedStories[currentIndex] = story

      if (story) {
        collectedCount += 1
      }

      flushReadyStories()

      if (collectedCount >= limit) {
        return
      }
    }
  })

  await Promise.all(workers)

  if (flushTimer) {
    clearTimeout(flushTimer)
  }
  flushPending()

  return stories.slice(0, limit)
}

export async function fetchTopStories(limit = 500) {
  return fetchTopStoriesProgressive(limit)
}
