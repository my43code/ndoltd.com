"use client";

import { useState } from "react";

export default function VideoPlayer({ src, title }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src) return null;

  if (error) {
    return (
      <div className="w-full h-52 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-300">
        <div className="text-center">
          <p className="text-slate-600 font-medium">Video cannot be loaded</p>
          <p className="text-sm text-slate-500 mt-1">The video file may be incompatible or too large</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-52 bg-black rounded-2xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-sm">Loading video...</div>
        </div>
      )}
      <video
        controls
        className="w-full h-full object-cover"
        title={title || "Video player"}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
