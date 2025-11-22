// Import React hooks and required Google Maps components
import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import "./App.css";
import style from "/mapStyles/mapStyle.js";
import { findPlaces, showAllRoutes, generateCustomRoute } from "./mapFunctions.js";


// Define the styling for the map container div
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const libraries = ["places"];

// Colors array
const routeColors = [
  "#FF0000", "#0000FF", "#008000", "#FFA500", "#00FFFF",
  "#00FF00", "#FF00FF", "#000000", "#FFD700", "#40E0D0"
];

// Main Function
function HomePage() {
  // Initialize variables
  const [center, setCenter] = useState({ lat: 35.85, lng: -86.35 });
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [placeType, setPlaceType] = useState("park");

  const mapRef = useRef(null);

  // Route-building preferences
  const [radius, setRadius] = useState(2000);
  const [distance, setDistance] = useState(5000);
  const [customDistance, setCustomDistance] = useState(null);
  const [timeGoal, setTimeGoal] = useState(null);
  const [shape, setShape] = useState("loop");
  const [surface, setSurface] = useState("any");
  const [elevation, setElevation] = useState(0);

  const navigate = useNavigate();

  // Go to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };


  // Get location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn("Geolocation denied:", err)
      );
    }
  }, []);




  // =================== Route functions, defined in mapFunctions.js ===================
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Show all routes
  const handleShowAllRoutes = () => {
    showAllRoutes(mapRef, center, results, setRoutes);
  };

  const handleFindPlaces = () => {
    findPlaces(mapRef, center, radius, placeType, setPlaces, (results));
  };


    // Login Placeholders
  const handleSignIn = () => {
    const user = prompt("Enter your username:");
    const pass = prompt("Enter your password:");
    console.log("Login:", user, pass);
  };

  const handleNewUser = () => {
    const user = prompt("Enter a username:");
    const pass = prompt("Enter a password:");
    console.log("New User:", user, pass);
  };














  // ================= UI =======================================
  return (
    <div className="app-container">
      <div className="map-container">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={handleMapLoad}
            options={{ styles: style || [] }} // safety fallback
          >
            <Marker
              position={center}
              title="You are here"
              icon={{
                url: "/pin2.png",
                scaledSize: { width: 100, height: 100 },
              }}
            />

            {routes.map((dir, i) => (
              <DirectionsRenderer
                key={i}
                directions={dir}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: routeColors[i % routeColors.length],
                    strokeWeight: 5,
                    strokeOpacity: 0.9,
                  },
                }}
              />
            ))}

            {places.map((place) => (
              <Marker
                key={place.place_id}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="content-container">
        <div className="info-layout">
          <h1>RUN App</h1>
          <p>Track your runs and visualize your routes.</p>

          <div className="button-row">
            <button onClick={handleSignIn}>Login</button>
            <button onClick={handleNewUser}>New User?</button>
            <button onClick={goToDashboard}>Dashboard</button>
          </div>

          <div className="card">
            <h2>Find places to run </h2>
            <button onClick={() => { handleFindPlaces(); handleShowAllRoutes(); }}>Show Routes</button>
          </div>




          <div className="route-preferences-card">
            <h2>Route Preferences</h2>

            {/* Places Options */}
            <label>Type</label>
            <select onChange={(e) => setPlaceType(e.target.value)}>
              <option value="park">Parks</option>
              <option value="gym">Gyms</option>
              <option value="tourist_attraction">Attractions</option>
              <option value="cafe">Cafes</option>
              <option value="restaurant">Restaurants</option>
            </select>

            {/* Distance Target */}
            <label>Distance Target</label>
            <select onChange={(e) => setDistance(e.target.value)}>
              <option value="3000">3 km</option>
              <option value="5000">5 km</option>
              <option value="10000">10 km</option>
              <option value="custom">Custom</option>
            </select>

            {distance === "custom" && (
              <input
                type="number"
                placeholder="Distance in meters"
                onChange={(e) => setCustomDistance(Number(e.target.value))}
              />
            )}

            {/* Desired Time */}
            <label>Time Goal (minutes)</label>
            <input
              type="number"
              placeholder="30"
              onChange={(e) => setTimeGoal(Number(e.target.value))}
            />

            {/* Route Shape */}
            <label>Route Shape</label>
            <select onChange={(e) => setShape(e.target.value)}>
              <option value="loop">Loop</option>
              <option value="out-back">Out & Back</option>
            </select>

            {/* Surface Preference */}
            <label>Surface Preference</label>
            <select onChange={(e) => setSurface(e.target.value)}>
              <option value="any">Any</option>
              <option value="road">Road</option>
              <option value="trail">Trail</option>
            </select>

            {/* Elevation Bias */}
            <label>Elevation Profile</label>
            <input
              type="range"
              min="-1"
              max="3000"
              step="1"
              onChange={(e) => setElevation(Number(e.target.value))}
            />
            <div className="elevation-labels">
              <span>Flat</span>
              <span>Hilly</span>
            </div>

            {/* Generate
            <button onClick={handleGenerateRoute}>Generate Route</button> */}

          </div>
        </div>
      </div>
    </div>
  );
}

// ---- ROUTES WRAPPER ----
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
