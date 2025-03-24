import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import CSS

function Dashboard() {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(res.data.cards);
      } catch (err) {
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  // Function to search for locations using OpenStreetMap API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: searchQuery, format: "json", limit: 5 },
      });

      if (res.data.length > 0) {
        setSearchResults(res.data); // Store search results
      } else {
        alert("Location not found!");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((place, index) => (
            <div
              key={index}
              className="search-item"
              onClick={() => navigate(`/map?lat=${place.lat}&lng=${place.lon}`)}
            >
              {place.display_name}
            </div>
          ))}
        </div>
      )}

      {/* Predefined Locations */}
      <div className="cards-container">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="card" 
            onClick={() => navigate(`/map?lat=${card.coordinates[0]}&lng=${card.coordinates[1]}`)}
          >
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>

      <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
