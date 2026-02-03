import { useQuery } from '@tanstack/react-query';
import { fetchChannelVideos, YouTubeVideo } from '../lib/youtubeChannelFeed';
import { validateAndNormalizeHandle, type HandleValidationResult } from '../config/youtube';

/**
 * React Query hook for fetching YouTube channel videos with validation.
 * @param input - YouTube channel handle or URL (e.g., "@RTR.Kidddddd" or full URL)
 */
export function useYouTubeChannelVideos(input: string) {
  // Validate and normalize handle/URL before attempting query
  const validation: HandleValidationResult = validateAndNormalizeHandle(input);

  return useQuery<YouTubeVideo[], Error>({
    queryKey: ['youtubeChannelVideos', validation.normalizedHandle || input],
    queryFn: async () => {
      // If validation failed, throw the error immediately
      if (!validation.isValid || !validation.normalizedHandle) {
        throw new Error(validation.errorMessage || 'Invalid YouTube channel handle or URL');
      }
      
      return fetchChannelVideos(validation.normalizedHandle);
    },
    // Only enable query if handle is valid
    enabled: validation.isValid && !!validation.normalizedHandle,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    // Provide better error context
    meta: {
      handleValidation: validation,
    },
  });
}
