export const displayMap = (locations) => {
  // Initialize the map and disable the default zoom control
  const map = L.map('map', { zoomControl: false });

  // Add zoom control at bottom left
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // Loads the background map (tiles) from OpenStreetMap and adds it to the Leaflet map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Store marker coordinates
  const points = locations.map(({ coordinates, day, description }) => {
    const [lng, lat] = coordinates;
    L.marker([lat, lng])
      .addTo(map)
      .bindTooltip(
        `<p style="font-size: 10px;">Day ${day}: ${description}</p>`,
        {
          permanent: true,
          direction: 'top',
          offset: [-14, -14],
        },
      );
    return [lat, lng];
  });

  // Fit all the markers within the visible area
  map.fitBounds(L.latLngBounds(points).pad(0.5));

  // Disable zoom by mouse wheel
  map.scrollWheelZoom.disable();
};
