import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });

  const submit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered successfully! You can now login.");
      window.location = "/login";
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <h3>Register</h3>
      <div style={{ maxWidth: "400px" }}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-100 mt-2" onClick={submit}>
          Register
        </button>
      </div>
    </div>
  );
}
