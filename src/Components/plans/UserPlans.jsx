import "./plans.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../Api"; // Import the Axios instance

const planColumns = [
  { field: "id", headerName: "Plan ID", width: 200 },
  { field: "idParcelle", headerName: "Nicad", width: 150 },
  { field: "dateCreation", headerName: "Date", width: 130 },
  { field: "typePlan", headerName: "Type Plan", width: 120 },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
      <Button
        className="generateButton"
        onClick={() =>
          console.log(`Generating plan for ${params.row.username}`)
        }
      >
        Generate {params.row.Action}
      </Button>
    ),
  },
];

const Userplans = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les plans de l'utilisateur en fonction de l'userId
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
        console.error("Erreur lors de la récupération des plans de l'utilisateur :", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userId]);

  const handleDelete = async (id_plan) => {
    try {
      await api.delete(`http://127.0.0.1:8000/cadex/plans/${id_plan}/`);
      setData(data.filter((item) => item.id !== id_plan));
    } catch (error) {
      console.error("Erreur lors de la suppression du plan :", error);
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
