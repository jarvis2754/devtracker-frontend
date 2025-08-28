import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MessageSquareMore,
  ListTodo,
  Settings,
  CircleUserRound,
  Bell,
  Plus,
  Search,
} from "lucide-react";
import Tooltip from "./ui/Tooltip";
import "./ui/Tooltip.css"

export default function Navbar() {

  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  }

  const navlinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/messages", icon: MessageSquareMore, label: "Messages" },
    { path: "/tasks", icon: Users, label: "Tasks" },
    { path: "/members", icon: ListTodo, label: "Members" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ]

  const navIcons = [
    { icon: Settings, label: "Settings" },
    { icon: Bell, label: "Notifications" },
    { icon: CircleUserRound, label: "Profile" },
  ]

  const searchAndAdd = [
    { icon: Search, label: "Search" },
    { icon: Plus, label: "Create" },
  ]


  return (
    <nav className="d-flex flex-column position-fixed z-3" style={{ height: "100vh", width: "100vw" }} >
      <div className="d-flex justify-content-between shadow p-1">
        <div className="d-flex align-items-center">
          <h2 className="text-dark mx-1 mx-md-3 fw-bolder ">DevTracker.</h2>
        </div>
        <div className="d-flex align-items-center   justify-content-end  gap-3 w-50 w-md-50 me-1">
          <input type="text" placeholder="Search..." className="d-none d-md-block rounded border border-dark py-2 px-3 w-100" />

          <button className="btn btn-primary d-none d-md-flex align-items-center ">
            <Plus size={16} /> Create
          </button>
          <ul className="list-unstyled d-flex d-md-none  my-auto gap-1">
            {searchAndAdd.map((item, index) => (
              <li key={index} className="">
                <Tooltip text={item.label} mobilePosition="bottom" desktopPosition="bottom">
                  <div className="d-flex align-items-center gap-2 p-2">
                    <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="list-unstyled d-flex flex-row my-3 gap-1 gap-md-3">
            {navIcons.map((item, index) => (
              <li key={index} className="position-relative  ">
                <Tooltip text={item.label} mobilePosition="bottom" desktopPosition="bottom">
                  <div className="d-flex align-items-center gap-2 p-2">
                    <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </Tooltip>
              </li>

            ))}
          </ul>
        </div>
      </div>
      <div className="d-flex align-items-end align-items-md-center justify-content-center justify-content-md-start " style={{ height: "80vh" }} >
        <ul className="list-unstyled shadow  rounded m-3 d-inline-flex flex-row flex-md-column dap-2 gap-md-4">
          {navlinks.map((link) => (
            <li key={link.path} className={`position-relative m-2 ${isActive(link.path) ? 'bg-primary rounded' : ''}`}>
              <Tooltip text={link.label} mobilePosition="top" desktopPosition="right">
                <Link to={link.path} className={`d-flex align-items-center gap-1 gap-md-2 p-3 ${isActive(link.path) ? 'text-white' : 'text-color'}`}>
                  <link.icon className="w-4 h-4 md:w-6 md:h-6" />
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
