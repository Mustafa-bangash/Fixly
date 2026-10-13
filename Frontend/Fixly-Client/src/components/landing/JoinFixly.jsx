import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import Button from '../common/Button.jsx';
import { JOIN_OPTIONS } from './landingContent.js';

// Dedicated "Join Fixly" section with cards for Customer and Provider
export default function JoinFixly() {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-[24px] font-bold text-navy">Join Fixly</h2>
      <div className="grid gap-6 tablet:grid-cols-2">
        {JOIN_OPTIONS.map((option) => (
          <div
            key={option.title}
            className="flex flex-col justify-between rounded-xl border border-line bg-white p-6 shadow-xs"
          >
            <div>
              <ImagePlaceholder
                src={option.image}
                alt={option.imageAlt}
                ratio="3/2"
                label={option.imageAlt}
              />
              <h3 className="mt-4 mb-2 text-[20px] font-bold text-navy">
                {option.title}
              </h3>
              <p className="text-base text-muted leading-relaxed">
                {option.description}
              </p>
            </div>
            <div className="mt-4">
              <Button
                to={option.to}
                variant={option.variant}
                className="w-full max-w-[280px]"
              >
                {option.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
