/**
 * Bike/dirtbike video filtering utility.
 * Filters videos based on title and description keywords.
 */

import { YouTubeVideo } from './youtubeChannelFeed';

// Keywords that indicate bike/dirtbike content
const BIKE_KEYWORDS = [
  'bike',
  'dirt bike',
  'dirtbike',
  'motocross',
  'mx',
  'enduro',
  'supercross',
  'motorcycle',
  'moto',
  'ride',
  'riding',
  'trail',
  'track',
  'jump',
  'wheelie',
  'crash',
  'race',
  'racing',
  'freestyle',
  'stunt',
  'rtr',
  'rtrkidd',
  'yamaha',
  'honda',
  'kawasaki',
  'suzuki',
  'ktm',
  'husqvarna',
  'beta',
  'gas gas',
  'sherco',
  '2 stroke',
  '4 stroke',
  '2-stroke',
  '4-stroke',
  'two stroke',
  'four stroke',
  'pit bike',
  'pitbike',
  'mini bike',
  'minibike',
];

// Force-include specific video IDs (override filter)
export const ALLOWLIST_VIDEO_IDS: string[] = [
  // Add video IDs here to force-include them
  // Example: 'dQw4w9WgXcQ',
];

// Force-exclude specific video IDs (override filter)
export const DENYLIST_VIDEO_IDS: string[] = [
  // Add video IDs here to force-exclude them
  // Example: 'abc123xyz',
];

/**
 * Checks if a video contains bike-related keywords in its title or description.
 */
function containsBikeKeywords(video: YouTubeVideo): boolean {
  const searchText = `${video.title} ${video.description}`.toLowerCase();
  
  return BIKE_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()));
}

/**
 * Filters videos to only include bike/dirtbike content.
 * Uses keyword matching on title and description, with allowlist/denylist overrides.
 */
export function filterBikeVideos(videos: YouTubeVideo[]): YouTubeVideo[] {
  return videos.filter(video => {
    // Check denylist first (highest priority)
    if (DENYLIST_VIDEO_IDS.includes(video.id)) {
      return false;
    }
    
    // Check allowlist (second priority)
    if (ALLOWLIST_VIDEO_IDS.includes(video.id)) {
      return true;
    }
    
    // Default: filter by keywords
    return containsBikeKeywords(video);
  });
}
