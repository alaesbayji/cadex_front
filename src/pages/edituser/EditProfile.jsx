import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import './edituser.scss';
import api from '../../Api'; // Import the Axios instance

const EditProfile = ({ title }) => {
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
          matricule: response.data.matricule,
          phone: response.data.telephone,
          email: response.data.email,
          password: "", // ne pas afficher le mot de passe
          role: response.data.role,
          fonction: response.data.fonction,
          direction: response.data.direction,
          bureau: response.data.bureau,
          profile:response.data.profile_photo
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
        alert(error)
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
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    // Création de FormData
    const data = new FormData();
    data.append("nom", formData.nom);
    data.append("prenom", formData.prenom);
    data.append("username", formData.username);
    data.append("matricule", formData.matricule);
    data.append("telephone", formData.phone);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("fonction", formData.fonction);
    data.append("direction", formData.direction);
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
      alert("Utilisateur mis à jour avec succès !");
      navigate('/profile'); // Redirection vers la liste des utilisateurs après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error.response?.data || error.message);
      alert("Erreur lors de la mise à jour de l'utilisateur !");
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
                  <option value="Bureau 1">Bureau  1</option>
                  <option value="Bureau 2">Bureau 2</option>
                </select>
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
