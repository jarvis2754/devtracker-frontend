import {

  Settings,
  CircleUserRound,
  Bell,
  Plus,
  Search,
} from "lucide-react";
import Tooltip from "./ui/Tooltip";
import "./ui/Tooltip.css";
import SideNavbar from "./SideNavbar";
import { Outlet } from "react-router-dom";

export default function Navbar() {

  const navIcons = [
    { icon: Settings, label: "Settings" },
    { icon: Bell, label: "Notifications" },
    { icon: CircleUserRound, label: "Profile" },
  ];

  const searchAndAdd = [
    { icon: Search, label: "Search" },
    { icon: Plus, label: "Create" },
  ];

  return (
    <nav
      className="d-flex border flex-column position-fixed z-2"
      style={{ width: "100vw" ,height:"30px"}}
    >
      <div className=" d-flex bg-light justify-content-between shadow p-1 ">
        <div className="d-flex align-items-center">
          <h2 className="text-dark mx-1 mx-md-3 fw-bolder ">DevTracker.</h2>
        </div>
        <div className="d-flex align-items-center   justify-content-end  gap-3 w-50 w-md-50 me-1">
          <input
            type="text"
            placeholder="Search..."
            className="d-none d-md-block rounded border border-dark py-2 px-3 w-100"
          />

          <button className="btn btn-primary d-none d-md-flex align-items-center ">
            <Plus size={16} /> Create
          </button>
          <ul className="list-unstyled d-flex d-md-none  my-auto gap-1">
            {searchAndAdd.map((item, index) => (
              <li key={index} className="">
                <Tooltip
                  text={item.label}
                  mobilePosition="bottom"
                  desktopPosition="bottom"
                >
                  <div className="d-flex align-items-center gap-2 p-2">
                    <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="list-unstyled d-flex flex-row my-3 gap-1 gap-md-3 me-5">
            {navIcons.map((item, index) => (
              <li key={index} className="position-relative  ">
                <Tooltip
                  text={item.label}
                  mobilePosition="bottom"
                  desktopPosition="bottom"
                >
                  <div className="d-flex align-items-center gap-2 p-2">
                    <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SideNavbar/>
      <main>
        <Outlet/>
      </main>
      
    </nav>
  );
}
