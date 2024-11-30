import React, { useState, useEffect } from 'react';
import './navbar.scss';

import alae from '../../images/alae.jpg'; // Default image if profile photo is not available
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate pour la navigation

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialiser useNavigate

  // Fetch current user data from API
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/cadex/users/self/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`, // Utilisation du token JWT pour l'authentification
        },
      })
      .then((response) => {
        setCurrentUser(response.data); // Assuming the API returns an object with 'username' and 'profile_photo'
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    // Supprimez les informations de session, par ex. le token
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    // Rediriger vers la page de connexion
    navigate('/login');
  };
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          Bonjour {currentUser ? currentUser.username : 'USER'}
        </div>
        <div className="items">
          <div className="profile-dropdown">
            <div
              className="profile-dropdown-btn"
              onClick={toggleDropdown}
            >
              <div className="profile-img">
                <img
                  src={`data:image/jpeg;base64,${currentUser && currentUser.profile_photo ? currentUser.profile_photo : alae}`}
                  alt="Profile"
                  className="avatar"
                />
              </div>
             
            </div>

            {isDropdownOpen && (
              <ul className="profile-dropdown-list">
                <li className="profile-dropdown-list-item" // Appeler handleLogout pour se déconnecter
 >
                  <a href="/profile">
                     Profile
                  </a>
                </li>
                
                <hr />
                <li className="profile-dropdown-list-item" onClick={handleLogout}>
                  <a href="#">
                    Log out
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
