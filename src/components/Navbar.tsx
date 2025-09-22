import { Settings, CircleUserRound } from "lucide-react";
import Tooltip from "./ui/Tooltip";
import "./ui/Tooltip.css";
import SideNavbar from "./SideNavbar";
import { Outlet, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import UserProfile from "./UserProfile";
import ProjectSearch from "./ProjectSearch";

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);

  const dropdownRef = useRef<HTMLLIElement | null>(null);

  const navIcons = [
    { icon: Settings, label: "Settings", link: "/settings" },
    { icon: CircleUserRound, label: "Profile", isProfile: true },
  ];

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="d-flex border flex-column position-fixed z-2"
      style={{ width: "100vw", height: "30px" }}
    >
      <div className="d-flex bg-light justify-content-between shadow p-1">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <h2 className="text-dark mx-1 mx-md-3 fw-bolder">DevTracker.</h2>
        </div>

        {/* Search */}
        <div className="d-flex align-items-center justify-content-end gap-3 w-50 me-1">
          <ProjectSearch />
        </div>

        {/* Icons */}
        <div>
          <ul className="list-unstyled d-flex flex-row my-3 gap-1 gap-md-3 me-5">
            {navIcons.map((item, index) => (
              <li
                key={index}
                className="position-relative"
                ref={item.isProfile ? dropdownRef : null}
              >
                <Tooltip
                  text={item.label}
                  mobilePosition="bottom"
                  desktopPosition="bottom"
                >
                  {item.link ? (
                    <Link to={item.link} className="d-flex text-dark align-items-center gap-2 p-2">
                      <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                    </Link>
                  ) : (
                    <div
                      className="d-flex align-items-center gap-2 p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        item.isProfile ? setOpenProfile((prev) => !prev) : null
                      }
                    >
                      <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                  )}
                </Tooltip>

                {/* Profile Dropdown */}
                {item.isProfile && openProfile && (
                  <UserProfile onClose={() => setOpenProfile(false)} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Side Navbar */}
      <SideNavbar />

      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </nav>
  );
}
