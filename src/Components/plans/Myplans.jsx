import "./plans.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../Api"; // Import the Axios instance

const planColumns = [
  { field: "id", headerName: "Plan ID", width: 200 },
  { field: "idParcelle", headerName: "Nicad", width: 150 }, // Utilisation de 'idParcelle' à la place de 'idparcelle'
  { field: "dateCreation", headerName: "Date", width: 130 }, // Utilisation de 'dateCreation' pour la date
  { field: "typePlan", headerName: "Type Plan", width: 120 }, // Utilisation de 'typePlan' à la place de 'id_couche'

];

const Myplans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 0; // Remplacez ceci par l'ID de l'utilisateur actuel

  // Charger les plans de l'utilisateur actuel
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:8000/cadex/plans/my-history/`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user plans:", error);
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

  return (
    <div className="datatable">
      <div className="datatableTitle" style={{ color: "#b69d3f" }}>
        Historique Plans
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={[
            ...planColumns,
          {
              field: "action",
              headerName: "Action",
              width: 150,
              renderCell: (params) => (
                <Button
                  className="generateButton"
                  onClick={() =>  handleViewPdf(params.id)}                >
                  Generate
                </Button>
              ),
            },
          ]}          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      )}
    </div>
  );
};

export default Myplans;
