import { CircleUserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decodeJwt } from "jose";
import Logout from "./Logout";

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

const fetchUser = async (): Promise<UserDTO> => {
  const rawToken = localStorage.getItem("token");
  if (!rawToken) throw new Error("No JWT token found in localStorage.");

  const token = rawToken.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

  const decoded: any = decodeJwt(token);
  const uid = decoded?.userId;
  if (!uid) throw new Error("Token does not contain userId claim.");

  const res = await axios.get<UserDTO>(
    `https://devtracker-0es2.onrender.com/user/${uid}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export default function UserProfile({ onClose }: UserProfileProps) {
  const { data: user, error, isLoading } = useQuery<UserDTO, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 1, // retry once on failure
  });

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
        {isLoading && <p className="text-muted small">Loading...</p>}
        {error && <p className="text-danger small">{error.message}</p>}
        {user && !isLoading && !error && (
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
        )}
      </div>
    </div>
  );
}
