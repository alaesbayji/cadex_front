import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import {  useNavigate } from 'react-router-dom';
import './new.scss'
import ShowAlert from "../../Components/ShowAlert";

const New = ({ title }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

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
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
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

    // Débogage : Afficher les données dans la console
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/cadex/signup/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Utilisateur créé avec succès :", response.data);
      ShowAlert('success', "Utilisateur créé avec succès !");

      navigate('/users')
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error.response?.data || error.message);
      ShowAlert('error', "Erreur lors de la création de l'utilisateur !");
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
              src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              alt="Preview"
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
                  required
                />
              </div>

              <div className="formInput">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  className="formInput"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="formInput">
                <label>Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
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
                  className="formInput"
                  required
                >
                  <option value="">Choisissez un bureau</option>
                  <option value="bureau1">Bureau 1</option>
                  <option value="bureau2">Bureau 2</option>
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

              <button type="submit">S'inscrire</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
