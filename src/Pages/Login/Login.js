import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import styles from './Login.module.css';

const Login = () => {
  // Changed state variable from 'email' to 'genId'
  const [genId, setGenId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Pass the genId to your API function instead of email
      const userData = await loginUser(genId, password);
      
      // Save the user details to the browser's local storage
      localStorage.setItem('user', JSON.stringify(userData));

      // Send them to the dashboard
      navigate('/dashboard'); 
    } catch (err) {
      // Updated error message
      setError(err.message || 'Invalid Gen ID or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Admin Login</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            {/* Updated Label and Input for Gen ID */}
            <label htmlFor="genId">Gen ID</label>
            <input
              type="text" // Changed from "email" to "text"
              id="genId"
              value={genId}
              onChange={(e) => setGenId(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className={styles.loginButton}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;