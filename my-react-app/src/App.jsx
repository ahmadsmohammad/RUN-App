import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./App.css";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const center = { lat: 35.85, lng: -86.35 };

function App() {
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null); // reference to the map instance

  // Runs once when map is loaded
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Triggered when user clicks the button
  const handleFindRestaurants = () => {
    if (!mapRef.current) return;

    const request = {
      location: center,
      radius: 2000,
      type: "restaurant",
    };

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Nearby results:", results);
        setPlaces(results);
      } else {
        console.error("Nearby search failed:", status);
      }
    });
  };

  return (
    <div className="app-container">
      {/* Left side - Map */}
      <div className="map-container">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]} // <-- important for PlacesService
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={handleMapLoad}
          >
            {/* Marker for map center */}
            <Marker position={center} />

            {/* Markers for each found place */}
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

      {/* Right side - Content */}
      <div className="content-container">
        <h1>RUN App</h1>
        <p>Track your runs and visualize your routes.</p>

        <div className="card">
          <button onClick={handleFindRestaurants}>Find Restaurants</button>
        </div>
      </div>
    </div>
  );
}

export default App;
