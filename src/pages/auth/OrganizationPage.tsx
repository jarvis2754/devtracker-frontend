import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrganizationPage() {
  const [mode, setMode] = useState<"join" | "create">("join"); // toggle
  const [orgId, setOrgId] = useState<number | "">("");
  const [passcode, setPasscode] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [orgDesc, setOrgDesc] = useState<string>("");

  const navigate = useNavigate();

  const handleJoin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = localStorage.getItem("pendingUserId");
    if (!userId) {
      alert("No user found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("https://devtracker-0es2.onrender.com/organization/join", {
        orgId: Number(orgId),
        passcode,
        userId: Number(userId),
      });

      alert("Successfully joined organization! Please login again.");
      localStorage.removeItem("pendingUserId");
      navigate("/login");
    } catch (err: any) {
      console.error("Join failed:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  // ✅ Create Organization
const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const userId = localStorage.getItem("pendingUserId");
  if (!userId) {
    alert("No user found. Please login again.");
    navigate("/login");
    return;
  }

  try {
    const response = await axios.post("https://devtracker-0es2.onrender.com/organization/create", {
      name: orgName,
      description: orgDesc,
      ownerId: Number(userId),
    });

    const createdOrg = response.data;

    alert(
      `Organization created successfully!\n` +
      `Organization ID: ${createdOrg.orgId}\n` +
      `Join Passcode: ${createdOrg.joinPasscode}\n\n` +
      `⚠️ Please save this passcode safely — you’ll need it for others to join.`
    );

    try {
      await axios.post("https://devtracker-0es2.onrender.com/organization/join", {
        orgId: Number(createdOrg.orgId),
        passcode: createdOrg.joinPasscode,
        userId: Number(userId),
      });
      localStorage.removeItem("pendingUserId");
      navigate("/login");
    } catch (err: any) {
      console.error("Join failed:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }

    localStorage.removeItem("pendingUserId");
    navigate("/login");
  } catch (err: any) {
    console.error("Create failed:", err);
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
          {/* Toggle Buttons */}
          <div className="d-flex justify-content-around mb-4">
            <button
              className={`btn ${mode === "join" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("join")}
            >
              Join Organization
            </button>
            <button
              className={`btn ${mode === "create" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setMode("create")}
            >
              Create Organization
            </button>
          </div>

          {/* Join Form */}
          {mode === "join" && (
            <form onSubmit={handleJoin}>
              <h2 className="text-center mb-3 fs-5">Join Organization</h2>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization ID"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value ? Number(e.target.value) : "")}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-primary btn-lg w-100 rounded-3"
                type="submit"
              >
                Join
              </button>
            </form>
          )}

          {/* Create Form */}
          {mode === "create" && (
            <form onSubmit={handleCreate}>
              <h2 className="text-center mb-3 fs-5">Create Organization</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control form-control-lg rounded-3"
                  placeholder="Organization Description"
                  value={orgDesc}
                  onChange={(e) => setOrgDesc(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-success btn-lg w-100 rounded-3"
                type="submit"
              >
                Create
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
