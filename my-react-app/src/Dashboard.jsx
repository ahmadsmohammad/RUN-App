// Import React hooks
import { useState, useRef, useEffect } from "react";


// Define the styling for the map container div
// 100% width and height means it fills its parent container
// Rounded corners make it look cleaner
const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
};

function App() {

    // Rendering
    // --------------------------------------------------------------------
    return (
        <div className="app-container">
            {/* LEFT SIDE: Map
           -------------------------------------------------------------- */}
            <div className="map-container">
                {/* LoadScript dynamically loads the Google Maps JavaScript API */}
                {/* The `libraries` prop is required to use the Places API */}
                {/* This must wrap any component that uses Google Maps features */}
            </div>

            {/* RIGHT SIDE: Info panel and button
           -------------------------------------------------------------- */}
            <div className="content-container">
                <div className="info-layout">
                    <h1>RUN App</h1>
                    <p>Track your runs and visualize your routes.</p>

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