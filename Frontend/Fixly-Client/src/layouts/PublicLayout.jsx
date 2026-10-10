import OfflineBanner from '../components/common/OfflineBanner.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Page frame for visitors who are not signed in: offline bar, header, page content, footer.
export default function PublicLayout({ children }) {
  return (
    <>
      <OfflineBanner />
      <div className="app">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
