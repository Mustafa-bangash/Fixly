import { useEffect, useState } from 'react';
import './OfflineBanner.css';

// Red bar at the top of the page when the internet connection is lost (same as the prototype).
export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div className="offline-banner" role="alert">
      You're offline. Please check your internet connection.
    </div>
  );
}
