import { ROUTES } from '../../utils/routes.js';
//small line for service providers who want to join fixly
export default function ProviderLink() {
  return (
    <p className="mt-6 mb-[14px] text-base text-muted">
      Do you offer repair services?{' '}
      <a className="inline-block cursor-pointer p-2 text-base font-semibold text-brand" href={ROUTES.info('become-a-provider')}>
        Learn about joining Fixly as a provider
      </a>
    </p>
  );
}
