import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Pour stocker le rôle de l'utilisateur
  const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('access');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/cadex/users/self', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = response.data.role; // Supposons que l'API renvoie un objet avec un champ "role"
        setUserRole(role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle de l'utilisateur:", error);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  // Si les données sont en train de charger, on peut afficher un loader
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si le rôle de l'utilisateur n'est pas autorisé à accéder à cette route, on redirige
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  // Sinon, on affiche les enfants (la page protégée)
  return children;
};

export default ProtectedRoute;
