import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './pages/AuthContextJwt';
// import { AuthContext, AuthProvider } from './pages/AuthContext';
import Auth from './Auth';
import AllUsersPage from './pages/AllUsersPage';
import PlacesPage from './pages/PlacesPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import AddPlacePage from './pages/AddPlacePage';
import UpdatePlacePage from './pages/UpdatePlacePage';

const GuestRoute = () => {
  const { user, loading } = useContext(AuthContext);
  console.log('GuestRoute - user:', user, 'loading:', loading);

  if (loading) {
    console.log('GuestRoute - Showing loading state');
    return <div>Loading...</div>;
  }
  console.log('GuestRoute - Rendering:', user ? 'Redirect to /' : 'Outlet (Auth component)');
  return user ? <Navigate to="/" replace /> : <Auth />;
};

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  console.log('PrivateRoute - user:', user, 'loading:', loading);

  if (loading) {
    console.log('PrivateRoute - Showing loading state');
    return <div>Loading...</div>;
  }
  console.log('PrivateRoute - Rendering:', user ? 'Outlet' : 'Redirect to /auth');
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AllUsersPage />} />
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <Auth />
              </GuestRoute>
            }
          />
          <Route path="/:uid/places/:placeId" element={<PlaceDetailPage />} />
          <Route path="/:uid/places" element={<PlacesPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/:uid/places/update/:placeId" element={<UpdatePlacePage />} />
            <Route path="/places/new" element={<AddPlacePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;