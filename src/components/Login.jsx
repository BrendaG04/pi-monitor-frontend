import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Login.css';

function Login({ onSwitchToSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL
	? `${process.env.REACT_APP_API_URL}/auth/login`
	: '/api/auth/login';
	
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.username);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Invalid username or password');
      }
    } catch (err) {
      setError('Failed to connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

 const handleGuestLogin = () => {
	setUsername('guest');
	setPassword('Guest123!');
 };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🍓</h1>
          <h2>Pi Monitor</h2>
          <p>Sign in to view system stats</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="guest-button"
          >
             Use Guest Account
          </button>

          <div className="login-hint">
	    <small>Guest: guest / Guest123!</small>
	  </div>
          <div className="switch-link">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToSignup}
              className="link-button"
            >
              Sign up here
            </button>
          </div>
	</form>
      </div>
    </div>
  );
}

export default Login;
