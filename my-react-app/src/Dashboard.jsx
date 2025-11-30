// Import React hooks
import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";   // <-- make sure this file exists
import "./App.css";
import style from "/mapStyles/mapStyle.js";

// Route Functions
import { showRouteDashboard, findPlaces } from "./mapFunctions.js";

// Define the styling for the map container div
// 100% width and height means it fills its parent container
// Rounded corners make it look cleaner
const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
};
function App() {

    const [center, setCenter] = useState({ lat: 35.85, lng: -86.35 });
    const [places, setPlaces] = useState([]);
    const [routes, setRoutes] = useState([]);
    const mapRef = useRef(null);
    const [radius, setRadius] = useState(2000);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);


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


    // Load the list of routes every few sec
    useEffect(() => {
        if (!mapRef.current) return;   // WAIT for map to load

        const userId = localStorage.getItem("userId");
            if (!userId) return;

            const fetchSavedRoutes = async () => {
                    try {
                        const res = await fetch(`http://localhost:8080/api/auth/routes/${userId}`);
                        const data = await res.json();
                        
                        // Convert DB rows into Google Places-style objects
                        const compatiblePlaces = data.map(r => ({
                            name: r.route_name,
                            distance: r.distance_m,

                            // For Google Places compatibility
                            geometry: {
                                location: {
                                    lat: () => r.latitude,
                                    lng: () => r.longitude
                                }
                            },

                            // For DirectionsService compatibility
                            destination: { lat: Number(r.latitude), lng: Number(r.longitude) }

                        }));

                        // This updates the list used by showRouteDashboard()
                        setPlaces(compatiblePlaces);

                        // Now safely build the routes
                        showRouteDashboard(
                            mapRef,
                            center,
                            compatiblePlaces,
                            setRoutes,
                            setSelectedRouteIndex
                        );

                    } catch (err) {
                        console.error("Failed to fetch saved routes:", err);
                    }
                };

            fetchSavedRoutes(); // initial load
            const interval = setInterval(fetchSavedRoutes, 3000); // refresh every 3 sec

            return () => clearInterval(interval);
    }, [mapRef.current]);


    // Load the map, called in rendering section
    const handleMapLoad = (map) => {
        mapRef.current = map;
    };










    // Rendering
    // --------------------------------------------------------------------
    return (
        <div className="app-container">
            {/* LEFT SIDE: Map
           -------------------------------------------------------------- */}

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
                        options={{ 
                            styles: style || [],
                            disableDefaultUI: true,   // removes ALL controls
                        }}
                    >
                        <Marker
                            position={center}
                            title="You are here"
                            icon={{
                                url: "/pin2.png",
                                scaledSize: { width: 100, height: 100 },
                            }}
                        />

                        {selectedRouteIndex !== null && (
                            <DirectionsRenderer
                                directions={routes[selectedRouteIndex].directions}
                                options={{
                                    polylineOptions: {
                                    strokeColor: "#ff0000",
                                    strokeWeight: 5,
                                    strokeOpacity: 0.9
                                    },
                                }}
                            />
                        )}

         
                    </GoogleMap>
                </LoadScript>
            </div>









            {/* --------------- CENTER ---------------- */}

            <div className="dashboard-middle-container">
                <h1>Saved Locations</h1>
                <p>Click one to see the way there</p>


               {routes.length > 0 && (
                <div className="route-summary">
                    <h2>Your Routes</h2>

                    {routes.map((route, i) => (
                    <div 
                        key={i}
                        className="route-item"
                        onClick={() => setSelectedRouteIndex(i)}   // <-- CLICK SELECTS
                        style={{
                        cursor: "pointer",
                        background: selectedRouteIndex === i ? "rgba(0, 39, 146, 0.2)" : "transparent",
                        padding: "10px",
                        borderRadius: "6px",
                        }}
                    >
                        <div className="route-text">
                        <p className="route-name">{route.name}</p>
                        <p className="route-distance">
                            {(route.distance / 1000).toFixed(2)} km
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>















            {/* RIGHT SIDE: Info panel and button
           -------------------------------------------------------------- */}
            <div className="dashboard-right-container">
                <div className="info-layout">
                    <p>Pick which runs you have done already near you!</p>

                    {/* Button that triggers the nearby restaurant search */}
                    <div className="card">
                        <select onChange={(e) => setRadius(Number(e.target.value))}>
                            <option value="1609.34">1 Mile</option>
                            <option value="3218.69">2 Miles</option>
                            <option value="8046.72">5 Miles</option>
                            <option value="16093.4">10 Miles</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;