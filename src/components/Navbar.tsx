import { Link } from "react-router-dom";
import {
  Home,
  Users,
  MessageSquareMore,
  ListTodo,
  Settings,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="d-flex flex-column" style={{ height: "100vh" }} >
      <div>
        <h1 className="text-dark mx-3">Dev Tracker</h1>
      </div>
      <div className="d-flex align-items-end align-items-md-center justify-content-center justify-content-md-start "style={{ height: "100vh" }} >
        <ul className="list-unstyled shadow  rounded m-3 d-inline-flex  flex-row flex-md-column gap-5">
          <li className="p-3 ">
            <Link to="/" className="text-color text-decoration-none" >
              <Home className="text-dark" size={24} />
            </Link>
          </li>
          <li className="p-3">
            <Link to="/about" className="text-color text-decoration-none">
              <MessageSquareMore className="text-dark" size={24} />
            </Link>
          </li>
          <li className="p-3">
            <Link to="/projects" className="text-color text-decoration-none">
              <Users className="text-dark" size={24} />
            </Link>
          </li>
          <li className="p-3 ">
            <Link to="/contact" className="text-color text-decoration-none">
              <ListTodo className="mx-auto text-dark" size={24} />
            </Link>
          </li>
          <li className="p-3 ">
            <Link to="/settings" className="text-color text-decoration-none">
              <Settings className="text-dark" size={24} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
