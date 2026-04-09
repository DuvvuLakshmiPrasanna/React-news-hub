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
  { flushIntervalMs = 80, onBatch } = {},
) {
  const response = await fetch(TOP_STORIES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch top story ids')
  }

  const ids = await response.json()
  const selected = ids.slice(0, limit)
  const stories = []
  const pendingBatch = []

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

  await Promise.all(
    selected.map(async (id) => {
      const story = await fetchStoryById(id)
      if (!story) {
        return
      }

      stories.push(story)
      if (onBatch) {
        pendingBatch.push(story)
        scheduleFlush()
      }
    }),
  )

  if (flushTimer) {
    clearTimeout(flushTimer)
  }
  flushPending()

  return stories
}

export async function fetchTopStories(limit = 500) {
  return fetchTopStoriesProgressive(limit)
}
