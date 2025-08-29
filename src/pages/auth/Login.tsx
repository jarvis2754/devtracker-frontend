export default function Login() {
  return (
  
  <div className="login-card">

    <div className="d-flex align-items-center justify-content-center mb-3 flex-wrap">
      <img src="https://img.icons8.com/ios-filled/50/2563eb/code.png" alt="Logo" className="me-2" style={{ width: "40px" }} />
      <h2 className="fw-bold m-0 fs-4">DevTracker</h2>
    </div>

  
    <form>
      <div className="mb-3">
        <input type="text" className="form-control form-control-lg rounded-3" placeholder="Username"/>
      </div>
      <div className="mb-2">
        <input type="password" className="form-control form-control-lg rounded-3" placeholder="Password"/>
      </div>

      <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold mt-2">
        Log in
      </button>
      <a href="#" className="d-block mt-3 text-decoration-none text-primary">Forgot password?</a>
    </form>
  </div>


  );
}
