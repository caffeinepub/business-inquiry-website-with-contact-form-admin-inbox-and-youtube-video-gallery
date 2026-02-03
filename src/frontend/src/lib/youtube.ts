/**
 * Extracts a YouTube video ID from various URL formats or returns the ID if already provided
 * @param urlOrId - YouTube URL or video ID
 * @returns The video ID if valid, null otherwise
 */
export function getYouTubeEmbedId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return null;
  }

  const trimmed = urlOrId.trim();

  // If it's already just an ID (11 characters, alphanumeric with dashes/underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Try to parse as URL
    const url = new URL(trimmed);

    // Handle youtube.com/watch?v=VIDEO_ID
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      const videoId = url.searchParams.get('v');
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }

    // Handle youtu.be/VIDEO_ID
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.slice(1);
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }

    // Handle youtube.com/embed/VIDEO_ID
    if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
      const videoId = url.pathname.split('/')[2];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
  } catch {
    // Not a valid URL, return null
    return null;
  }

  return null;
}
