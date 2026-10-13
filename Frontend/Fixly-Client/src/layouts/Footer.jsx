import { Link } from 'react-router-dom';
import { FOOTER_COLUMNS } from '../components/landing/landingContent.js';
import { ROUTES } from '../utils/routes.js';

function linkTo(link) {
  if (link.to === 'how') return ROUTES.how;
  if (link.to === 'services') return '/#services';
  return ROUTES.info(link.slug);
}

export default function Footer() {
  return (
    <footer className="mt-[50px] border-t border-line bg-white px-5 py-7 text-[15px]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-5 phone:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to={ROUTES.home} className="text-[22px] font-bold tracking-[1px] text-navy">
            FIXLY
          </Link>
          <p className="mt-1 mb-[14px] text-base text-muted">Making home repairs easier.</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <b className="font-bold text-navy">{column.heading}</b>
            {column.links.map((link) => {
              const target = linkTo(link);
              if (target.startsWith('/#')) {
                return (
                  <a key={link.label} className="block py-[5px] text-muted hover:text-brand" href={target}>
                    {link.label}
                  </a>
                );
              }
              return (
                <Link key={link.label} className="block py-[5px] text-muted hover:text-brand" to={target}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-5 max-w-[1240px] text-muted">
        © Fixly · Islamabad &amp; Rawalpindi, Pakistan
      </div>
    </footer>
  );
}
