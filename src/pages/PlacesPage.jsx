import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlacesPage.css';
// import { AuthContext } from './AuthContext';
import { AuthContext} from './AuthContextJwt';

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [openMoreIndex, setOpenMoreIndex] = useState(null);
  const [error, setError] = useState(null);
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user, logout, api } = useContext(AuthContext);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
          withCredentials: true, 
        });

        const response = await api.get(`/places/user/${uid}`);

        const formattedPlaces = response.data.map(place => {
          return {
            id: place.id,
            title: place.title,
            description: place.description,
            location: place.location,
            coordinates: place.lat_long,
            creatorId: place.userId,
            picture: place.imageUrl,
          };
        });

        setPlaces(formattedPlaces);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch places');
      }
    };
    fetchPlaces();
  }, [uid]);

  const toggleMore = (index) => {
    setOpenMoreIndex(openMoreIndex === index ? null : index);
  };

  const deleteJwt = async (placeId, index) => {
    if (!user) {
      setError('Please log in to delete places');
      navigate('/auth');
      return;
    }

    try {
      await api.delete(`/places/${placeId}`);

      setPlaces(places.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Delete place error:', err);
      setError(err.response?.data?.error || 'Failed to delete place');
    }
  };

  const deletePlace = async (placeId, index) => {
    if (!user) {
      setError('Please log in to delete places');
      navigate('/auth');
      return;
    }

    try {
      const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true,
      });

      await api.delete(`/places/${placeId}`);

      setPlaces(places.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Delete place error:', err);
      setError(err.response?.data?.error || 'Failed to delete place');
    }
  };

  const updatePlace = (index) => {
    const placeToUpdate = places[index];
    navigate(`/${uid}/places/update/${placeToUpdate.id}`, { state: { place: placeToUpdate } });
  };

  const goToPlaceDetail = (index) => {
    const place = places[index];
    console.log('Navigating to place:', place);
    navigate(`/${uid}/places/${place.id}`, { state: { place } });
  };

  console.log('PlacesPage rendering, user:', user);

  return (
    <div className="page-container">
      <div className="app-bar">
        <div className="app-bar-container">
          <div className="app-bar-content">
            <h1 className="app-bar-title">Places Dashboard</h1>
            <div className="menu">
              <button 
                className="menu-button"
                onClick={() => navigate('/')}
              >
                Users
              </button>
              <button 
                className="menu-button"
                onClick={() => navigate('/auth')}
              >
                Authentication
              </button>
              <button 
                className="menu-button add-button"
                onClick={() => navigate(`/places/new`)}
              >
                Add Place
              </button>
              {user ? (
                <button className="menu-button" onClick={logout}>
                  Log out
                </button>
              ) : (
                <button className="menu-button" onClick={() => navigate('/auth')}>
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="places-container">
        <h2>Places</h2>
        {error && <p className="error">{error}</p>}
        {places.length === 0 && !error ? (
          <p>No places added yet.</p>
        ) : (
          <ul>
            {places.map((place, index) => (
              <li 
                key={place.id} 
                className="place-card" 
                onClick={() => goToPlaceDetail(index)}
              >
                <div className="place-image">
                  {place.picture && (
                    <img src={place.picture} alt={place.title} className="place-img" />
                  )}
                </div>
                <div className="place-info">
                  <h3>{place.title}</h3>
                  <p>{place.description}</p>
                  <p>Coordinates: {place.coordinates}</p>
                  <p>Location: {place.location}</p>
                </div>
                {user && user.id == place.creatorId && (
                  <div 
                    className="place-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      className="more-button"
                      onClick={() => toggleMore(index)}
                    >
                      More
                    </button>
                    {openMoreIndex === index && (
                      <div className="actions-dropdown">
                        <button 
                          className="action-button delete-button"
                          onClick={() => deleteJwt(place.id, index)}
                        >
                          Delete
                        </button>
                        <button 
                          className="action-button update-button"
                          onClick={() => updatePlace(index)}
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlacesPage;