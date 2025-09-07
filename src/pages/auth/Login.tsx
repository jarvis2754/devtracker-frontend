import { useState, type FormEvent } from "react";
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

      const data = response.data;

      if (data.status === "SUCCESS") {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else if (data.status === "NO_ORG") {
        // Save userId temporarily
        localStorage.setItem("pendingUserId", data.userId);
        alert("You must join an organization before logging in.");
        navigate("/join-organization");
      }
    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 bg-white rounded-4 shadow p-5">
          <h1 className="fw-bold mb-3 text-center fs-4">Welcome Back</h1>
          <p className="text-muted mb-4 text-center">Sign in to continue</p>

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
              className="btn btn-primary btn-lg w-100 rounded-3"
              style={{
                background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
                border: "none",
              }}
            >
              Sign In
            </button>
            <div className="text-center mt-3">
              <Link to="/signup" className="text-primary text-decoration-none">
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
