import { useLanguage } from '../hooks/useLanguage.js';
import { ROUTES } from '../utils/routes.js';
import './Header.css';

// Header for visitors who are not signed in (as in the prototype).
export default function Header() {
  const { t } = useLanguage();
  return (
    <header className="site-header">
      <div className="bar">
        <a className="logo" href={ROUTES.home}>FIXLY</a>
        <span className="spacer" />
        <a className="nav-item" href={ROUTES.how}>How Fixly Works</a>
        <a className="nav-item" href={ROUTES.login}>{t('Sign In')}</a>
        <a className="nav-item primary" href={ROUTES.signup}>{t('Get Started')}</a>
      </div>
    </header>
  );
}
