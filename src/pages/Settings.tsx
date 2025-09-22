import React, { useEffect, useState } from "react";
import axios from "axios";
import type { TeamMember } from "../types/ProjectTypes";

interface Organization {
  id: number;
  name: string;
  creatorId: number;
}

const BASE_URL = "https://devtracker-0es2.onrender.com";

const Settings: React.FC = () => {
  const [user, setUser] = useState<TeamMember | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<TeamMember | null>(null);

  const token = localStorage.getItem("token");

  const axiosAuthConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) return;

    const userId = JSON.parse(atob(token.split(".")[1])).userId;

    axios
      .get(`${BASE_URL}/user/${userId}`, axiosAuthConfig)
      .then((res) => {
        setUser(res.data);
        setUpdatedUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [token]);

  useEffect(() => {
    setOrg({ id: 1, name: "My Organization", creatorId: 1 });
  }, []);

  const handleUserUpdate = () => {
    if (!updatedUser) return;

    axios
      .put(`${BASE_URL}/user/update/${updatedUser.userId}`, updatedUser, axiosAuthConfig)
      .then(() => {
        alert("User updated successfully!");
        setUser(updatedUser);
        setEditMode(false);
      })
      .catch(() => alert("Failed to update user"));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updatedUser) return;
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleRegeneratePasscode = () => {
    if (!org || !user) return;

    axios
      .post(`${BASE_URL}/organization/${org.id}/regenerate/${org.creatorId}`)
      .then((res) => alert(`New organization passcode: ${res.data}`))
      .catch(() => alert("Failed to regenerate passcode"));
  };

  const handleShowPasscode = () => {
    if (!org || !user) return;

    axios
      .get(`${BASE_URL}/organization/${org.id}/passcode/${org.creatorId}`)
      .then((res) => alert(`Organization passcode: ${res.data}`))
      .catch(() => alert("Failed to fetch passcode"));
  };

  return (
    <div className="container py-5">
      <div style={{ paddingTop: "60px" }}>
        <h1 className=" mb-4 text-center">Settings</h1>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            {/* User Settings */}
            <div className="card shadow-sm mb-4 border-primary">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">User Settings</h4>
              </div>
              <div className="card-body">
                {user ? (
                  <form className="row g-3">
                    {editMode ? (
                      <>
                        <div className="col-12">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="userName"
                            value={updatedUser?.userName || ""}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={updatedUser?.email || ""}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="col-12 d-flex flex-column flex-md-row gap-2 mt-2">
                          <button
                            type="button"
                            className="btn btn-primary flex-fill"
                            onClick={handleUserUpdate}
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary flex-fill"
                            onClick={() => setEditMode(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-12">
                          <p>
                            <strong>Name:</strong> {user.userName}
                          </p>
                          <p>
                            <strong>UserId:</strong> {user.uuid}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                        </div>
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-primary mt-2 w-100 w-md-auto"
                            onClick={() => setEditMode(true)}
                          >
                            Edit User
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                ) : (
                  <p>Loading user data...</p>
                )}
              </div>
            </div>

            {/* Organization Settings */}
            <div className="card shadow-sm border-info">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">Organization Settings</h4>
              </div>
              <div className="card-body">
                {org && user ? (
                  <div className="d-flex flex-column align-items-center flex-md-row gap-2">
                    <p className="mb-2 mb-md-0">
                      <strong>Organization:</strong> {org.name}
                    </p>
                    <button
                      className={`btn ${user.userId === org.creatorId ? "btn-success" : "btn-secondary disabled"} flex-fill`}
                      onClick={handleShowPasscode}
                      disabled={user.userId !== org.creatorId}
                    >
                      Show Passcode
                    </button>
                    <button
                      className={`btn ${user.userId === org.creatorId ? "btn-warning text-white" : "btn-secondary disabled"} flex-fill`}
                      onClick={handleRegeneratePasscode}
                      disabled={user.userId !== org.creatorId}
                    >
                      Regenerate Passcode
                    </button>
                  </div>
                ) : (
                  <p>Loading organization data...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
