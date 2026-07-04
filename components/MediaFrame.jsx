import Image from "next/image";

export default function MediaFrame({
  image,
  video,
  alt = "media",
  className = "",
  imageClassName = "object-cover",
  overlay = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}) {
  if (!image && !video) {
    return null;
  }

  return (
    <div className={`group relative overflow-hidden bg-slate-950 image-shadow transition-transform duration-700 ease-out ${className}`}>
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="dynamic-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          className={`${imageClassName} transition-transform duration-700 ease-out group-hover:scale-105`}
        />
      )}

      {overlay ? (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
      ) : null}
    </div>
  );
}
