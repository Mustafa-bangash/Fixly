export default function ImagePlaceholder({ src, alt, ratio = '4/3', label = 'Image placeholder' }) {
  if (src) {
    // show the real image if we have one, otherwise the dashed placeholder box
    return <img className="block w-full rounded-xl object-cover" src={src} alt={alt} style={{ aspectRatio: ratio }} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-dash-line bg-navy-light p-4 text-center text-[14px] text-muted"
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={alt}
    >
      <b className="text-[12px] font-bold uppercase tracking-[0.6px] text-navy">{label}</b>
      <span>{alt}</span>
    </div>
  );
}
