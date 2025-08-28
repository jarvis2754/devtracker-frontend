import { Plus } from "lucide-react";

export default function Home() {
  const project = [
    {
      projectId: 1,
      projectName: "Project Alpha",
      projectDesc: "A project to improve the user interface.",
      teamLead: "Alice Johnson",
      createdAt: new Date("2023-01-01"),
      deadLine: new Date("2023-12-31"),
      createdBy: "Alice Johnson",
      status: "In Progress",
      teamMembers: [
        { id: 1, name: "Bob Smith", role: "Developer" },
        { id: 2, name: "Charlie Brown", role: "Designer" },
      ],
    },
    {
      projectId: 2,
      projectName: "Project Beta",
      projectDesc: "A project to enhance the backend services.",
      teamLead: "Bob Smith",
      createdAt: new Date("2023-02-01"),
      deadLine: new Date("2023-12-31"),
      createdBy: "Alice Johnson",
      status: "In Progress",
      teamMembers: [
        { id: 1, name: "Bob Smith", role: "Developer" },
        { id: 2, name: "Charlie Brown", role: "Designer" },
      ],
    },
    {
      projectId: 3,
      projectName: "Project Gamma",
      projectDesc: "A project to improve the user interface.",
      teamLead: "Alice Johnson",
      createdAt: new Date("2023-01-01"),
      deadLine: new Date("2023-12-31"),
      createdBy: "Alice Johnson",
      status: "In Progress",
      teamMembers: [
        { id: 1, name: "Bob Smith", role: "Developer" },
        { id: 2, name: "Charlie Brown", role: "Designer" },
      ],
    },
    
    
  ];
  return (
    <section
      className="container d-flex justify-content-center z-2"
      style={{ height: "100vh" }}
    >
      <div className="container row " style={{width:"85%" , margin:"10%"}}>
        <div className="col-12 col-md-6 col-lg-4 p-2">
        <div className="bg-light card shadow-sm border-0 p-3 w-100 h-100" >
          <h4>Create</h4>
          <p>Click add to create your project</p>
          <Plus size={50} className="text-primary mx-auto" />
        </div>
        </div>
        {project.map((proj) => (
          <div className=" col-12 col-md-6 col-lg-4 p-2">
            <div key={proj.projectId}
            className=" bg-light card shadow-sm border-0 p-3 w-100 h-100"
            >
            <h5 className="clamp-title ">{proj.projectName}</h5>
            <p className="clamp-description">{proj.projectDesc}</p>
            <p>
              <strong>Team Lead:</strong> {proj.teamLead}
            </p>
            <p>
              <strong>Status:</strong> {proj.status}
            </p>
            </div>
          </div>
        ))}
        

      </div>
    </section>
  );
}
