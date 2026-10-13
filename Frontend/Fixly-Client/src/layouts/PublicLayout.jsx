import { Outlet } from 'react-router-dom';
import OfflineBanner from '../components/common/OfflineBanner.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Frame for pages that visitors see: offline bar, header, page content and footer
export default function PublicLayout({ children }) {
  return (
    <>
      <OfflineBanner />
      <div className="flex min-h-screen flex-col bg-page">
        <Header />
        <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 pt-7 pb-[120px]">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </>
  );
}
