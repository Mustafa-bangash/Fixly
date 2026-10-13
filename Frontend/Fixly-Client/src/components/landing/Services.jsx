import { useNavigate } from 'react-router-dom';
import ImagePlaceholder from '../common/ImagePlaceholder.jsx';
import { SERVICES } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';

// The 8 service tiles on the landing page
export default function Services() {
  const navigate = useNavigate();

  const startService = () => {
    // Navigates directly to customer signup/request page
    navigate(ROUTES.signup);
  };

  return (
    <section>
      <h2
        id="services"
        className="mt-7 mb-4 scroll-mt-20 text-[20px] font-bold text-navy"
      >
        Services
      </h2>
      <div className="grid grid-cols-2 gap-5 tablet:grid-cols-4">
        {SERVICES.map((service) => (
          <button
            key={service.code}
            type="button"
            onClick={() => startService(service.code)}
            className="cursor-pointer text-left transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-navy"
          >
            <ImagePlaceholder
              src={service.image}
              alt={service.imageAlt}
              ratio="3/2"
              label={service.imageAlt}
            />
            <b className="mt-2 block text-[17px] text-navy font-semibold">
              {service.label}
            </b>
          </button>
        ))}
      </div>
    </section>
  );
}
