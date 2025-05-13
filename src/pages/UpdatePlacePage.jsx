import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AddPlacePage.css';
import { AuthContext } from './AuthContext';
// import { AuthContext} from './AuthContextJwt';

const UpdatePlacePage = () => {
  const { uid, placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { place } = location.state || {};
  const { user, logout} = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lat_long: '',
    location: '',
    image: '',
  });
  const [error, setError] = useState(null);

  // Validation constraints
  const MAX_TITLE_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 1000;
  const MAX_LOCATION_LENGTH = 200;
  const MAX_IMAGE_URL_LENGTH = 500;
  const COORDINATE_REGEX = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/; // e.g., "40.7128,-74.0060"
  const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i; // Basic URL validation

  useEffect(() => {
    if (!user) {
      setError('Please log in to update a place');
      navigate('/auth');
      return;
    }

    if (place) {
      console.log('Place data:', place);
      setFormData({
        title: place.title || '',
        description: place.description || '',
        lat_long: place.coordinates || '',
        location: place.location || '',
        image: place.picture || '',
      });
    } else {
      setError('Place data not found');
    }
  }, [navigate, place, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.title) return 'Title is required';
    if (formData.title.length > MAX_TITLE_LENGTH)
      return `Title must be ${MAX_TITLE_LENGTH} characters or less`;
    if (!formData.description) return 'Description is required';
    if (formData.description.length > MAX_DESCRIPTION_LENGTH)
      return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    if (!formData.location) return 'Location is required';
    if (formData.location.length > MAX_LOCATION_LENGTH)
      return `Location must be ${MAX_LOCATION_LENGTH} characters or less`;
    if (!formData.lat_long) return 'Coordinates are required';
    if (!COORDINATE_REGEX.test(formData.lat_long))
      return "Coordinates must be in the format 'lat,lng' (e.g., 40.7128,-74.0060)";
    if (formData.image && !URL_REGEX.test(formData.image))
      return 'Image URL must be a valid URL (e.g., https://example.com/image.jpg)';
    if (formData.image && formData.image.length > MAX_IMAGE_URL_LENGTH)
      return `Image URL must be ${MAX_IMAGE_URL_LENGTH} characters or less`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !uid || !placeId) {
      setError('Missing user or place information');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true,
      });

      const updateData = {
        title: formData.title,
        description: formData.description,
        lat_long: formData.lat_long,
        location: formData.location,
        image: formData.image || null,
        userId: user.id,
      };

      console.log('Sending update data:', JSON.stringify(updateData, null, 2));
      await api.put(`/places/${placeId}`, updateData);

      console.log('Place updated successfully');
      navigate(`/${uid}/places`);
    } catch (err) {
      console.error('Update place error:', err);
      setError(err.response?.data?.error || 'Failed to update place');
    }
  };

  // const submit = async (e) => {
  //   e.preventDefault();

  //   if (!user || !uid || !placeId) {
  //     setError('Missing user or place information');
  //     return;
  //   }

  //   const validationError = validateForm();
  //   if (validationError) {
  //     setError(validationError);
  //     return;
  //   }

  //   try {
  //     const updateData = {
  //       title: formData.title,
  //       description: formData.description,
  //       lat_long: formData.lat_long,
  //       location: formData.location,
  //       image: formData.image || null,
  //       userId: user.id,
  //     };

  //     console.log('Sending update data:', JSON.stringify(updateData, null, 2));
  //     await api.put(`/places/${placeId}`, updateData);

  //     console.log('Place updated successfully');
  //     navigate(`/${uid}/places`);
  //   } catch (err) {
  //     console.error('Update place error:', err);
  //     setError(err.response?.data?.error || 'Failed to update place');
  //   }
  // };

  console.log('UpdatePlacePage rendering, user:', user);

  if (!user) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="app-bar">
        <div className="app-bar-container">
          <div className="app-bar-content">
            <h1 className="app-bar-title">Update Place</h1>
            <div className="menu">
              <button className="menu-button" onClick={() => navigate('/')}>
                Users
              </button>
              <button className="menu-button" onClick={() => navigate('/auth')}>
                Authenticate
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
      <div className="add-place-container">
        <h2>Update Place</h2>
        {error && <p className="error">{error}</p>} 
        <form onSubmit={handleSubmit} className="add-place-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={MAX_TITLE_LENGTH}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lat_long">Coordinates (lat,lng) *</label>
            <input
              type="text"
              id="lat_long"
              name="lat_long"
              value={formData.lat_long}
              onChange={handleChange}
              required
              placeholder="e.g., 40.7128,-74.0060"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              maxLength={MAX_LOCATION_LENGTH}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              maxLength={MAX_IMAGE_URL_LENGTH}
              placeholder="e.g., https://example.com/image.jpg"
            />
          </div>
          <button type="submit" className="submit-button">
            Update Place
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlacePage;