import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { TRUST } from './landingContent.js';
//why customers can trust fixly: an image and a list of ticked points
export default function TrustSection() {
  return (
    <section>
      <h2 className="mt-7 mb-2 text-[20px] font-bold text-navy">{TRUST.title}</h2>
      <div className="grid items-center gap-12 tablet:grid-cols-[1.05fr_1fr]">
        <ImagePlaceholder src={TRUST.image} alt={TRUST.imageAlt} ratio="4/3" />
        <div>
          {/* the tick mark in front of each point comes from the before: classes */}
          {TRUST.points.map((point) => (
            <div
              key={point}
              className="py-[6px] text-[17px] before:font-bold before:text-brand before:content-['✓_']"
            >
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
