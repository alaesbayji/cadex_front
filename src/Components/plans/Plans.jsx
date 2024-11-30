import "./plans.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../Api"; // Import the Axios instance

const planColumns = [
  { field: "id", headerName: "Plan ID", width: 200 },
  { field: "username", headerName: "Username", width: 250 },
  { field: "idParcelle", headerName: "Nicad", width: 150 }, // Utilisation de 'idParcelle' à la place de 'idparcelle'
  { field: "dateCreation", headerName: "Date", width: 130 }, // Utilisation de 'dateCreation' pour la date
  { field: "typePlan", headerName: "Type Plan", width: 120 }, // Utilisation de 'typePlan' à la place de 'id_couche'
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => (
      <Button
        className="generateButton"
        onClick={() => console.log(`Generating plan for ${params.row.username}`)}
      >Generate
        {params.row.Action}
      </Button>
    ),
  },
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

  // Supprimer un plan
  const handleDelete = async (id_plan) => {
    try {
      await axios.delete(`http://localhost:3001/plans/${id_plan}`);
      setData(data.filter((item) => item.id_plan !== id_plan));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle" style={{ color: "#b69d3f" }}>
        Plan Management
      </div>
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
        ]}        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default Plans;
