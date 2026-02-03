import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Video as VideoIcon, AlertTriangle } from 'lucide-react';
import { useYouTubeChannelVideos } from '../hooks/useYouTubeChannelVideos';
import { filterBikeVideos } from '../lib/bikeVideoFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { getYouTubeChannelHandle, getRawChannelHandle } from '../config/youtube';

export default function VideosPage() {
  // Get validated handle from centralized config
  const handleConfig = getYouTubeChannelHandle();
  const rawInput = getRawChannelHandle();
  
  // Use the raw input (validation and normalization happens inside the hook)
  const { data: videos, isLoading, isError, error } = useYouTubeChannelVideos(rawInput);

  // Filter to only bike videos
  const bikeVideos = videos ? filterBikeVideos(videos) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">RTRKidd Dirtbike Videos</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Check out the latest dirtbike action, tricks, and trail rides from RTRKidd.
        </p>
      </div>

      {/* Handle Configuration Error */}
      {!handleConfig.isValid && (
        <Alert variant="destructive" className="mx-auto max-w-2xl mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            {handleConfig.errorMessage || 'The YouTube channel is not configured correctly.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && handleConfig.isValid && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden border-2">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && handleConfig.isValid && (
        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to Load Videos</AlertTitle>
          <AlertDescription className="mt-2">
            {error?.message?.includes('Could not resolve channel ID') ? (
              <>
                Unable to find the YouTube channel. 
                This could mean the channel doesn't exist, the handle is incorrect, 
                or YouTube is blocking automated requests.
              </>
            ) : error?.message?.includes('rate-limiting') ? (
              <>
                YouTube is currently rate-limiting requests. Please try again in a few minutes.
              </>
            ) : (
              <>
                {error?.message || 'An unexpected error occurred while fetching videos. Please try again later.'}
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State (no bike videos found after filtering) */}
      {!isLoading && !isError && handleConfig.isValid && bikeVideos.length === 0 && videos && videos.length > 0 && (
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <VideoIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-semibold">No Bike Videos Found</h2>
          <p className="text-muted-foreground">
            No dirtbike videos were found in the channel feed. Check back later for new content!
          </p>
        </div>
      )}

      {/* Empty State (no videos at all) */}
      {!isLoading && !isError && handleConfig.isValid && videos && videos.length === 0 && (
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <VideoIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-semibold">No Videos Available</h2>
          <p className="text-muted-foreground">
            The channel doesn't have any videos yet, or they couldn't be loaded. Check back later!
          </p>
        </div>
      )}

      {/* Videos Grid */}
      {!isLoading && !isError && handleConfig.isValid && bikeVideos.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bikeVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden border-2 transition-all hover:shadow-xl hover:border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg leading-tight">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
