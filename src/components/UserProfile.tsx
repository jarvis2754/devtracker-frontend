import { useEffect, useState } from "react";
import axios from "axios";
import { decodeJwt } from "jose";
import Logout from "./Logout";
import { CircleUserRound } from "lucide-react";

interface UserProfileProps {
  onClose: () => void;
}

interface UserDTO {
  userId: number;
  userName: string;
  email: string;
  uuid: string;
  position: string;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) {
      setError("No JWT token found in localStorage under key 'token'.");
      return;
    }

    const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

    try {
      const decoded: any = decodeJwt(token);
      const uid = decoded?.userId ?? null;

      if (!uid) {
        setError("Token does not contain userId claim.");
        return;
      }
      console.log("Decoded userId:", uid);

      axios
        .get<UserDTO>(`https://devtracker-0es2.onrender.com/user/${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          setError("Failed to fetch user.");
          console.error("Failed to fetch user", err);
        });
    } catch (err) {
      setError("Failed to decode JWT token.");
      console.error(err);
    }
  }, []);

  return (
    <div
      className="card shadow position-absolute mt-2"
      style={{
        right: "-100%",
        top: "100%",
        width: "300px",
        borderRadius: "12px",
        zIndex: 1000,
      }}
    >
      <div className="card-body">
        {error && <p className="text-danger small">{error}</p>}
        {user ? (
          <>
            <div className="d-flex m-4 justify-content-center">
              <CircleUserRound size={60} />
            </div>
            <h5 className="text-muted text-center">{user.uuid}</h5>
            <h6 className="fw-bold pt-3">{user.userName}</h6>
            <p className="text-muted small mb-2">{user.email}</p>
            <p className="small">Position: {user.position}</p>
            <hr />

            <a href="/settings" className="d-block mb-2 text-decoration-none">
              Settings
            </a>
            <button
              className="btn btn-link text-danger text-decoration-none p-0"
              onClick={onClose}
            >
              <Logout />
            </button>
          </>
        ) : (
          !error && <p className="text-muted small">Loading...</p>
        )}
      </div>
    </div>
  );
}
