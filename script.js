// Sample vehicle data
const vehicles = [
    { id: 1, name: "Truck 1", lat: 40.7128, lng: -74.0060, speed: 65, status: "Moving" },
    { id: 2, name: "Van 1", lat: 40.7580, lng: -73.9855, speed: 45, status: "Stopped" },
    { id: 3, name: "Car 1", lat: 40.7829, lng: -73.9654, speed: 55, status: "Moving" }
];

// Initialize map
let map = L.map('map').setView([40.7128, -74.0060], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Store markers
let markers = {};

// Initialize vehicle list
function initializeVehicles() {
    const vehiclesList = document.getElementById('vehiclesList');
    
    vehicles.forEach(vehicle => {
        // Create vehicle card
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card';
        vehicleCard.innerHTML = `<strong>${vehicle.name}</strong>`;
        vehicleCard.onclick = () => showVehicleDetails(vehicle);
        vehiclesList.appendChild(vehicleCard);

        // Add marker to map
        const marker = L.marker([vehicle.lat, vehicle.lng])
            .bindPopup(vehicle.name)
            .addTo(map);
        markers[vehicle.id] = marker;
    });
}

// Show vehicle details
function showVehicleDetails(vehicle) {
    const selectedVehicle = document.getElementById('selectedVehicle');
    selectedVehicle.innerHTML = `
        <p><strong>Vehicle ID:</strong> ${vehicle.id}</p>
        <p><strong>Name:</strong> ${vehicle.name}</p>
        <p><strong>Speed:</strong> ${vehicle.speed} mph</p>
        <p><strong>Status:</strong> ${vehicle.status}</p>
        <p><strong>Location:</strong> ${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}</p>
    `;

    // Center map on selected vehicle
    map.setView([vehicle.lat, vehicle.lng], 14);
    markers[vehicle.id].openPopup();

    // Update selected state
    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.classList.remove('selected');
        if (card.textContent === vehicle.name) {
            card.classList.add('selected');
        }
    });
}

// Initialize the system
initializeVehicles();

// Simulate vehicle movement (for demo purposes)
setInterval(() => {
    vehicles.forEach(vehicle => {
        if (vehicle.status === "Moving") {
            vehicle.lat += (Math.random() - 0.5) * 0.001;
            vehicle.lng += (Math.random() - 0.5) * 0.001;
            markers[vehicle.id].setLatLng([vehicle.lat, vehicle.lng]);
        }
    });
}, 2000);
