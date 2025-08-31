import ProjectDetails from "./ProjectDetails";

export default function ListTasks() {
    const issues = [
        {
            title: "field feature",
            description: "implement this feature",
            type: "BUG",
            status: "ACTIVE",
            priority: "CRITICAL",
            assignerId: 1,
            projectId: 1,
            id: 1,
            comments: [],
            reporterId: 1,
            createdAt: "2025-08-31T07:54:44.965+00:00"
        },
        {
            title: "field feature",
            description: "implement this feature",
            type: "BUG",
            status: "ACTIVE",
            priority: "CRITICAL",
            assignerId: 1,
            projectId: 1,
            id: 1,
            comments: [],
            reporterId: 1,
            createdAt: "2025-08-31T07:54:44.965+00:00"
        },
        {
            title: "field feature",
            description: "implement this feature",
            type: "BUG",
            status: "ACTIVE",
            priority: "CRITICAL",
            assignerId: 1,
            projectId: 1,
            id: 1,
            comments: [],
            reporterId: 1,
            createdAt: "2025-08-31T07:54:44.965+00:00"
        },
        {
            title: "field feature",
            description: "implement this feature",
            type: "BUG",
            status: "ACTIVE",
            priority: "CRITICAL",
            assignerId: 1,
            projectId: 1,
            id: 1,
            comments: [],
            reporterId: 1,
            createdAt: "2025-08-31T07:54:44.965+00:00"
        },
        {
            title: "field feature",
            description: "implement this feature",
            type: "BUG",
            status: "ACTIVE",
            priority: "CRITICAL",
            assignerId: 1,
            projectId: 1,
            id: 1,
            comments: [],
            reporterId: 1,
            createdAt: "2025-08-31T07:54:44.965+00:00"
        },
    ]
    return (
        <div className="">
            <ul className="list-unstyled">
                {issues.map((issue) => (
                    <li className=" rounded shadow px-3 py-4 px-md-3 py-md-2 m-2" style={{ backgroundColor: "#f5f5f5" }}>
                        <div className="row">
                            <div className=" col-12 col-md-10">
                                <div className="row ">
                                    <p className="col-12 col-md-10 fs-5"><b>[{issue.type}]</b> {issue.title}</p>
                                    <p className="col-12 col-md-2"><i>{issue.assignerId}</i></p>

                                </div>
                                <div className="row d-flex align-items-center">
                                    <h6 className="col-12 col-md-3">#{issue.id}</h6>
                                    <h6 className="col-12 col-md-4"><b>Status: {issue.status}</b></h6>
                                    <p className="col-12 col-md-3"><i>Opened:{issue.createdAt.substring(0,10)}</i></p>
                                </div>
                            </div>
                            <div className="col-12 col-md-2 d-flex align-items-center">
                                <div className="p-2 col-12 col-md-2 "><span className="text-light bg-danger rounded-pill p-2">{issue.priority}</span></div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>


        </div>
    );
}