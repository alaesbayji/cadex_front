import MaChart from "../../Components/chart/MaChart";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Myplans from "../../Components/plans/Myplans";
import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ajout de l'état d'erreur
  const navigate = useNavigate();

  // Charger les informations de l'utilisateur authentifié
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Appel API pour récupérer les informations de l'utilisateur connecté
        const response = await axios.get("http://127.0.0.1:8000/cadex/users/self/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,  // Utilisation du token JWT pour l'authentification
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Impossible de récupérer les données de l'utilisateur.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // [] pour que l'effet se lance une seule fois au chargement du composant

  // Afficher un message de chargement ou d'erreur si nécessaire
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleEdit = () => {
    navigate(`/editprofile`); // Use the navigate function to pass state
  };


  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Button className="editButton"  onClick={() => handleEdit()}>Edit</Button>
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={`data:image/jpeg;base64,${userData.profile_photo}`} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{userData.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Matricule:</span>
                  <span className="itemValue">{userData.matricule}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{userData.telephone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Fonction:</span>
                  <span className="itemValue">{userData.fonction}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Direction:</span>
                  <span className="itemValue">{userData.direction}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Bureau:</span>
                  <span className="itemValue">{userData.bureau}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{userData.role}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <MaChart aspect={3 / 1} title="User Plans (Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Plans</h1>
          <Myplans /> {/* Affiche les plans associés à l'utilisateur */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
