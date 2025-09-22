import { Link, useLocation } from "react-router-dom";
import {
  Home,
  // Users,
  MessageSquareMore,
  Cuboid,
  Settings,
} from "lucide-react";
import Tooltip from "./ui/Tooltip";
import "./ui/Tooltip.css";

function SideNavbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname===path||location.pathname.startsWith(path+"/");
  };

  const navlinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/messages", icon: MessageSquareMore, label: "Messages" },
    { path: "/projects", icon: Cuboid, label: "Projects" },
    // { path: "/members", icon: Users, label: "Members" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];
  return (
    <div className="floating-navbar">
      <ul className="list-unstyled bg-light  shadow  rounded m-3 d-inline-flex flex-row flex-md-column gap-md-2">
        {navlinks.map((link) => (
          <li
            key={link.path}
            className={`position-relative m-2 ${
              isActive(link.path) ? "bg-primary rounded" : ""
            }`}
          >
            <Tooltip
              text={link.label}
              mobilePosition="top"
              desktopPosition="right"
            >
              <Link
                to={link.path}
                className={`d-flex align-items-center gap-1 gap-md-2 p-3 ${
                  isActive(link.path) ? "text-white" : "text-color"
                }`}
              >
                <link.icon className="w-4 h-4 md:w-6 md:h-6" />
              </Link>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default SideNavbar;
