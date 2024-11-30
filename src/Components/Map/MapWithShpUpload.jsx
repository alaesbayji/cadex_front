import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import shp from "shpjs";
import JSZip from "jszip";
import axios from "axios";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWithShpUpload = ({ geojsonData, setGeojsonData, onNICADSend }) => {
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const mapRef = useRef();

  const handlePolygonClick = (feature) => {
    setSelectedPolygon(feature);
  };

  useEffect(() => {
    if (geojsonData && mapRef.current) {
      const bounds = L.geoJSON(geojsonData).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geojsonData]);

  return (
    <div>
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={5}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            onEachFeature={(feature, layer) => {
              layer.on("click", () => handlePolygonClick(feature,layer));
              const popupContent = Object.entries(feature.properties)
                .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
                .join("<br/>");
              layer.bindPopup(popupContent);
            }}
          />
        )}
      </MapContainer>
      {selectedPolygon && (
        <button
          className="bg-blue-300 p-4 text-black"
          onClick={() => onNICADSend(selectedPolygon.properties.nicad)}
        >
          Envoyer NICAD
        </button>
      )}
    </div>
  );
};

export default MapWithShpUpload;
