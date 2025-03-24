import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./MapView.css"; // Import CSS

function MapView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Default values of inida
  const [mapData, setMapData] = useState({
    center: [20.5937, 78.9629],
    zoom: 4,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    axios
      .get("http://localhost:5000/api/map", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const lat = parseFloat(searchParams.get("lat")) || res.data.center[0];
        const lng = parseFloat(searchParams.get("lng")) || res.data.center[1];
        const zoom = res.data.zoom;

        setMapData({ center: [lat, lng], zoom });
      })
      .catch(() => navigate("/"));
  }, [navigate, searchParams]);

  return (
    <div className="map-container">
      <h2>Map View</h2>
      <MapContainer
        center={mapData.center}
        zoom={mapData.zoom}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={mapData.center} />
      </MapContainer>
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default MapView;
