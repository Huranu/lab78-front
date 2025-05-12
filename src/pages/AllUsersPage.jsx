import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllUsersPage.css';
// import { AuthContext } from './AuthContext';
import { AuthContext } from './AuthContextJwt';


const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
        });
        console.log('Fetching users from /api/users');
        const response = await api.get('/users');
        console.log('API response:', JSON.stringify(response.data, null, 2));

        const formattedUsers = response.data.map(user => ({
          ...user,
        }));

        console.log('Formatted users:', formattedUsers);
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (uid) => {
    navigate(`/${uid}/places`);
  };

  return (
    <div className="page-container">
      <div className="app-bar">
        <div className="app-bar-container">
          <div className="app-bar-content">
            <h1 className="app-bar-title">Users Dashboard</h1>
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
              <button className="menu-button" onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="users-container">
        <h1 className="page-title">All Users</h1>
        {error && <p className="error">{error}</p>}
        {users.length === 0 && !error ? (
          <p>No users found.</p>
        ) : (
          <div className="users-list">
            {users.map((user) => (
              <div
                className="user-card"
                key={user.id}
                onClick={() => handleUserClick(user.id)}
              >
                <div className="user-info">
                  <div className="user-profile-pic">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={`user ${user.id}`}
                        className="profile-img"
                      />
                    ) : (
                      <div className="no-profile-pic">No Profile</div>
                    )}
                  </div>
                  <div className="user-details">
                    <h2 className="username">{user.username || 'No username'}</h2>
                    <p className="email">Email: {user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;