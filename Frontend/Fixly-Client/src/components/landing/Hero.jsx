import Button from '../common/Button.jsx';
import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { HERO } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
import { Link } from 'react-router-dom';

// First section of the landing page: heading, text, action buttons and main hero image
export default function Hero() {
  return (
    <section className="grid items-center gap-12 pt-9 pb-[10px] tablet:grid-cols-[1.05fr_1fr]">
      <div>
        <h1 className="mb-2 text-[30px] font-bold leading-[1.2] text-navy phone:text-[36px]">
          {HERO.title}
        </h1>
        <p className="mb-6 text-[18px] text-muted phone:text-[20px] leading-relaxed">
          {HERO.text}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button to={ROUTES.signup} className="px-7">
            Join as a Customer
          </Button>
          <Button to={ROUTES.providerSignup} variant="secondary" className="px-7">
            Join as a Provider
          </Button>
          <Link
            to={ROUTES.how}
            className="p-2 text-base font-semibold text-brand hover:underline"
          >
            How Fixly Works
          </Link>
        </div>
      </div>
      <ImagePlaceholder
        src={HERO.image}
        alt={HERO.imageAlt}
        ratio="4/3"
        label="Hero image placeholder"
      />
    </section>
  );
}
