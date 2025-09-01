import { useState,type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials!");
    }
  };

  return (
    <div
      className="container signup-page d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="signup-card z-3">
        <h1 className="fw-bold mb-2">Login</h1>
        <p className="text-muted mb-4">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control form-control-lg rounded-3"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg rounded-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 rounded-3"
            style={{
              background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
              border: "none",
            }}
          >
            Login
          </button>
          <div className="text-center mt-3">
            <Link to="/signup" className="text-primary text-decoration-none">
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
