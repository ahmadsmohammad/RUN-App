// Import React hooks and required Google Maps components
import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";   // <-- make sure this file exists
import "./App.css";

// Define the styling for the map container div
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

function HomePage() {
  const [center, setCenter] = useState({ lat: 35.85, lng: -86.35 });
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState([]);
  const mapRef = useRef(null);
  const [radius, setRadius] = useState(2000);

  const navigate = useNavigate(); // <-- routing hook

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

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Show all routes
  const handleShowAllRoutes = () => {
    if (!center || places.length === 0) return;

    const service = new window.google.maps.DirectionsService();
    const newRoutes = [];

    const fetchRoute = (index) => {
      if (index >= places.length) {
        setRoutes(newRoutes);
        return;
      }

      const destination = {
        lat: places[index].geometry.location.lat(),
        lng: places[index].geometry.location.lng(),
      };

      service.route(
        {
          origin: center,
          destination,
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK") newRoutes.push(result);

          setTimeout(() => fetchRoute(index + 1), 200);
        }
      );
    };

    fetchRoute(0);
  };

  // Find parks
  const handleFindParks = () => {
    if (!mapRef.current) return;

    const request = {
      location: center,
      radius: radius,
      type: "park",
    };

    const service = new window.google.maps.places.PlacesService(
      mapRef.current
    );

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results.slice(0, 7));
      }
    });
  };

  // Fake login
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

  // UI
  return (
    <div className="app-container">
      <div className="map-container">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={handleMapLoad}
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
                options={{ suppressMarkers: true }}
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
            <button onClick={goToDashboard}>Dashboard</button> {/* <-- NEW BUTTON */}
          </div>

          <div className="card">
            <button onClick={handleFindParks}>Find Parks</button>
            <p>Within</p>
            <select onChange={(e) => setRadius(Number(e.target.value))}>
              <option value="1609.34">1 Mile</option>
              <option value="3218.69">2 Miles</option>
              <option value="8046.72">5 Miles</option>
              <option value="16093.4">10 Miles</option>
            </select>
            <button onClick={handleShowAllRoutes}>Show Routes</button>
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
