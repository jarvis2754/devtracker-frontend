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
      className="container d-flex justify-content-center align-items-center flex-column z-3"
      style={{ height: "100vh" }}
    >
      <div className="container d-flex justify-content-center">
        <div
          className=" container d-flex flex-wrap gap-3 justify-content-center justify-content-md-between  "
          style={{ width: "950px" }}
        >
          <div className="card shadow border-0 p-3" style={{ width: "18rem" }}>
            <h4>Create new project</h4>
            <Plus size={100} className="mx-auto" />
          </div>
          {project.map((proj) => (
            <div
              key={proj.projectId}
              className="card shadow border-0 p-3"
              style={{ width: "18rem" }}
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
          ))}
        </div>
      </div>
    </section>
  );
}
