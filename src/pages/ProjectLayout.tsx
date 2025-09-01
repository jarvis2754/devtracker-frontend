import { Outlet } from "react-router-dom";
import ProjectDetails from "./ProjectDetails";

export default function ProjectLayout(){
    return(
        <section
                className="container d-flex justify-content-center flex-column "
                style={{ height: "100vh" }}
            >
                <div
                    className="container  m-auto"
                    style={{ width: "85%", height: "70%" }}
                >
                    <h1>Project 1</h1>
                    <ProjectDetails />
                    <Outlet/>
                    <div className="col-12" style={{ width: "100%", height: "100px" }}></div>
        
        
                </div>
        
        
            </section>
    )
}