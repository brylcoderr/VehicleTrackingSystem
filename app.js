let map;
let markers = {};
let selectedVehicle = null;

// Initialize map
function initMap() {
    map = L.map('map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Initialize Socket.IO connection
const socket = io();

// Handle initial data
socket.on('initialData', (vehicles) => {
    updateVehicleList(vehicles);
    updateMarkers(vehicles);
});

// Handle location updates
socket.on('locationUpdate', (vehicles) => {
    updateVehicleList(vehicles);
    updateMarkers(vehicles);
});

function updateVehicleList(vehicles) {
    const vehicleList = document.getElementById('vehicleList');
    vehicleList.innerHTML = '';

    Object.values(vehicles).forEach(vehicle => {
        const card = document.createElement('div');
        card.className = `vehicle-card ${selectedVehicle === vehicle.id ? 'selected' : ''}`;
        card.innerHTML = `
            <h3>${vehicle.name}</h3>
            <p>Lat: ${vehicle.location.lat.toFixed(4)}</p>
            <p>Lng: ${vehicle.location.lng.toFixed(4)}</p>
        `;
        card.onclick = () => {
            selectedVehicle = vehicle.id;
            map.setView([vehicle.location.lat, vehicle.location.lng], 15);
            updateVehicleList(vehicles);
        };
        vehicleList.appendChild(card);
    });
}

function updateMarkers(vehicles) {
    Object.values(vehicles).forEach(vehicle => {
        if (markers[vehicle.id]) {
            markers[vehicle.id].setLatLng([vehicle.location.lat, vehicle.location.lng]);
        } else {
            const marker = L.marker([vehicle.location.lat, vehicle.location.lng])
                .bindPopup(vehicle.name)
                .addTo(map);
            markers[vehicle.id] = marker;
        }
    });
}

// Initialize map when page loads
window.onload = initMap;
