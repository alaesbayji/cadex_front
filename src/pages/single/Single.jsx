import UserChart from "../../Components/chart/UserChart";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import UserPlans from "../../Components/plans/UserPlans";
import { useState, useEffect } from "react";
import "./single.scss";
import { Button } from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from '../../Api'; // Import the Axios instance

const Single = () => {
  const { id } = useParams(); // Récupération de l'ID de l'utilisateur depuis l'URL
  const location = useLocation();
  const userDataFromState = location.state?.id; // Récupérer l'ID envoyé par state
  const navigate = useNavigate(); //
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(userDataFromState); // Utilisation de data passée si elle existe
  const handleEdit = (id) => {
    navigate(`/edituser`, { state: { id } }); // Use the navigate function to pass state
  };

  useEffect(() => {
    const userId = userDataFromState || id; // Utiliser l'ID du state ou celui de l'URL
    const fetchUserData = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/cadex/users/${userId}`);
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [id, userDataFromState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <Button className="editButton" onClick={() => handleEdit(userDetails.id)} >Edit</Button>
          <h1 className="title">Information</h1>
            <div className="item">
            <img
  src={`data:image/jpeg;base64,${userDetails.profile_photo}`}
  alt="User Profile"
  className="itemImg"
/>

              <div className="details">
                <h1 className="itemTitle">{userDetails.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Matricule:</span>
                  <span className="itemValue">{userDetails.matricule}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userDetails.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{userDetails.telephone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Fonction:</span>
                  <span className="itemValue">{userDetails.fonction}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Direction:</span>
                  <span className="itemValue">{userDetails.direction}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Bureau:</span>
                  <span className="itemValue">{userDetails.bureau}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{userDetails.role}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
          <UserChart aspect={2 / 1} title="User Plans Chart" userId={userDetails.id} />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Plans</h1>
          <UserPlans userId={userDetails.id} />
          </div>
      </div>
    </div>
  );
};

export default Single;
