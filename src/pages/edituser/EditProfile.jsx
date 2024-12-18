import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import './edituser.scss';
import api from '../../Api'; // Import the Axios instance
import ShowAlert from "../../Components/ShowAlert";

const EditProfile = ({ title }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const { id } = useParams(); // Récupérer l'ID de l'utilisateur depuis l'URL
  const authToken = localStorage.getItem('access');

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    username: "",
    phone: "",
    password: "",
    profile:""
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  // Récupérer les données de l'utilisateur lors du montage du composant
  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/cadex/users/self`);
        setFormData({
          nom: response.data.nom,
          prenom: response.data.prenom,
          username: response.data.username,
          phone: response.data.telephone,
          password: "", // ne pas afficher le mot de passe        
          profile:response.data.profile_photo
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        ShowAlert('error', "Erreur lors de la récupération des données de l'utilisateur");

      }
    };

    fetchUserData();
  }, [id]); // Effet déclenché uniquement lorsque l'ID change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation des mots de passe
    if (formData.password !== confirmPassword) {
      ShowAlert('error', "Les mots de passe ne correspondent pas !");
      return;
    }

    // Création de FormData
    const data = new FormData();
    data.append("nom", formData.nom);
    data.append("prenom", formData.prenom);
    data.append("username", formData.username);
    data.append("telephone", formData.phone);
    data.append("password", formData.password);
    data.append("bureau", formData.bureau);

    if (file) {
      data.append("profile_photo", file);
    }

    try {

      const response = await api.put(`http://127.0.0.1:8000/cadex/users/self/update/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${authToken}`  // Utilisation du token dans les en-têtes

        },
      });

      console.log("Utilisateur mis à jour avec succès :", response.data);
      ShowAlert('success', "Utilisateur mis à jour avec succès !");

      navigate('/profile'); // Redirection vers la liste des utilisateurs après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error.response?.data || error.message);
      ShowAlert('error', "Erreur lors de la mise à jour de l'utilisateur !");

    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
          <img
  src={`data:image/jpeg;base64,${formData.profile}`}
  alt="User Profile"
  className="itemImg"
/>

          </div>
          <div className="right">
            <form onSubmit={handleUpdate}>
              <div className="formInput">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

            

              <div className="formInput">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

             

              <div className="formInput">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  
                />
              </div>

              <div className="formInput">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  
                />
              </div>

              

              <div className="formInput">
                <label>Photo de profil</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn">Mettre à jour</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
