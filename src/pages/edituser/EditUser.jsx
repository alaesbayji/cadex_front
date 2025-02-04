import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./edituser.scss";
import api from "../../Api"; // Import the Axios instance
import ShowAlert from "../../Components/ShowAlert";

const EditUser = ({ title }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  const { id } = useParams(); // Récupérer l'ID de l'utilisateur depuis l'URL
  const location = useLocation();
  const userDataFromState = location.state?.id; // Récupérer l'ID envoyé par state
  const authToken = localStorage.getItem('access');

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    username: "",
    matricule: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    fonction: "",
    direction: "",
    bureau: "",
    profile: "",
  });

  const [initialData, setInitialData] = useState({}); // Pour stocker les données initiales
  const [confirmPassword, setConfirmPassword] = useState("");

  // Récupérer les données de l'utilisateur lors du montage du composant
  useEffect(() => {
    const userId = userDataFromState || id; // Utiliser l'ID du state ou celui de l'URL

    const fetchUserData = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/cadex/users/${userId}`);
        const userData = {
          nom: response.data.nom,
          prenom: response.data.prenom,
          username: response.data.username,
          matricule: response.data.matricule,
          phone: response.data.telephone,
          email: response.data.email,
          password: "", // ne pas afficher le mot de passe
          role: response.data.role,
          fonction: response.data.fonction,
          direction: response.data.direction,
          bureau: response.data.bureau,
          profile: response.data.profile_photo,
        };
        setFormData(userData);
        setInitialData(userData); // Stocker les données initiales
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        ShowAlert('error', "Erreur lors de la récupération des données de l'utilisateur");
      }
    };

    fetchUserData();
  }, [userDataFromState,id]);

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
    if (formData.password && formData.password !== confirmPassword) {
      ShowAlert('error', "Les mots de passe ne correspondent pas !");
      return;
    }

    // Création de FormData
    const data = new FormData();

    // Comparer les valeurs actuelles avec les valeurs initiales
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialData[key]) {
        data.append(key, formData[key]); // Ajouter uniquement les champs modifiés
      }
    });

    // Ajouter la photo de profil si elle a été modifiée
    if (file) {
      data.append("profile_photo", file);
    }

    try {
      const userId = userDataFromState || id; // Utiliser l'ID du state ou celui de l'URL

      const response = await axios.put(`http://127.0.0.1:8000/cadex/users/${userId}/update/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${authToken}`  // Utilisation du token dans les en-têtes

        },
      });

      console.log("Utilisateur mis à jour avec succès :", response.data);
            ShowAlert('success', "Utilisateur mis à jour avec succès !");

      navigate("/users"); // Redirection vers la liste des utilisateurs après la mise à jour
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
src={file ? URL.createObjectURL(file) : formData.profile ? `data:image/jpeg;base64,${formData.profile}` : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
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
                <label>Matricule</label>
                <input
                  type="text"
                  name="matricule"
                  placeholder="Matricule"
                  value={formData.matricule}
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
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
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
                <label>Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisissez un rôle</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="formInput">
                <label>Fonction</label>
                <select
                  name="fonction"
                  value={formData.fonction}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisissez une fonction</option>
                  <option value="fonction1">Fonction 1</option>
                  <option value="fonction2">Fonction 2</option>
                </select>
              </div>

              <div className="formInput">
                <label>Direction</label>
                <select
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisissez une direction</option>
                  <option value="direction1">Direction 1</option>
                  <option value="direction2">Direction 2</option>
                </select>
              </div>

              <div className="formInput">
                <label>Bureau</label>
                <select
                  name="bureau"
                  value={formData.bureau}
                  onChange={handleChange}
                  required
                >
                   <option value="">Choisissez un bureau</option>
                   <option value="Bureau 1">Bureau 1</option>
                  <option value="Bureau 2">Bureau 2</option>
                </select>
              </div>

              <div className="formInput">
                <label>Photo de profil</label>
                <input
                  type="file"
                  name="profile_photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="formInput"
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

export default EditUser;
