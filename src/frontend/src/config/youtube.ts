/**
 * Centralized YouTube channel configuration and validation.
 * Single source of truth for the RTRKidd YouTube channel.
 */

// The official YouTube channel URL for RTRKidd
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@rtr.kidddddd?si=4MgPonZJULUZTNwi';

export interface HandleValidationResult {
  isValid: boolean;
  normalizedHandle: string | null;
  errorMessage: string | null;
}

/**
 * Extracts the channel handle from a YouTube URL or returns the handle if already normalized.
 * @param input - YouTube URL or handle string
 * @returns Extracted handle or null if invalid
 */
function extractHandleFromUrl(input: string): string | null {
  const trimmed = input.trim();
  
  // If it's already a handle (starts with @), return it
  if (trimmed.startsWith('@')) {
    return trimmed;
  }
  
  // Try to extract from URL patterns
  try {
    // Match patterns like:
    // - https://youtube.com/@handle
    // - https://www.youtube.com/@handle
    // - youtube.com/@handle
    // - @handle (already handled above)
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^/?&#]+)/i;
    const match = trimmed.match(urlPattern);
    
    if (match && match[1]) {
      return `@${match[1]}`;
    }
    
    // If no match and doesn't start with @, return null
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Validates and normalizes a YouTube channel handle or URL.
 * @param input - Raw handle string or URL to validate
 * @returns Validation result with normalized handle or error message
 */
export function validateAndNormalizeHandle(input: string): HandleValidationResult {
  // Check for empty or whitespace-only
  if (!input || input.trim().length === 0) {
    return {
      isValid: false,
      normalizedHandle: null,
      errorMessage: 'YouTube channel handle is empty. Please configure a valid handle.',
    };
  }

  // Extract handle from URL or use as-is
  const handle = extractHandleFromUrl(input);
  
  if (!handle) {
    return {
      isValid: false,
      normalizedHandle: null,
      errorMessage: 'Could not extract a valid YouTube channel handle from the provided input.',
    };
  }

  // Check for whitespace within the handle
  if (/\s/.test(handle)) {
    return {
      isValid: false,
      normalizedHandle: null,
      errorMessage: 'YouTube channel handle contains whitespace. Handles must be continuous text.',
    };
  }

  // Check if it's just '@' with nothing after
  if (handle === '@') {
    return {
      isValid: false,
      normalizedHandle: null,
      errorMessage: 'YouTube channel handle is incomplete. Please provide a full handle like @ChannelName.',
    };
  }

  // Check minimum length (@ + at least 1 character)
  if (handle.length < 2) {
    return {
      isValid: false,
      normalizedHandle: null,
      errorMessage: 'YouTube channel handle is too short. Please provide a valid handle.',
    };
  }

  return {
    isValid: true,
    normalizedHandle: handle,
    errorMessage: null,
  };
}

/**
 * Gets the configured YouTube channel handle with validation.
 * @returns Validation result for the configured handle
 */
export function getYouTubeChannelHandle(): HandleValidationResult {
  return validateAndNormalizeHandle(YOUTUBE_CHANNEL_URL);
}

/**
 * Gets the raw configured value (for display purposes).
 */
export function getRawChannelHandle(): string {
  return YOUTUBE_CHANNEL_URL;
}
