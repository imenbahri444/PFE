import { useState } from "react";
import { mockRooms } from "../../../shared/mockData";

export default function FM_Rooms() {
  const [rooms, setRooms] = useState(mockRooms);

  const toggleStatus = (id) => {
    setRooms(
      rooms.map(r =>
        r.id === id
          ? { ...r, status: r.status === "Available" ? "Maintenance" : "Available" }
          : r
      )
    );
  };

  return (
    <div>
      <h2>Rooms Management</h2>
      {rooms.map(room => (
        <div key={room.id} className="card">
          <h4>{room.name}</h4>
          <p>Status: {room.status}</p>
          <button onClick={() => toggleStatus(room.id)}>Toggle Status</button>
        </div>
      ))}
    </div>
  );
}
