import { useEffect, useRef } from 'react';
import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { STEPS, VIDEO } from './landingContent.js';
import './Landing.css';

export default function HowItWorks() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <h2>How Fixly works</h2>
      <div className="grid-5">
        {STEPS.map((step, i) => (
          <div key={step.title}>
            <ImagePlaceholder src={step.image} alt={step.imageAlt} ratio="4/3" />
            <div className="num">{i + 1}</div>
            <b>{step.title}</b>
          </div>
        ))}
      </div>
      <div className="video-box">
        <ImagePlaceholder
          src={VIDEO.image}
          alt={VIDEO.imageAlt}
          ratio="16/9"
          label="Video placeholder"
          isVideo
          autoPlay
          muted
          loop
          playsInline
          videoRef={videoRef}
        />
      </div>
    </section>
  );
}
