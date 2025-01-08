import "./plans.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../Api"; // Import the Axios instance
import ShowAlert from "../../Components/ShowAlert";
import ShowAlertConf from "../../Components/ShowAlertConf";

const planColumns = [
  { field: "id", headerName: "ID du plan", width: 200 },
  { field: "matricule", headerName: "Matricule", width: 250 },
  { 
    field: "idParcelle", 
    headerName: "Nicad", 
    width: 150 },  { field: "Date", headerName: "Date", width: 130 }, // Utilisation de 'dateCreation' pour la date
  { field: "typePlan", headerName: "Type de plan", width: 120 }, // Utilisation de 'typePlan' à la place de 'id_couche'

];

const Plans = () => {
  const [data, setData] = useState([]);

  // Charger les plans depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8000/cadex/plans/history/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
  fetchData();
}, []);

const getPdfUrlByPlanId = (planId) => {
  if (!data) return null;
  const plan = data.find((plan) => plan.id === planId);
  return plan ? plan.pdf_url : null;
};

const handleViewPdf = (planId) => {
  const pdfUrl = getPdfUrlByPlanId(planId);
  if (pdfUrl) {
    window.open(pdfUrl, "_blank");
  } else {
    console.error(" PDF non trouvé pour le plan ID :", planId);
  }
};
  // Supprimer un plan
  const handleDelete = async (id) => {
    const confirmed = await new Promise((resolve) => {
      ShowAlertConf(
        "warning",
        "Êtes-vous sûr de vouloir supprimer ce plan ?",
        {
          confirmButtonText: "Oui, supprimer",
          cancelButtonText: "Annuler",
          showCancelButton: true,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        }
      );
    });
  
    if (!confirmed) return; // Si l'utilisateur annule, arrêtez la suppression
    try {
      await api.delete(`http://127.0.0.1:8000/cadex/plans/${id}/delete`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      ShowAlert("success", "Plan supprimé avec succès !");

    } catch (error) {
      console.error("Error deleting data:", error);
      ShowAlert("error", error.response?.data?.detail || "An error occurred while deleting the user.");

    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle" style={{ color: "#b69d3f" }}>
      Gestion des plans
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={[
          ...planColumns,
          {
            field: "delete",
            headerName: "Supprimer",
            width: 100,
            renderCell: (params) => (
              <Button
              color="error"
              onClick={() => handleDelete(params.row.id)}
              
            >
              Supprimer
            </Button>
            ),
          }, {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
              <Button
                className="generateButton"
                onClick={() =>  handleViewPdf(params.id)}                
              >
                Générer
              </Button>
            ),
          },
        ]}        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default Plans;
