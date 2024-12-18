import React, { useState } from 'react';
import axios from 'axios';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/Logo.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Remplacer 'email' par 'username' dans la requête POST
      const response = await axios.post('http://127.0.0.1:8000/cadex/login/', {
        email : email, // Remplacer email par username
        password,
      });
  
      // Stocker les jetons dans le localStorage
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
  
      // Rediriger vers le tableau de bord
      navigate('/');
      setError('');
    } catch (error) {
      // Gérer les erreurs
      if (error.response && error.response.status === 400) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };
  
  return (
    <div className="auth-container">
      <div className="login-section">
        <div className="top">
        <img src={logo} alt="logo"></img>
        </div>
        <span className="logo">Sign in to Account</span>

        <form className="sign-in-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/login">Forgot Password?</a>
          </div>
          <button type="submit" className="auth-button">Sign In</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      
    </div>
  );
};

export default Login;
