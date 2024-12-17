const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

// Dummy vehicle data
const vehicles = {
  'vehicle1': { id: 'vehicle1', name: 'Truck 1', location: { lat: 40.7128, lng: -74.0060 } },
  'vehicle2': { id: 'vehicle2', name: 'Van 1', location: { lat: 40.7580, lng: -73.9855 } },
  'vehicle3': { id: 'vehicle3', name: 'Car 1', location: { lat: 40.7829, lng: -73.9654 } }
};

// Simulate vehicle movement
function updateVehicleLocations() {
  Object.values(vehicles).forEach(vehicle => {
    vehicle.location.lat += (Math.random() - 0.5) * 0.001;
    vehicle.location.lng += (Math.random() - 0.5) * 0.001;
  });
  io.emit('locationUpdate', vehicles);
}

// Update locations every 2 seconds
setInterval(updateVehicleLocations, 2000);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initialData', vehicles);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
