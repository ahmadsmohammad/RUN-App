// I pulled these functions out of the main file becauase they are big and kind of separate from everything else


// === Find Places (parks, gyms, etc.) ===
// Using preferences from the arguments, finds places that fit criteria. This will be farily large as i deal with elevation and stuff
export function findPlaces(
  mapRef,
  center,
  distance,
  placeType,
  timeGoal,
  shape,
  surface,
  elevation,
  milePace,
  mode,
  setPlaces,
  callback
) {
  if (!mapRef.current)
    return;

  // Convert time → distance
  if (mode === "time")
    distance = (timeGoal / milePace) * 1609.34;

  // Out-and-back = half the distance outward
  if (shape === "out-back")
    distance = distance / 2;

  const request = {
    location: center,
    radius: distance,
    type: placeType,
  };

  const service = new window.google.maps.places.PlacesService(mapRef.current);

  service.nearbySearch(request, (results, status) => {
    if (status !== window.google.maps.places.PlacesServiceStatus.OK)
      return;


    // Start filtering
    let filtered = results.slice();

    // Surface filter
    filtered = filtered.filter((p) => surfaceMatches(p, surface));

    // Apply elevation filter
    applyElevationFilter(filtered, elevation, center, (elevFiltered) => {
      // Now we have elevation-filtered results
      let finalResults = elevFiltered.slice(0, 10); 

      setPlaces(finalResults);

      if (callback) callback(finalResults);
    });
  });
}




// === Show All Routes ===========
// Generates the routes from the list of places. This shouldnt change much since finding the places is the hard part.
export function showAllRoutes(mapRef, center, places, setRoutes) {
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
        if (status === "OK") {
          // newRoutes.push(result);
          newRoutes.push({
            directions: result,
            distance: result.routes[0].legs[0].distance.value, // meters
            name: places[index].name
          });
        }

        setTimeout(() => fetchRoute(index + 1), 200);
      }
    );
  };

  fetchRoute(0);
}


// === Show Individial Routes ===========
// Shows the route that you click on
export function showRouteDashboard(mapRef, center, places, setRoutes, setSelectedRouteIndex) {
  if (!center || places.length === 0) return;

  const service = new window.google.maps.DirectionsService();
  const newRoutes = [];

  const fetchRoute = (index) => {
    if (index >= places.length) {
      
      setRoutes(prevRoutes => {
        const sameLength = prevRoutes.length === newRoutes.length;

        // Check if all routes match by destination coordinates
        const isSame = sameLength && prevRoutes.every((r, i) => {
          const a = r.directions.routes[0].legs[0].end_location;
          const b = newRoutes[i].directions.routes[0].legs[0].end_location;
          return a.lat() === b.lat() && a.lng() === b.lng();
        });

        // If routes are identical → DO NOT update state → NO jitter
        if (isSame) return prevRoutes;

        return newRoutes;
      });

      setSelectedRouteIndex((prevIndex) => {
        return prevIndex !== null && prevIndex < newRoutes.length
          ? prevIndex
          : null;
      });
      return;
    }

    const destination = places[index].destination;

    service.route(
      {
        origin: center,
        destination,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          // newRoutes.push(result);
          newRoutes.push({
            directions: result,
            distance: result.routes[0].legs[0].distance.value, // meters
            name: places[index].name
          });
        }

        setTimeout(() => fetchRoute(index + 1), 200);
      }
    );
  };

  fetchRoute(0);
}



// Filter by elevation
async function applyElevationFilter(places, elevationBias, center, callback) {
  const elevationService = new window.google.maps.ElevationService();

  // Get elevation at the starting point
  const startElevation = await getElevation(center);

  // Get elevations for all candidate places
  const locations = places.map((p) => ({
    lat: p.geometry.location.lat(),
    lng: p.geometry.location.lng(),
  }));

  elevationService.getElevationForLocations(
    { locations },
    (results, status) => {
      if (status !== "OK") return callback(places);

      // Compute elevation CHANGE, not absolute elevation
      const enriched = places.map((place, i) => ({
        ...place,
        elevation: results[i].elevation,
        elevationChange: results[i].elevation - startElevation,
      }));

      // Sort by desired profile
      if (elevationBias < 0) {
        // prefer flat (smallest absolute change)
        enriched.sort((a, b) =>
          Math.abs(a.elevationChange) - Math.abs(b.elevationChange)
        );
      } else {
        // prefer hilly (largest absolute change)
        enriched.sort((a, b) =>
          Math.abs(b.elevationChange) - Math.abs(a.elevationChange)
        );
      }

      callback(enriched.slice(0, 10));
    }
  );
}

// Get the elevation of a point
function getElevation(point) {
  return new Promise((resolve) => {
    const service = new window.google.maps.ElevationService();
    service.getElevationForLocations(
      { locations: [point] },
      (results, status) => {
        if (status === "OK") resolve(results[0].elevation);
        else resolve(null);
      }
    );
  });
}




// Filter by surface
function surfaceMatches(place, surface) {
  if (surface === "any") return true;

  const t = place.types || [];

  if (surface === "trail") {
    return (
      t.includes("park") ||
      t.includes("campground") ||
      t.includes("natural_feature") ||
      t.includes("tourist_attraction")
    );
  }

  if (surface === "road") {
    return (
      t.includes("gym") ||
      t.includes("restaurant") ||
      t.includes("store") ||
      t.includes("school") ||
      t.includes("church")
    );
  }

  return true;
}