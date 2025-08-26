import { Link ,useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MessageSquareMore,
  ListTodo,
  Settings,
} from "lucide-react";

export default function Navbar() {

  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  }

  const navlinks =[
    { path: "/", icon:Home ,label:"Home"},
    { path: "/messages", icon: MessageSquareMore ,label:"Messages"},
    { path: "/tasks", icon: Users ,label:"Tasks"},
    { path: "/members", icon: ListTodo ,label:"Members"},
    { path: "/settings", icon: Settings ,label:"Settings"},
  ]

  return (
    <nav className="d-flex flex-column position-fixed" style={{ height: "100vh", width: "100vw" }} >
      <div>
        <h1 className="text-dark mx-3">Dev Tracker</h1>
      </div>
      <div className="d-flex align-items-end align-items-md-center justify-content-center justify-content-md-start "style={{ height: "100vh" }} >
        <ul className="list-unstyled shadow  rounded m-3 d-inline-flex  flex-row flex-md-column gap-4">
          {navlinks.map((link) => (
            <li key={link.path}  className={`p-3 m-2 rounded ${isActive(link.path) ? "active" : ""}`}>
              <Link to={link.path} className="text-color text-decoration-none">
                <link.icon size={24} />
                <span className="custom-tooltip rounded px-3 py-1">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
