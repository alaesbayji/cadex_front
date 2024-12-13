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
  const [matricule, setMatricule] = useState("");

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
    const fetchMatricule = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8000/cadex/users/self/");
        console.log("Matricule fetched:", response.data.matricule);
        setMatricule(response.data.matricule);
      } catch (error) {
        console.error("Error fetching matricule:", error);
      }
    };

    fetchPlans();
    fetchMatricule();
  }, [userId]);
  const handleGenerate = (row) => {
    const { typePlan, idParcelle } = row;
    const formattedIdParcelle = String(idParcelle).padStart(16, "0");

    const url = `http://127.0.0.1:8000/media/plans/${matricule}/${matricule}_${typePlan}_${formattedIdParcelle}.pdf`;
    window.open(url, "_blank");
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
                  onClick={() => handleGenerate(params.row)}
                >
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
