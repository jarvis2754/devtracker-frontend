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
    <nav className="bg-gray-900 m-2 px-6 py-3 shadow-md row ">
      <h1 className="text-2xl font-bold">DevTracker</h1>

      <div className="col-1 col-lg-2  flex justify-between items-center border rounded">
        {/* Links */}
        <ul className="flex list-unstyled flex-wrap justify-between sm:space-x-6">
          <li className="px-2 py-3">
            <Link
              to="/"
              className="text-color text-decoration-none hover:text-gray-300"
            >
              <Home className="me-2 text-color" size={24} />
              <span className="d-none d-lg-inline">Home</span>
            </Link>
          </li>
          <li className="px-2 py-3">
            <Link
              to="/about"
              className="text-color text-decoration-none hover:text-gray-300"
            >
              <MessageSquareMore className="me-2 text-color" size={24} />
              <span className="d-none d-lg-inline">Messages</span>
            </Link>
          </li>
          <li className="px-2 py-3">
            <Link
              to="/projects"
              className="text-color text-decoration-none hover:text-gray-300"
            >
              <Users className="me-2 text-color" size={24} />
              <span className="d-none d-lg-inline">Tasks</span>
            </Link>
          </li>
          <li className="px-2 py-3">
            <Link
              to="/contact"
              className="text-color text-decoration-none hover:text-gray-300"
            >
              <ListTodo className="me-2 text-color" size={24} />
              <span className="d-none d-lg-inline">Members</span>
            </Link>
          </li>
          <li className="px-2 py-3">
            <Link
              to="/settings"
              className="text-color text-decoration-none hover:text-gray-300"
            >
              <Settings className="me-2 text-color" size={24} />
              <span className="d-none d-lg-inline">Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
