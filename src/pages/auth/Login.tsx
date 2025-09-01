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
   <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 bg-white rounded-4 shadow p-5">
          <h1 className="fw-bold mb-3 text-center fs-4 fs-md-3 fs-lg-2 text-nowrap">
            Welcome Back
          </h1>
          <p className="text-muted mb-4 text-center">Sign in to continue</p>

          <form>
            <div className="mb-3">
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                placeholder="Email Address"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                placeholder="Password"
              />
            </div>
            <button
              className="btn btn-primary btn-lg w-100 rounded-3"
              style={{
                background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
                border: "none",
              }}
            >
              Sign In
            </button>
            <div className="text-center mt-3">
              <a href="#" className="text-primary text-decoration-none">
                Don’t have an account? Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
