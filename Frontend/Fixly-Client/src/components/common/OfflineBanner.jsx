import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsOnline, setOnline } from '../../store/uiSlice.js';
// read the online status from the redux store



export default function OfflineBanner() {
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);
// listen to the browser online / offline events and save them in redux
  useEffect(() => {
    const handleOnline = () => dispatch(setOnline(true));
    const handleOffline = () => dispatch(setOnline(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
// remove the listeners when the banner is removed so they do not pile up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);
// nothing to show when the internet is working
  if (isOnline) return null;

  return (
    <div className="bg-danger p-2 text-center text-base text-white" role="alert">
      You&apos;re offline. Please check your internet connection.
    </div>
  );
}
