import podcastData from '@/content/podcasts/episodes.json'

export interface PodcastEpisode {
  id: string
  videoId: string
  title: Record<string, string>
  description: Record<string, string>
  date: string
}

/**
 * Podcast episodes — managed via Keystatic CMS (src/content/podcasts/episodes.json).
 * Thumbnails auto-generated from YouTube video ID.
 */
const episodes: PodcastEpisode[] = podcastData.episodes.map((ep, i) => ({
  id: `ep${String(i + 1).padStart(2, '0')}`,
  videoId: ep.videoId,
  title: {
    cs: ep.titleCs,
    de: ep.titleDe,
    en: ep.titleEn,
    ru: ep.titleRu,
  },
  description: {
    cs: ep.descriptionCs,
    de: ep.descriptionDe,
    en: ep.descriptionEn,
    ru: ep.descriptionRu,
  },
  date: ep.date,
}))

export { episodes }

export const playlistUrl = podcastData.playlistUrl

export function getEpisodes() {
  return [...episodes].sort((a, b) => a.date.localeCompare(b.date))
}

export function getThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
