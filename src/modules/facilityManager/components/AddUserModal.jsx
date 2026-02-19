import { useState } from "react";

export default function AddUserModal({ close, addUser }) {
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.role) {
      alert("All fields required");
      return;
    }
    addUser(form);
    close();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add User</h3>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="">Select Role</option>
          <option>Employee</option>
          <option>Moderator</option>
          <option>Guest</option>
        </select>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
