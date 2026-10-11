import { useEffect, useRef } from 'react';
import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { STEPS, VIDEO } from './landingContent.js';
//the 5 steps and the video box, the data comes from landingContent
export default function HowItWorks() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => {
            if (error.name !== 'NotAllowedError') {
              console.error('Unable to play the landing page video:', error);
            }
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <h2 className="mt-7 mb-2 text-[20px] font-bold text-navy">How Fixly works</h2>
      <div className="grid grid-cols-2 gap-5 tablet:grid-cols-5">
        {STEPS.map((step, i) => (
          <div key={step.title}>
            <ImagePlaceholder src={step.image} alt={step.imageAlt} ratio="4/3" />
            <div className="mt-3 mb-2 grid h-10 w-10 place-items-center rounded-full bg-brand-light font-bold text-brand">
              {i + 1}
            </div>
            <b className="font-bold">{step.title}</b>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <video
          ref={videoRef}
          className="block w-full rounded-xl"
          src={VIDEO.image}
          aria-label={VIDEO.imageAlt}
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </section>
  );
}
