import { useState } from "react";
import AddUserModal from "../components/AddUserModal";

export default function FM_Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addUser = (user) => setUsers([...users, user]);

  return (
    <div>
      <h2>User Management</h2>
      <button onClick={() => setShowModal(true)}>Add User</button>

      {showModal && (
        <AddUserModal close={() => setShowModal(false)} addUser={addUser} />
      )}

      <div className="list">
        {users.map((u, i) => (
          <div key={i} className="card">
            {u.name} - {u.role}
          </div>
        ))}
      </div>
    </div>
  );
}
