export default function Signup() {
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 bg-white rounded-4 shadow p-4">
          <h1 className="fw-bold mb-3 text-center fs-4 fs-md-3 fs-lg-2 text-nowrap">
            Create Your Account
          </h1>
          <p className="text-muted mb-4 text-center">Sign up to get started</p>

          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                placeholder="Full Name"
              />
            </div>
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
