import "./plans.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../Api"; // Import the Axios instance
import ShowAlert from "../../Components/ShowAlert";
import ShowAlertConf from "../../Components/ShowAlertConf";
const planColumns = [
  { field: "id", headerName: "Plan ID", width: 200 },
  { field: "idParcelle", headerName: "Nicad", width: 150 },
  { field: "dateCreation", headerName: "Date", width: 130 },
  { field: "typePlan", headerName: "Type Plan", width: 120 },
];

const Userplans = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les plans et le matricule de l'utilisateur
  useEffect(() => {
    if (!userId) {
      console.error("userId manquant !");
      return;
    }

    const fetchPlans = async () => {
      try {
        const response = await api.get(
          `http://127.0.0.1:8000/cadex/user/${userId}/plans/`
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des plans de l'utilisateur :",
          error
        );
        setLoading(false);
      }
    };

   

    fetchPlans();
  }, [userId]);
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
      console.error("PDF URL non trouvé pour le plan ID :", planId);
    }
  };
 
  const handleDelete = async (id) => {
    const confirmed = await new Promise((resolve) => {
      ShowAlertConf(
        "warning",
        "Are you sure you want to delete this Plan?",
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
      await api.delete(`http://127.0.0.1:8000/cadex/plans/${id}/delete`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      ShowAlert("success", "Plan deleted successfully!");

    } catch (error) {
      console.error("Error deleting data:", error);
      ShowAlert("error", error.response?.data?.detail || "An error occurred while deleting the user.");

    }
  };
  return (
    <div className="datatable">
      <div className="datatableTitle" style={{ color: "#b69d3f" }}>
        Historique Plans
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={[
            ...planColumns,
            {
              field: "generate",
              headerName: "Generate",
              width: 150,
              renderCell: (params) => (
                <Button
                  className="generateButton"
                  onClick={() =>  handleViewPdf(params.id)}
                  // Désactiver si matricule non prêt
                >
                  Generate
                </Button>
              ),
            },
            {
              field: "delete",
              headerName: "Delete",
              width: 100,
              renderCell: (params) => (
                <Button
                  color="error"
                  onClick={() => handleDelete(params.row.id)}
                >
                  Supprimer
                </Button>
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      )}
    </div>
  );
};

export default Userplans;
