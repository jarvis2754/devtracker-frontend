import { Link } from "react-router-dom";
import Tooltip from "../components/ui/Tooltip";
import "../components/ui/Tooltip.css";
import { ScrollText, Rows3, LayoutDashboard, Activity } from "lucide-react";


export default function () {
    const navlinks = [
        
        { path: "", label: "Summary", icon: ScrollText },
        { path: "listTasks", label: "List Tasks", icon: Rows3 },
        { path: "board", label: "Board", icon: LayoutDashboard },
        { path: "activities", label: "Activities", icon: Activity },

    ]
    return (

        <nav>
            <ul className="list-unstyled shadow d-inline-flex">
                {navlinks.map((link) => (
                    <div className="">
                        <li
                            key={link.path}
                            className={`position-relative  border-end p-3 `}
                        >
                            <div className="">
                                <Link
                                    to={link.path}
                                    className={`text-decoration-none d-none d-md-flex align-items-center gap-1 gap-md-2 `}
                                >
                                    <span className=" text-dark">{link.label}</span>
                                </Link>

                                <Tooltip
                                    text={link.label}
                                    mobilePosition="top"
                                    desktopPosition="right"
                                    className="d-flex d-md-none"
                                >
                                    <Link
                                        to={link.path}
                                        className={`d-flex align-items-center gap-1 gap-md-2 `}
                                    >
                                        <link.icon className="w-4 h-4 md:w-6 md:h-6 " />
                                    </Link>
                                </Tooltip>
                            </div>
                        </li>
                    </div>
                ))}
            </ul>


        </nav>

    )
}