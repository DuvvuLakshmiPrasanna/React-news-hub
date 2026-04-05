const TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json'
const STORY_URL = 'https://hacker-news.firebaseio.com/v0/item'

export async function fetchTopStories(limit = 500) {
  const response = await fetch(TOP_STORIES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch top story ids')
  }

  const ids = await response.json()
  const selected = ids.slice(0, limit)

  const stories = await Promise.all(
    selected.map(async (id) => {
      const itemResponse = await fetch(`${STORY_URL}/${id}.json`)
      if (!itemResponse.ok) {
        return null
      }
      const item = await itemResponse.json()
      return item?.type === 'story' ? item : null
    }),
  )

  return stories.filter(Boolean)
}
