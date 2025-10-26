import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./App.css";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const center = { lat: 35.85, lng: -86.35 };

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      {/* Left side - Map */}
      <div className="map-container">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Right side - Content */}
      <div className="content-container">
        <h1>RUN App</h1>
        <p>Track your runs and visualize your routes.</p>

        <div className="card">
          <button onClick={() => setCount((c) => c + 1)}>
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
