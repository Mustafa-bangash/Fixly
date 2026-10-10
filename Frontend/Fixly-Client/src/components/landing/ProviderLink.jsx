import { ROUTES } from '../../utils/routes.js';
import './Landing.css';

export default function ProviderLink() {
  return (
    <p className="muted provider-line">
      Do you offer repair services?{' '}
      <a className="link-button" href={ROUTES.info('become-a-provider')}>
        Learn about joining Fixly as a provider
      </a>
    </p>
  );
}
