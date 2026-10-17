
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectAuthInitialized,
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../store/authSlice.js';
import { ROUTES } from '../../utils/routes.js';

export default function CustomerOnlyRoute() {
  const authInitialized = useSelector(selectAuthInitialized);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!authInitialized) {
    return (
      <p className="py-12 text-center text-muted">
        Checking your account...
      </p>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={ROUTES.login}
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.role !== 'CUSTOMER') {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
}
