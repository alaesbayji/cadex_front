import './sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Users from '@mui/icons-material/PeopleAlt';
import HistoryIcon from '@mui/icons-material/History';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../images/Logo.png'
const Sidebar = () => {
  const [userRole, setUserRole] = useState(null); // Stocke le rôle de l'utilisateur
  const navigate = useNavigate();

  // Fonction pour récupérer les données de l'utilisateur connecté
  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      console.error('Access token not found.');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/cadex/users/self/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setUserRole(response.data.role); // Met à jour le rôle de l'utilisateur
    } catch (error) {
      console.error('Failed to fetch user data:', error.response?.data || error.message);
      alert(error)
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      const accessToken = localStorage.getItem("access");

      if (!refreshToken || !accessToken) {
        console.error("Tokens not found in localStorage.");
        return;
      }

      

      // Clear tokens and navigate to login
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  // Récupère les données de l'utilisateur au chargement du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className='sidebar'>
      <div className='top'>
        <Link to="/" style={{ textDecoration: "none" }}>
        <img src={logo}                   alt="logo"></img>
        </Link>
      </div>
      <hr />
      <div className='center'>
        <ul>
          {/* Options pour l'admin */}
          {userRole === 'admin' && (
            <>
              <p className="title">Admin</p>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <li>
                  <DashboardIcon className="icon" />
                  <span>Tableau de Bord</span>
                </li>
              </Link>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <Users className="icon" />
                  <span>Utilisateurs</span>
                </li>
              </Link>
              <Link to="/plans" style={{ textDecoration: "none" }}>
                <li>
                  <BackupTableIcon className="icon" />
                  <span>Plans</span>
                </li>
              </Link>
              <>
              <p className="title">User</p>
              <Link to="/" style={{ textDecoration: "none" }}>
                <li>
                  <PictureAsPdfIcon className="icon" />
                  <span>Generer Un plan</span>
                </li>
              </Link>
              <Link to="/historique" style={{ textDecoration: "none" }}>
                <li>
                  <HistoryIcon className="icon" />
                  <span>Historique</span>
                </li>
              </Link>
              <p className="title">Options</p>
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <li>
                  <AccountCircleIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link>
            </>
            </>
          )}

          {/* Options pour les utilisateurs */}
          {userRole === 'user' && (
            <>
              <p className="title">User</p>
              <Link to="/" style={{ textDecoration: "none" }}>
                <li>
                  <PictureAsPdfIcon className="icon" />
                  <span>Generer Un plan</span>
                </li>
              </Link>
              <Link to="/historique" style={{ textDecoration: "none" }}>
                <li>
                  <HistoryIcon className="icon" />
                  <span>Historique</span>
                </li>
              </Link>
              <p className="title">Options</p>
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <li>
                  <AccountCircleIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link>
            </>
          )}

          {/* Option pour tout le monde : Déconnexion */}
          <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogoutIcon className="icon" />
            <span>Deconnexion</span>
          </li>
        </ul>
      </div>
      <div className='bottom'>
        {/* Optionally add footer or other elements */}
      </div>
    </div>
  );
};

export default Sidebar;
