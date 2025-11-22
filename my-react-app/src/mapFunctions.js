// I pulled these functions out of the main file becauase they are big and kind of separate from everything else
  

// === Find Places (parks, gyms, etc.) ===
// Using preferences from the arguments, finds places that fit criteria. This will be farily large as i deal with elevation and stuff
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
        if (status === "OK") newRoutes.push(result);

        setTimeout(() => fetchRoute(index + 1), 200);
      }
    );
  };

  fetchRoute(0);
}

