import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeamMember } from "../types/ProjectTypes";

interface Organization {
  id: number;
  name: string;
  creatorId: number;
}

const BASE_URL = "https://devtracker-0es2.onrender.com";

const Settings: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<TeamMember | null>(null);

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const axiosAuthConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /** ─────────── QUERIES ─────────── **/

  // Fetch user
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<TeamMember>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/user/${userId}`, axiosAuthConfig);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch organization (mocked — replace with API if you have one)
  const {
    data: org,
    isLoading: orgLoading,
    error: orgError,
  } = useQuery<Organization>({
    queryKey: ["organization"],
    queryFn: async () => {
      return { id: 1, name: "My Organization", creatorId: 1 };
    },
    staleTime: Infinity,
  });

  /** ─────────── MUTATIONS ─────────── **/

  const updateUserMutation = useMutation({
    mutationFn: (updated: TeamMember) =>
      axios.put(
        `${BASE_URL}/user/update/${updated.userId}`,
        updated,
        axiosAuthConfig
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const regeneratePasscodeMutation = useMutation({
    mutationFn: () =>
      axios.post(`${BASE_URL}/organization/${org?.id}/regenerate/${org?.creatorId}`),
  });

  const showPasscodeMutation = useMutation({
    mutationFn: () =>
      axios.get(`${BASE_URL}/organization/${org?.id}/passcode/${org?.creatorId}`),
  });

  /** ─────────── HANDLERS ─────────── **/

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updatedUser) return;
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUserUpdate = () => {
    if (updatedUser) updateUserMutation.mutate(updatedUser);
    setEditMode(false);
  };

  /** ─────────── UI ─────────── **/
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
                {userLoading && <p>Loading user...</p>}
                {userError && <p className="text-danger">Failed to load user</p>}
                {user && (
                  <form className="row g-3">
                    {editMode ? (
                      <>
                        <div className="col-12">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="userName"
                            value={updatedUser?.userName ?? user.userName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={updatedUser?.email ?? user.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12 d-flex gap-2 mt-2">
                          <button
                            type="button"
                            className="btn btn-primary flex-fill"
                            onClick={handleUserUpdate}
                            disabled={updateUserMutation.isPending}
                          >
                            {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
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
                        <p><strong>Name:</strong> {user.userName}</p>
                        <p><strong>UserId:</strong> {user.uuid}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button
                          type="button"
                          className="btn btn-primary mt-2"
                          onClick={() => {
                            setEditMode(true);
                            setUpdatedUser(user);
                          }}
                        >
                          Edit User
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Organization Settings */}
            <div className="card shadow-sm border-info">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">Organization Settings</h4>
              </div>
              <div className="card-body">
                {orgLoading && <p>Loading org...</p>}
                {orgError && <p className="text-danger">Failed to load org</p>}
                {org && user && (
                  <div className="d-flex gap-2 flex-column flex-md-row">
                    <p><strong>Organization:</strong> {org.name}</p>
                    <button
                      className="btn btn-success"
                      onClick={() => showPasscodeMutation.mutate()}
                      disabled={user.userId !== org.creatorId}
                    >
                      {showPasscodeMutation.isPending ? "Loading..." : "Show Passcode"}
                    </button>
                    <button
                      className="btn btn-warning text-white"
                      onClick={() => regeneratePasscodeMutation.mutate()}
                      disabled={user.userId !== org.creatorId}
                    >
                      {regeneratePasscodeMutation.isPending ? "Working..." : "Regenerate Passcode"}
                    </button>
                  </div>
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
