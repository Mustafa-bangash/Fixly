import { useLanguage } from '../hooks/useLanguage.js';
import { FOOTER_COLUMNS } from '../components/landing/landingContent.js';
import { ROUTES } from '../utils/routes.js';
import './Footer.css';

// Turns a footer link definition into a real address.
function linkTo(link) {
  if (link.to === 'how') return ROUTES.how;
  if (link.to === 'services') return '#services'; // scrolls to the Services section
  return ROUTES.info(link.slug);
}

export default function Footer() {
  const { lang, setLang } = useLanguage();
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div>
          <b className="foot-logo">FIXLY</b>
          <p className="muted">Making home repairs easier.</p>
          <div className="seg" role="group" aria-label="Language">
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
            <button className={lang === 'ur' ? 'on' : ''} onClick={() => setLang('ur')}>اردو</button>
          </div>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <b>{col.heading}</b>
            {col.links.map((link) => (
              <a key={link.label} href={linkTo(link)}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="foot-bottom">© Fixly · Islamabad &amp; Rawalpindi, Pakistan</div>
    </footer>
  );
}
