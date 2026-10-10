import './ImagePlaceholder.css';

// Shows a real picture when `src` is given. Otherwise it shows the dashed placeholder box
// from the prototype (small label + description of the picture that should go here).
export default function ImagePlaceholder({
  src,
  alt,
  ratio = '4/3',
  label = 'Image placeholder',
  isVideo = false,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = false,
  playsInline = false,
  videoRef,
}) {
  const hasVideoSource = isVideo || (typeof src === 'string' && /\.(mp4|webm|ogg|mov)$/i.test(src));

  if (src && hasVideoSource) {
    return (
      <video
        ref={videoRef}
        className={isVideo ? 'photo video' : 'photo'}
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
        style={{ aspectRatio: ratio }}
        aria-label={alt}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (src) {
    return <img className="photo" src={src} alt={alt} style={{ aspectRatio: ratio }} />;
  }
  return (
    <div className="placeholder" style={{ aspectRatio: ratio }} role="img" aria-label={alt}>
      <b>{label}</b>
      <span>{alt}</span>
    </div>
  );
}
