import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { SERVICES } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
import './Landing.css';

export default function Services() {
  // Later: this will start a request for the chosen service. For now visitors are sent to sign up.
  const startService = () => { window.location.href = ROUTES.signup; };

  return (
    <section>
      <h2 id="services">Services</h2>
      <div className="grid-4">
        {SERVICES.map((s) => (
          <button key={s.code} type="button" className="service" onClick={startService}>
            <ImagePlaceholder src={s.image} alt={s.imageAlt} ratio="3/2" />
            <b>{s.label}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
