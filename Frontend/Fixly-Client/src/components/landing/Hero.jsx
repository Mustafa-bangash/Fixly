import Button from '../common/Button.jsx';
import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { HERO } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
//first section of the landing page: heading, text, buttons and the main image
export default function Hero() {
  return (
    <section className="grid items-center gap-12 pt-9 pb-[10px] tablet:grid-cols-[1.05fr_1fr]">
      <div>
        <h1 className="mb-2 text-[30px] font-bold leading-[1.2] text-navy phone:text-[36px]">{HERO.title}</h1>
        <p className="mb-[14px] text-[20px]">{HERO.text}</p>
        <div className="flex flex-wrap gap-3">
          <Button href={ROUTES.signup} className="px-8">Get Started</Button>
          <Button href={ROUTES.how} variant="secondary" className="px-8">How Fixly Works</Button>
        </div>
      </div>
      <ImagePlaceholder src={HERO.image} alt={HERO.imageAlt} ratio="4/3" label="Hero image placeholder" />
    </section>
  );
}
