import axios from "axios";
import { useState, type FormEvent } from "react";
import  { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [userName ,setUserName] = useState<string>("");
  const [email ,setEmail] = useState<string>("");
  const [password ,setPassword] = useState<string>("");
  const [position,setPosition] = useState<string>("");

  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call your Spring Boot signup endpoint
      await axios.post("http://localhost:8080/api/auth/signup", {
        userName,
        email,
        password,
        position,
      });

      // After successful signup -> redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed! Please try again.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 bg-white rounded-4 shadow p-4">
          <h1 className="fw-bold mb-3 text-center fs-4 fs-md-3 fs-lg-2 text-nowrap">
            Create Your Account
          </h1>
          <p className="text-muted mb-4 text-center">Sign up to get started</p>


          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                placeholder="Full Name"
                value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              />
            </div>
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
            <div className="mb-3">
            <select
              className="form-control form-control-lg rounded-3"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="">Select Position</option>
              
              <option value="MANAGER">Manager</option>
              <option value="DEVELOPER">Developer</option>
              <option value="TESTER">Tester</option>
              <option value="CLIENT">Client</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-3"
              style={{
                background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
                border: "none",
              }}
            >
              Sign Up
            </button>
            <div className="text-center mt-3">
              <a href="#" className="text-primary text-decoration-none">
                Already have an account? Sign In
              </a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
