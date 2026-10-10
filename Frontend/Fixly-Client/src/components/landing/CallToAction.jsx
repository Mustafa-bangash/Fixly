import { CTA_TITLE } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
import './Landing.css';

export default function CallToAction() {
  return (
    <section className="cta">
      <div><h2>{CTA_TITLE}</h2></div>
      <div><a className="btn cta-button" href={ROUTES.signup}>Get Started</a></div>
    </section>
  );
}
