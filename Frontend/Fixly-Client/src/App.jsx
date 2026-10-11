import PublicLayout from './layouts/PublicLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';

export default function App() {
  // only the landing page for now, a router will decide the page later
  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
  );
}
