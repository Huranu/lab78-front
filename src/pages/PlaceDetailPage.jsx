import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaceDetailPage.css';
import { AuthContext } from './AuthContext';
// import { AuthContext } from './AuthContextJwt';

const PlaceDetailPage = () => {
  const { uid, placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        if (!placeId) {
          setError('Invalid place ID');
          navigate(`/${uid}/places`);
          return;
        }

        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
        });

        const response = await api.get(`/places/${placeId}`);
        const placeData = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          coordinates: response.data.lat_long,
          location: response.data.location,
          creatorId: response.data.userId,
          picture: response.data.imageUrl
        };

        console.log('Formatted place:', placeData);
        setPlace(placeData);
      } catch (err) {
        console.error('Fetch place error:', err);
        setError(err.response?.data?.error || 'Failed to fetch place');
      }
    };

    fetchPlace();
  }, [uid, placeId, navigate]);

  if (!place && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="app-bar">
          <div className="app-bar-container">
            <div className="app-bar-content">
              <h1 className="app-bar-title">Place Details</h1>
              <div className="menu">
                <button className="menu-button" onClick={() => navigate('/')}>
                  Users
                </button>
                <button className="menu-button" onClick={() => navigate('/auth')}>
                  Authentication
                </button>
                <button
                  className="menu-button add-button"
                  onClick={() => navigate(`/places/new`)}
                >
                  Add Place
                </button>
                <button className="menu-button" onClick={logout}>
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="place-detail-container">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="app-bar">
        <div className="app-bar-container">
          <div className="app-bar-content">
            <h1 className="app-bar-title">Place Details</h1>
            <div className="menu">
              <button className="menu-button" onClick={() => navigate('/')}>
                Users
              </button>
              <button className="menu-button" onClick={() => navigate('/auth')}>
                Authentication
              </button>
              <button
                className="menu-button add-button"
                onClick={() => navigate(`/places/new`)}
                >
                Add Place
              </button>
              <button className="menu-button" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="place-detail-container">
        <h2>{place.title}</h2>
        <div className="place-detail-content">
          {place.picture && (
            <img src={place.picture} alt={place.title} className="place-detail-img" />
          )}
          <div className="place-detail-info">
            <p><strong>Description:</strong> {place.description}</p>
            <p><strong>Coordinates:</strong> {place.coordinates}</p>
            <p><strong>Location:</strong> {place.location}</p>
            <p><strong>Created by:</strong> {place.creatorId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;