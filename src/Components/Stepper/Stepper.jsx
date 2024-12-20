import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import shp from "shpjs";
import JSZip from "jszip";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import * as L from "leaflet";
import "./stepper.css";
import ShowAlert from "../ShowAlert";

const Stepper = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [formData, setFormData] = useState(null); // Stockage des données pour envoi
  const [loading, setLoading] = useState(false); // Loading state
  const mapRef = useRef();
  const authToken = localStorage.getItem('access');
  const [planType, onPlanTypeChange] = useState(null);
  const [abortController, setAbortController] = useState(null); // Abort controller
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fonction pour traiter l'upload ZIP et préparer les données
  const handlePrepareData = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      ShowAlert('error', 'Veuillez sélectionner un fichier ZIP.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Extraire le contenu du fichier ZIP
      const zip = await JSZip.loadAsync(arrayBuffer);
      const requiredFiles = ["shp", "shx", "dbf", "prj"];
      const filesToUpload = new FormData();

      for (const extension of requiredFiles) {
        const fileEntry = Object.entries(zip.files).find(([fileName]) =>
          fileName.endsWith(`.${extension}`)
        );
        if (fileEntry) {
          const [fileName, fileContent] = fileEntry;
          const blob = await fileContent.async("blob");
          filesToUpload.append(extension, blob, fileName);
        } else {
          alert(`Le fichier .${extension} est manquant dans l'archive.`);
          return;
        }
      }

      // Convertir en GeoJSON pour affichage
      const geojson = await shp(arrayBuffer);
      if (!geojson || !geojson.features) {
        console.error("Le fichier ZIP ne contient pas de données valides.");
        ShowAlert('error', 'Le fichier ZIP ne contient pas de données valides.');
        return;
      }
      setGeojsonData(geojson); // Afficher les données sur la carte
      setFormData(filesToUpload); // Stocker pour envoi
      ShowAlert('success', 'Les données ont été chargées avec succès !');

    } catch (error) {
      console.error("Erreur lors du traitement du fichier ZIP:", error);
      ShowAlert('error', 'Une erreur est survenue lors de la préparation des données.');

    }
  };
  // Fonction pour annuler l'opération
  const handleCancel = () => {
    if (abortController) {
      abortController.abort(); // Annuler la requête en cours
      setAbortController(null);
      setLoading(false);
    } else {
      ShowAlert("info", "Aucune opération en cours à annuler.");
    }
  };

  // Fonction pour réinitialiser les données
  const handleClear = () => {
    setGeojsonData(null);
    setSelectedPolygon(null);
    setFormData(null);
    onPlanTypeChange(null);
    ShowAlert("info", "Les données ont été effacées.");
  };
  // Fonction pour envoyer les données au backend
  const handleSendData = async () => {
    if (!selectedPolygon) {
      ShowAlert("error", "Veuillez sélectionner un polygone avant d'envoyer.");
      return;
    }
  
    if (!formData) {
      ShowAlert("error", "Veuillez importer et préparer les données avant d'envoyer.");
      return;
    }
  
    if (!planType || planType === "null") { // Vérifie si planType est null ou non sélectionné
      ShowAlert("error", "Veuillez sélectionner un type de plan avant d'envoyer.");
      return;
    }
  
    setLoading(true);
  
    const controller = new AbortController();
    setAbortController(controller);
  
    try {
      formData.append("typePlan", planType);
      formData.append("idParcelle", selectedPolygon.properties.nicad);
  
      const response = await axios.post(
        "http://127.0.0.1:8000/cadex/upload-fichier/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        }
      );
      console.log("Réponse du backend:", response.data);
      setPdfUrl(response.data.pdf_url); // Stocker l'URL du PDF

      ShowAlert("success", "Les données ont été envoyées avec succès !");
    } catch (error) {
      if (axios.isCancel(error)) {
        ShowAlert("info", "L'envoi a été annulé.");
      } else {
        ShowAlert("error", "Une erreur est survenue lors de l'envoi des données.");
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };
  
  // Gestion du clic sur un polygone
  const handlePolygonClick = (feature) => {
    setSelectedPolygon(feature);
  };

  // Ajuster la carte lorsque geojsonData est défini
  useEffect(() => {
    if (geojsonData && mapRef.current) {
      const bounds = L.geoJSON(geojsonData).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geojsonData]);

  return (
    <>
      <div className="file-selection-container">
        <h3>Import File</h3>
        <input type="file" onChange={handlePrepareData} accept=".zip" />

        <div className="plan-type-selection-container">
          <h3>Select the type of plan</h3>
          <select
  value={planType}
  onChange={(e) => onPlanTypeChange(e.target.value)}
>
  <option value="null">Select plan type</option>
  <option value="Plan A">Plan CIC</option>
  <option value="Plan B">Amorcellement</option>
  <option value="Plan C">Délimitation</option>
</select>

        </div>
      </div>

      <MapContainer
        center={[14.6928, -17.4467]} // Coordonnées de Dakar
        zoom={14}
        style={{ height: "70vh", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            onEachFeature={(feature, layer) => {
              layer.on("click", () => handlePolygonClick(feature));

              // Extraire les propriétés que vous souhaitez afficher
              const { OBJECTID, région, départeme, commune, VillageQua, InumParcell, nicad } = feature.properties;

              // Créer le contenu HTML du popup avec ces propriétés
              const popupContent = `
                <strong>OBJECTID:</strong> ${OBJECTID}<br/>
                <strong>Région:</strong> ${région}<br/>
                <strong>Département:</strong> ${départeme}<br/>
                <strong>Commune:</strong> ${commune}<br/>
                <strong>Village:</strong> ${VillageQua}<br/>
                <strong>Numéro de parcelle:</strong> ${InumParcell}<br/>
                <strong>NICAD:</strong> ${nicad}
              `;

              // Lier le contenu du popup au layer
              layer.bindPopup(popupContent);
            }}
          />
        )}
          {loading && (
        <div className="loading-overlay" >
                    Le Plan est entrain de generation ...<br></br>

          <div className="loading-spinner">
          </div>

        </div>
      )}
      </MapContainer>

    

      <div className="button-group">
      <button className="btn cancel-button" onClick={handleSendData}>
          Generer
        </button>
        <button className="btn cancel-button" onClick={handleCancel}>
          Annuler
        </button>
        <button className="btn clear-button" onClick={handleClear}>
          Effacer
        </button>
        {pdfUrl && (
  <div className="pdf-link">
    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
      Voir le plan généré (PDF)
    </a>
  </div>
)}

      </div>
    </>
  );
};

export default Stepper;
