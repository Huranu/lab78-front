import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddPlacePage.css';
// import { AuthContext } from './AuthContext';
import { AuthContext } from './AuthContextJwt';

const AddPlacePage = () => {
  const navigate = useNavigate();
  const { user, logout, api } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lat_long: '',
    location: '',
    image: '',
  });
  const [error, setError] = useState(null);

  const MAX_TITLE_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 1000;
  const MAX_LOCATION_LENGTH = 200;
  const MAX_IMAGE_URL_LENGTH = 500;
  const COORDINATE_REGEX = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/;
  const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
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

    if (!user) {
      setError('Please log in to add a place');
      navigate('/auth');
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

      const payload = {
        title: formData.title,
        description: formData.description,
        lat_long: formData.lat_long,
        location: formData.location,
        image: formData.image,
        userId: user.id,
      };

      console.log('Submitting place:', JSON.stringify(payload, null, 2));

      const response = await api.post('/places', payload);

      console.log('API response:', response.data);
      navigate(`/${user.id}/places`);
    } catch (err) {
      console.error('Add place error:', err);
      setError(err.response?.data?.error || 'Failed to add place');
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in to add a place');
      navigate('/auth');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      const payload = {
        title: formData.title,
        description: formData.description,
        lat_long: formData.lat_long,
        location: formData.location,
        image: formData.image,
        userId: user.id,
      };

      console.log('Submitting place:', JSON.stringify(payload, null, 2));

      const response = await api.post('/places', payload);

      console.log('API response:', response.data);
      navigate(`/${user.id}/places`);
    } catch (err) {
      console.error('Add place error:', err);
      setError(err.response?.data?.error || 'Failed to add place');
    }
  };

  console.log('AddPlacePage rendering, user:', user);

  return (
    <div className="page-container">
      <div className="app-bar">
        <div className="app-bar-container">
          <div className="app-bar-content">
            <h1 className="app-bar-title">Add New Place</h1>
            <div className="menu">
              <button className="menu-button" onClick={() => navigate('/')}>
                Users
              </button>
              <button className="menu-button" onClick={() => navigate('/auth')}>
                Authenticate
              </button>
              <button
                className="menu-button add-button"
                onClick={() => navigate('/places/new')}
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
      <div className="add-place-container">
        <h2>Add a New Place</h2>
        {error && <p className="error">{error}</p>}
        {user ? (
          <form onSubmit={submit} className="add-place-form">
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
              Add Place
            </button>
          </form>
        ) : (
          <p>Please log in to add a place.</p>
        )}
      </div>
    </div>
  );
};

export default AddPlacePage;