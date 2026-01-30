import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: ""
  });
  const [error, setError] = useState("");

  /* Load users */
  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  /* Add user */
  const addUser = async () => {
    setError("");

    if (!form.name || !form.email || !form.age) {
      setError("All fields are required");
      return;
    }

    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        age: Number(form.age)   // 🔥 FIXED
      })
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to add user");
      return;
    }

    const data = await res.json();
    setUsers([...users, data]);
    setForm({ name: "", email: "", age: "" });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h1>User Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Add User</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br />

      <input
        placeholder="Age"
        type="number"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />
      <br />

      <button onClick={addUser}>Add User</button>

      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} | {u.email} | {u.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
