const locations = [
    // DHA Offices
    { name: "DHA - Johannesburg Central", lat: -26.2046, lon: 28.0409 },
    { name: "DHA - Pretoria", lat: -25.7461, lon: 28.1881 },
    { name: "DHA - Durban", lat: -29.8587, lon: 31.0218 },
    { name: "DHA - Cape Town", lat: -33.9180, lon: 18.4233 },
    { name: "DHA - Bloemfontein", lat: -29.1183, lon: 26.2296 },
    { name: "DHA - Polokwane", lat: -23.9045, lon: 29.4689 },
    { name: "DHA - Kimberley", lat: -28.7383, lon: 24.7636 },
    { name: "DHA - Nelspruit", lat: -25.4658, lon: 30.9850 },
    { name: "DHA - East London", lat: -33.0153, lon: 27.9116 },
    { name: "DHA - Port Elizabeth", lat: -33.9608, lon: 25.6022 },

    // Major Bank Branches (Head Offices or Major Hubs)
    { name: "FNB - Bank City (JHB)", lat: -26.2044, lon: 28.0456 },
    { name: "Standard Bank - Rosebank", lat: -26.1444, lon: 28.0367 },
    { name: "ABSA Bank - Main Johannesburg", lat: -26.2041, lon: 28.0488 },
    { name: "Nedbank - Sandton", lat: -26.1075, lon: 28.0568 },
    { name: "Capitec - Stellenbosch HQ", lat: -33.9346, lon: 18.8610 },
    { name: "Investec Bank - Sandton", lat: -26.1073, lon: 28.0565 },
    { name: "African Bank - Midrand HQ", lat: -26.0051, lon: 28.1319 },
    { name: "TymeBank - Rosebank", lat: -26.1456, lon: 28.0367 },
    { name: "Discovery Bank - Sandton", lat: -26.1071, lon: 28.0555 },
    { name: "Bidvest Bank - Melrose Arch", lat: -26.1348, lon: 28.0683 }
];

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showNearestLocations, showError, {
            enableHighAccuracy: true,
            timeout: 10000
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showNearestLocations(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    const locationsWithDistance = locations.map(loc => {
        const distance = getDistance(userLat, userLon, loc.lat, loc.lon);
        return { ...loc, distance };
    });

    locationsWithDistance.sort((a, b) => a.distance - b.distance);

    const container = document.getElementById("locations");
    container.innerHTML = "<h2>Nearest Locations:</h2>";

    locationsWithDistance.slice(0, 5).forEach(loc => {
        const div = document.createElement("div");
        div.classList.add("location");
        div.innerHTML = `<strong>${loc.name}</strong> — ${loc.distance.toFixed(2)} km away — 
          <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lon}" target="_blank">View on Map</a>`;
        container.appendChild(div);
    });
}

function showError(error) {
    let msg = "";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            msg = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            msg = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            msg = "An unknown error occurred.";
            break;
    }
    alert("Error getting location: " + msg);
}