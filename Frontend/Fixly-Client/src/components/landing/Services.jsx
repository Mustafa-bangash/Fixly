import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { SERVICES } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
//the 8 service tiles
export default function Services() {
  //for now every service tile sends the visitor to the sign up page
  const startService = () => {
    window.location.href = ROUTES.signup;
  };

  return (
    <section>
      <h2 id="services" className="mt-7 mb-2 scroll-mt-20 text-[20px] font-bold text-navy">Services</h2>
      <div className="grid grid-cols-2 gap-5 tablet:grid-cols-4">
        {SERVICES.map((service) => (
          <button
            key={service.code}
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-start text-[17px] font-semibold text-navy"
            onClick={startService}
          >
            <ImagePlaceholder src={service.image} alt={service.imageAlt} ratio="3/2" />
            <b className="mt-2 block font-bold">{service.label}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
