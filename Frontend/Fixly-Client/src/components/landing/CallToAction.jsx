import Button from '../common/Button.jsx';
import { CTA_TITLE } from './landingContent.js';
import { ROUTES } from '../../utils/routes.js';
// blue banner near the bottom that asks the visitor to get started
export default function CallToAction() {
  return (
    <section className="mt-10 grid items-center gap-9 rounded-[14px] bg-navy p-11 text-white tablet:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 className="m-0 text-[20px] font-bold text-white">{CTA_TITLE}</h2>
      </div>
      <div>
        <Button href={ROUTES.signup} className="me-[10px] max-w-[300px] px-7">Get Started</Button>
      </div>
    </section>
  );
}
