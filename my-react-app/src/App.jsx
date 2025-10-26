// Import React hooks and required Google Maps components
import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer,} from "@react-google-maps/api";
import "./App.css";

// Define the styling for the map container div
// 100% width and height means it fills its parent container
// Rounded corners make it look cleaner
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

function App() {

  // React state and references
  // --------------------------------------------------------------------
  const [center, setCenter] = useState({ lat: 35.85, lng: -86.35 }); // fallback

  // `places` will store an array of nearby park results
  const [places, setPlaces] = useState([]);

  // Store routes in state
  const [routes, setRoutes] = useState([]);

  // `mapRef` is a persistent reference to the Google Map object itself
  // This lets us access the map instance after it loads (without re-rendering)
  const mapRef = useRef(null);

  const [radius, setRadius] = useState(2000);


  // Get user's current location when the app first loads
  // --------------------------------------------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter({ lat: latitude, lng: longitude });
          console.log("User location:", latitude, longitude);
        },
        (err) => {
          console.warn("Geolocation failed or denied:", err);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);


  // Called once when the Google Map finishes loading
  // The map instance is passed into this function by the <GoogleMap> component
  // We store it in mapRef.current for later use (e.g., running API queries)
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Show routes to all marked parks
  // --------------------------------------------------------------------
  const handleShowAllRoutes = () => {
    if (!center || places.length === 0) return;

    const service = new window.google.maps.DirectionsService();
    const newRoutes = [];

    // Sequentially request routes (avoid API limit issues)
    const fetchRoute = (index) => {
      if (index >= places.length) {
        setRoutes(newRoutes);
        console.log(`Generated ${newRoutes.length} routes`);
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
          if (status === "OK") {
            newRoutes.push(result);
          } else {
            console.warn(
              `Route to ${places[index].name} failed:`,
              status
            );
          }
          // Throttle requests to avoid OVER_QUERY_LIMIT
          setTimeout(() => fetchRoute(index + 1), 200);
        }
      );
    };

    fetchRoute(0);
  };

  // Button click handler for finding nearby parks
  // --------------------------------------------------------------------
  const handleFindParks = () => {
    // Prevent trying to access the map before it's initialized
    if (!mapRef.current) return;

    // Define a Places API search request
    // - location: center point of search
    // - radius: how far out to look (in meters)
    // - type: category of places to find (see Google’s supported "types")
    const request = {
      location: center,
      radius: radius, // ~2km radius
      type: "park", // look for restaurants
    };

    // Create a new PlacesService instance using the loaded map
    // The service object provides methods like nearbySearch(), textSearch(), etc.
    const service = new window.google.maps.places.PlacesService(mapRef.current);

    // Execute the nearby search request
    // This asynchronously calls the Google Places API and returns a list of results
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Limit to 7 results
        const limitedResults = results.slice(0, 7);
        console.log(`Showing ${limitedResults.length} nearby parks:`, limitedResults);

        setPlaces(limitedResults);
      } else {
        console.error("Nearby search failed:", status);
      }
    });
  };










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
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          {/* The GoogleMap component renders the actual interactive map */}
          <GoogleMap
            mapContainerStyle={containerStyle} // set width/height from above
            center={center} // starting position of map
            zoom={13} // initial zoom level
            onLoad={handleMapLoad} // store reference once loaded
          >
            {/* Marker at the center of the map (for visual reference) */}
            <Marker
              position={center}
              title="You are here"
              icon={{
                url: "/pin2.png", // a file in your public/ folder
                scaledSize: { width: 100, height: 100 },
              }}
            />

            {/* Render all routes */}
            {routes.map((dir, i) => (
              <DirectionsRenderer key={i} directions={dir} options={{ suppressMarkers: true }} />
            ))}

            {/* For each place found in the nearby search, create a new Marker */}
            {places.map((place) => (
              <Marker
                key={place.place_id} // unique ID for each result
                position={{
                  lat: place.geometry.location.lat(), // convert from Google LatLng object
                  lng: place.geometry.location.lng(),
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* RIGHT SIDE: Info panel and button
         -------------------------------------------------------------- */}
      <div className="content-container">
        <div className="info-layout">
          <h1>RUN App</h1>
          <p>Track your runs and visualize your routes.</p>

          {/* Button that triggers the nearby restaurant search */}
          <div className="card">
            <button onClick={handleFindParks}>Find Parks</button>
            <p>Within</p>
            <select onChange={(e) => setRadius(Number(e.target.value))}>
              <option value="1609.34">1 Mile</option>
              <option value="3218.69">2 Miles</option>
              <option value="8046.72">5 Miles</option>
              <option value="16093.4">10 Miles</option>
            </select>
            <button onClick={handleShowAllRoutes}>
              Show Routes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
