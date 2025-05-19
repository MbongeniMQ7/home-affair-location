function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function loadAndFindLocations() {
  const container = document.getElementById("locations");
  container.innerHTML = "⏳ Loading locations...";

  fetch("branches.json")
    .then(res => res.json())
    .then(data => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => showNearestLocations(pos, data),
          err => container.innerHTML = "❌ Failed to get your location."
        );
      } else {
        container.innerHTML = "❌ Geolocation not supported.";
      }
    })
    .catch(err => {
      container.innerHTML = "❌ Error loading data.";
      console.error(err);
    });
}

function showNearestLocations(position, locations) {
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;

  const withDistances = locations.map(loc => ({
    ...loc,
    distance: getDistance(userLat, userLon, loc.lat, loc.lon)
  }));

  withDistances.sort((a, b) => a.distance - b.distance);

  const container = document.getElementById("locations");
  container.innerHTML = "<h2>Nearest Locations:</h2>";

  withDistances.slice(0, 5).forEach(loc => {
    const div = document.createElement("div");
    div.className = "location";
    div.innerHTML = `
      <strong>${loc.name}</strong><br>
      ${loc.distance.toFixed(2)} km away<br>
      <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lon}" target="_blank">View on Map</a>
    `;
    container.appendChild(div);
  });
}
