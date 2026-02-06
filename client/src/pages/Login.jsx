import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      
      // Fetch user info to check role
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Login successful!");
      
      // Redirect based on role
      if (userRes.data.role === "admin") {
        window.location = "/admin";
      } else {
        window.location = "/dashboard";
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <h3>Login</h3>
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
      <button className="btn btn-success" onClick={submit}>
        Login
      </button>
    </div>
  );
}
