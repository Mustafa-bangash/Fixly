import LanguageProvider from './context/LanguageProvider.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';

// For now the app shows only the landing page.
// When more pages are added (login, signup, ...), a router will decide which page goes inside the layout.
export default function App() {
  return (
    <LanguageProvider>
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    </LanguageProvider>
  );
}
