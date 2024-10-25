import { useEffect, useRef, useState } from 'react';

interface BackgroundPlayerProps {
  url: string;
}

export default function BackgroundPlayer({ url }: BackgroundPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error state when URL changes
    setError('');

    // Cancel any pending play promise
    if (playPromiseRef.current) {
      video.pause();
    }

    // Load and play the video
    video.load();
    
    const startPlayback = async () => {
      try {
        playPromiseRef.current = video.play();
        await playPromiseRef.current;
        playPromiseRef.current = null;
      } catch (error) {
        // Only set error if it's not an abort error
        if ((error as any)?.code !== 20) {
          console.error('Video playback error:', error);
          setError('Failed to play video');
        }
      }
    };

    startPlayback();

    // Cleanup function
    return () => {
      if (playPromiseRef.current) {
        video.pause();
      }
      playPromiseRef.current = null;
    };
  }, [url]);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    setError(`Failed to load video: ${target.error?.message || 'Unknown error'}`);
    console.error('Video loading error for URL:', url, target.error);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {error ? (
        <div className="flex h-full items-center justify-center text-white/50">
          {error}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={handleError}
          className="h-full w-full object-cover"
        >
          <source 
            src={url} 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}