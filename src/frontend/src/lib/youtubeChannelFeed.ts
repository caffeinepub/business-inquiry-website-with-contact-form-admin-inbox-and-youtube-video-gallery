/**
 * YouTube channel feed utility for fetching videos from a channel handle.
 * Uses YouTube's RSS feed which doesn't require API authentication.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

/**
 * Fetches the channel ID for a given YouTube handle.
 * This uses a workaround by fetching the channel page and extracting the ID.
 */
async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  try {
    // Remove @ if present and trim
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim().slice(1) : handle.trim();
    
    // URL-encode the handle to safely handle special characters like dots
    const encodedHandle = encodeURIComponent(cleanHandle);
    
    // Fetch the channel page
    const channelUrl = `https://www.youtube.com/@${encodedHandle}`;
    const response = await fetch(channelUrl, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch channel page (${channelUrl}):`, response.status, response.statusText);
      return null;
    }
    
    const html = await response.text();
    
    // Check if we got an error page
    if (html.includes('This page isn\'t available') || html.includes('404')) {
      console.error('Channel not found - YouTube returned 404 page');
      return null;
    }
    
    // Extract channel ID from the HTML
    // Look for the RSS feed link which contains the channel ID
    const rssMatch = html.match(/https:\/\/www\.youtube\.com\/feeds\/videos\.xml\?channel_id=([^"&]+)/);
    if (rssMatch && rssMatch[1]) {
      return rssMatch[1];
    }
    
    // Alternative: look for channelId in the page data
    const channelIdMatch = html.match(/"channelId":"([^"]+)"/);
    if (channelIdMatch && channelIdMatch[1]) {
      return channelIdMatch[1];
    }
    
    // Another alternative: look for externalId
    const externalIdMatch = html.match(/"externalId":"([^"]+)"/);
    if (externalIdMatch && externalIdMatch[1]) {
      return externalIdMatch[1];
    }
    
    console.error('Could not extract channel ID from page HTML');
    return null;
  } catch (error) {
    console.error('Error fetching channel ID:', error);
    return null;
  }
}

/**
 * Parses YouTube RSS feed XML and extracts video information.
 */
function parseRSSFeed(xmlText: string): YouTubeVideo[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parse errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML parsing error:', parseError.textContent);
      return [];
    }
    
    const entries = xmlDoc.querySelectorAll('entry');
    const videos: YouTubeVideo[] = [];
    
    entries.forEach((entry) => {
      const videoId = entry.querySelector('videoId')?.textContent;
      const title = entry.querySelector('title')?.textContent;
      const published = entry.querySelector('published')?.textContent;
      
      // Get description from media:group > media:description
      const mediaGroup = entry.querySelector('group');
      const description = mediaGroup?.querySelector('description')?.textContent || '';
      
      // Get thumbnail from media:group > media:thumbnail
      const thumbnail = mediaGroup?.querySelector('thumbnail')?.getAttribute('url') || '';
      
      if (videoId && title && published) {
        videos.push({
          id: videoId,
          title,
          description,
          publishedAt: published,
          thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        });
      }
    });
    
    return videos;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
}

/**
 * Fetches the latest videos from a YouTube channel using its handle.
 * @param handle - YouTube channel handle (e.g., "@RTR.Kidddddd")
 * @returns Array of video metadata
 */
export async function fetchChannelVideos(handle: string): Promise<YouTubeVideo[]> {
  // Validate handle before attempting fetch
  if (!handle || handle.trim().length === 0) {
    throw new Error('YouTube channel handle is empty');
  }

  const trimmedHandle = handle.trim();
  
  if (trimmedHandle === '@' || trimmedHandle.length < 2) {
    throw new Error('YouTube channel handle is invalid');
  }

  try {
    // First, get the channel ID from the handle
    const channelId = await getChannelIdFromHandle(trimmedHandle);
    
    if (!channelId) {
      throw new Error(`Could not resolve channel ID for handle: ${trimmedHandle}. The channel may not exist or YouTube may be blocking the request.`);
    }
    
    // Fetch the RSS feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed (status ${response.status}). YouTube may be rate-limiting requests.`);
    }
    
    const xmlText = await response.text();
    
    if (!xmlText || xmlText.trim().length === 0) {
      throw new Error('Received empty RSS feed from YouTube');
    }
    
    const videos = parseRSSFeed(xmlText);
    
    return videos;
  } catch (error) {
    // Re-throw with context preserved
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error fetching channel videos');
  }
}
