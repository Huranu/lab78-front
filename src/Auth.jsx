import React, { useState, useContext } from 'react';
import './AuthPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from './pages/AuthContext';
import { AuthContext } from './pages/AuthContextJwt';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [signupError, setSignupError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { setUser,setTokenData} = useContext(AuthContext);

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
    withCredentials: true,
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await api.post('/login', {
        email: loginEmail,
        password: loginPassword,
      });

      setUser(response.data.user);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      const error = err.response?.data;
      if (error?.details) {
        setLoginError(error.details.join(', '));
      } else {
        setLoginError(error?.error || 'Login failed');
      }
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email: loginEmail,
        password : loginPassword,
      });
      const { accessToken, refreshToken, expires_in, tokenType, user } = response.data;

      const expires_at = Date.now() + expires_in * 1000;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('expires_at', expires_at.toString());

      setTokenData({
        accessToken,
        refreshToken,
        expires_at,
      });

      setUser(user || jwtDecode(accessToken));

      console.log('Login successful, user:', user);
      return true;
    } catch (err) {
      console.log(err)
      setLoginError(err?.error || 'Login failed');
    }
  };

  const handleSignupSubmitJwt = async (e) => {
    e.preventDefault();
    setSignupError(null);
    setFieldErrors({});

    const errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]{8,}$/;
    const urlRegex = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\?]*)#?([^#]*)?$/;

    if (!signupEmail) errors.signupEmail = 'Email is required';
    if (!signupPassword) errors.signupPassword = 'Password is required';
    if (!username) errors.username = 'Username is required';
    if (!fname || !nameRegex.test(fname) || fname.length < 3)
      errors.fname = 'First name must be at least 3 letters and contain only letters';
    if (!lname || !nameRegex.test(lname) || lname.length < 3)
      errors.lname = 'Last name must be at least 3 letters and contain only letters';
    if (!phoneNumber || !phoneRegex.test(phoneNumber))
      errors.phoneNumber = 'Phone number must be at least 8 digits and contain only numbers';
    if (!profilePicUrl || !urlRegex.test(profilePicUrl))
      errors.profilePicUrl = 'Valid URL for profile picture is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSignupError('Please correct the errors below');
      return;
    }

    try {
      const response = await api.post('/signup', {
        email: signupEmail,
        password: signupPassword,
        username,
        fname,
        lname,
        phone_number: phoneNumber,
        image: profilePicUrl,
      });

      const { accessToken, refreshToken, expires_in, tokenType, user } = response.data;

      const expires_at = Date.now() + expires_in * 1000;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('expires_at', expires_at.toString());

      setTokenData({
        accessToken,
        refreshToken,
        expires_at,
      });

      setUser(user || jwtDecode(accessToken));

      alert('User signed up successfully!');
      navigate('/');
    } catch (err) {
      const error = err.response?.data;
      if (error?.details) {
        const backendErrors = {};
        error.details.forEach((msg) => {
          if (msg.includes('email')) backendErrors.signupEmail = msg;
          else if (msg.includes('password')) backendErrors.signupPassword = msg;
          else if (msg.includes('username')) backendErrors.username = msg;
          else if (msg.includes('phone_number')) backendErrors.phoneNumber = msg;
          else if (msg.includes('image')) backendErrors.profilePicUrl = msg;
        });
        setFieldErrors(backendErrors);
        setSignupError('Please correct the errors below');
      } else {
        setSignupError(error?.error || 'Signup failed');
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);
    setFieldErrors({});

    const errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]{8,}$/;
    const urlRegex = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\?]*)#?([^#]*)?$/;

    if (!signupEmail) errors.signupEmail = 'Email is required';
    if (!signupPassword) errors.signupPassword = 'Password is required';
    if (!username) errors.username = 'Username is required';
    if (!fname || !nameRegex.test(fname) || fname.length < 3)
      errors.fname = 'First name must be at least 3 letters and contain only letters';
    if (!lname || !nameRegex.test(lname) || lname.length < 3)
      errors.lname = 'Last name must be at least 3 letters and contain only letters';
    if (!phoneNumber || !phoneRegex.test(phoneNumber))
      errors.phoneNumber = 'Phone number must be at least 8 digits and contain only numbers';
    if (!profilePicUrl || !urlRegex.test(profilePicUrl))
      errors.profilePicUrl = 'Valid URL for profile picture is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSignupError('Please correct the errors below');
      return;
    }

    try {
      const response = await api.post('/signup', {
        email: signupEmail,
        password: signupPassword,
        username,
        fname,
        lname,
        phone_number: phoneNumber,
        image: profilePicUrl,
      });

      setUser(response.data.user);
      alert('User signed up successfully!');
      navigate('/');
    } catch (err) {
      const error = err.response?.data;
      if (error?.details) {
        const backendErrors = {};
        error.details.forEach((msg) => {
          if (msg.includes('email')) backendErrors.signupEmail = msg;
          else if (msg.includes('password')) backendErrors.signupPassword = msg;
          else if (msg.includes('username')) backendErrors.username = msg;
          else if (msg.includes('phone_number')) backendErrors.phoneNumber = msg;
          else if (msg.includes('image')) backendErrors.profilePicUrl = msg;
        });
        setFieldErrors(backendErrors);
        setSignupError('Please correct the errors below');
      } else {
        setSignupError(error?.error || 'Signup failed');
      }
    }
  };

  return (
    <div className="auth-page-container">
      <div className="app-bar">
        <div className="app-bar-container">
          <div className="app-bar-content">
            <h1 className="app-bar-title">Authentication</h1>
            <div className="menu">
              <button className="menu-button" onClick={() => navigate('/')}>
                Users
              </button>
              <button className="menu-button" onClick={() => navigate('/auth')}>
                Authentication
              </button>
              <button
                className="menu-button add-button"
                onClick={() => navigate('/places/new')}
              >
                Add Place
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="form-container">
        <div className="login-form">
          <h2>Login</h2>
          {loginError && <p className="error">{loginError}</p>}
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>

        <div className="signup-form">
          <h2>Sign Up</h2>
          {signupError && <p className="error">{signupError}</p>}
          <form onSubmit={handleSignupSubmitJwt}>
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input
                type="email"
                id="signup-email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              {fieldErrors.signupEmail && (
                <p className="error">{fieldErrors.signupEmail}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              {fieldErrors.signupPassword && (
                <p className="error">{fieldErrors.signupPassword}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {fieldErrors.username && <p className="error">{fieldErrors.username}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                id="fname"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
              {fieldErrors.fname && <p className="error">{fieldErrors.fname}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                id="lname"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
              {fieldErrors.lname && <p className="error">{fieldErrors.lname}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phone-number">Phone Number</label>
              <input
                type="text"
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {fieldErrors.phoneNumber && (
                <p className="error">{fieldErrors.phoneNumber}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="profile-pic-url">Profile Picture</label>
              <input
                type="url"
                id="profile-pic-url"
                value={profilePicUrl}
                onChange={(e) => setProfilePicUrl(e.target.value)}
              />
              {fieldErrors.profilePicUrl && (
                <p className="error">{fieldErrors.profilePicUrl}</p>
              )}
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;