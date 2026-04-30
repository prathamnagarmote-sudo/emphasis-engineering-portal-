'use client';

const VideoPlayer = ({ src }: { src: string }) => {
  return (
    <video
      className="w-full h-full object-cover"
      controls
      playsInline
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;