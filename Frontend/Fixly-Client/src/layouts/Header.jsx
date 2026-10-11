import { ROUTES } from '../utils/routes.js';
// same style for the three links on the right side of the header
const navLink = 'rounded-lg px-[14px] py-[10px] text-base text-muted';

export default function Header() {
  return (
    <header className="sticky top-0 z-[5] border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1240px] items-center gap-[6px] px-5 py-3 phone:gap-5">
        <a className="text-[22px] font-bold tracking-[1px] text-navy" href={ROUTES.home}>FIXLY</a>
        <span className="flex-1 phone:flex-none" />
        <a className={navLink} href={ROUTES.how}>How Fixly Works</a>
        <a className={navLink} href={ROUTES.login}>Sign In</a>
        <a className={`${navLink} bg-brand text-white`} href={ROUTES.signup}>Get Started</a>
      </div>
    </header>
  );
}
