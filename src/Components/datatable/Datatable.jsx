// src/components/Datatable.jsx
import './datatable.scss';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../Api'; // Import the Axios instance
import ShowAlert from "../../Components/ShowAlert";
import ShowAlertConf from "../../Components/ShowAlertConf";

const Datatable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  // Load data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/cadex/users/'); // Use the Axios instance
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        // Optionally, handle unauthorized access (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Delete a user
  const handleDelete = async (userData) => {
    // Affiche une alerte de confirmation personnalisée
    const confirmed = await new Promise((resolve) => {
      ShowAlertConf(
        "warning",
        "Are you sure you want to delete this user?",
        {
          confirmButtonText: "Yes, delete",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        }
      );
    });
  
    if (!confirmed) return; // Si l'utilisateur annule, arrêtez la suppression
  
    try {
      // Suppression de l'utilisateur via l'API
      await api.delete(`http://127.0.0.1:8000/cadex/users/${userData.id}/delete/`); 
  
      // Mise à jour de l'état après suppression
      setData(data.filter((item) => item.id !== userData.id));
      ShowAlert("success", "User deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error.response?.data || error.message);
      ShowAlert("error", error.response?.data?.detail || "An error occurred while deleting the user.");
  
      // Redirection vers login si non autorisé
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };
  
  

  // Function to navigate to "Single" with the data
  const handleView = (userData) => {
    navigate(`/users/${userData.id}`, { state: { id: userData.id } }); // Passe uniquement l'ID via state
  };
  

  const userColumns = [
    { field: 'matricule', headerName: 'Matricule', width: 100 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 230 },
    { field: 'telephone', headerName: 'Phone', width: 150 },
    { field: 'fonction', headerName: 'Fonction', width: 100 },
    { field: 'direction', headerName: 'Direction', width: 100 },
    { field: 'bureau', headerName: 'Bureau', width: 100 },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.role}`}>
            {params.row.role}
          </div>
        );
      },
    },
  ];

  const actionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => handleView(params.row)} // Call handleView instead of Link
            >
              View
            </div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle" style={{ color: '#b69d3f' }}>
        Users Management
        <Link to="/users/new" className="link">
          Add New User
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
