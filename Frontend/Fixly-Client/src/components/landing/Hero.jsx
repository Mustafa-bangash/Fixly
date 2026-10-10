import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { HERO } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
import './Landing.css';

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <h1 className="big">{HERO.title}</h1>
        <p className="hero-text">{HERO.text}</p>
        <div className="hero-buttons">
          <a className="btn auto" href={ROUTES.signup}>Get Started</a>
          <a className="btn secondary auto" href={ROUTES.how}>How Fixly Works</a>
        </div>
      </div>
      <ImagePlaceholder src={HERO.image} alt={HERO.imageAlt} ratio="4/3" label="Hero image placeholder" />
    </section>
  );
}
