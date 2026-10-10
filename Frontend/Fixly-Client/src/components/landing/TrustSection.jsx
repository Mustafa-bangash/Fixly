import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { TRUST } from './landingContent.js';
import './Landing.css';

export default function TrustSection() {
  return (
    <section>
      <h2>{TRUST.title}</h2>
      <div className="trust">
        <ImagePlaceholder src={TRUST.image} alt={TRUST.imageAlt} ratio="4/3" />
        <div>
          {TRUST.points.map((point) => (
            <div className="check" key={point}>{point}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
