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

function splitIntoBatches(items, batchSize) {
  const batches = []
  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize))
  }
  return batches
}

export async function fetchTopStoriesProgressive(
  limit = 500,
  { batchSize = 40, onBatch } = {},
) {
  const response = await fetch(TOP_STORIES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch top story ids')
  }

  const ids = await response.json()
  const selected = ids.slice(0, limit)
  const stories = []

  const batches = splitIntoBatches(selected, Math.max(1, batchSize))

  for (const batch of batches) {
    const resolvedBatch = await Promise.all(batch.map((id) => fetchStoryById(id)))
    const validStories = resolvedBatch.filter(Boolean)
    stories.push(...validStories)

    if (onBatch) {
      onBatch(validStories)
    }
  }

  return stories
}

export async function fetchTopStories(limit = 500) {
  return fetchTopStoriesProgressive(limit)
}
