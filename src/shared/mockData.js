export const mockStats = [
  { title: "Active Rooms", value: 6 },
  { title: "Pending Recommendations", value: 2 },
  { title: "Total Users", value: 18 },
];

export const mockRecommendations = [
  { id: 1, room: "Room A", message: "Increase temperature by 2°C", status: "Pending" },
  { id: 2, room: "Room B", message: "Ventilation required - CO2 high", status: "Pending" },
];

export const mockRooms = [
  { id: 1, name: "Room A", status: "Available" },
  { id: 2, name: "Room B", status: "Occupied" },
  { id: 3, name: "Room C", status: "Maintenance" },
];
