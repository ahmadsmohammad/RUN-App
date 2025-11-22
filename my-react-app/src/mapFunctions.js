// ---- Find Places (parks, gyms, etc.) ----
export function findPlaces(mapRef, center, radius, placeType, setPlaces, callback) {
  if (!mapRef.current) return;

  const request = {
    location: center,
    radius,
    type: placeType,
  };

  const service = new window.google.maps.places.PlacesService(mapRef.current);

  service.nearbySearch(request, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      const limited = results.slice(0, 10);
      setPlaces(limited);

      if (callback) callback(limited);
    }
  });
}



// ---- Show All Routes (walking directions) ----
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
        if (status === "OK") newRoutes.push(result);

        setTimeout(() => fetchRoute(index + 1), 200);
      }
    );
  };

  fetchRoute(0);
}




// ---- Generate Route (temporary placeholder) ----
export function generateCustomRoute(distance, customDistance, timeGoal, shape, surface, elevation) {
  const prefs = {
    distance: distance === "custom" ? customDistance : distance,
    timeGoal,
    shape,
    surface,
    elevation,
  };

  console.log("Generating route with preferences:", prefs);

  return prefs; // returning in case you need it later
}
