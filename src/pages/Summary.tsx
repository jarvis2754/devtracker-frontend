export default function Summary() {
    const project ={
      projectId: 3,
      projectName: "Dev tracker",
      projectDesc: "A project to improve the user interface. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus est possimus voluptate tenetur atque voluptatum dolorem impedit repudiandae expedita, obcaecati illum fugit dolore cumque vel eos non, cupiditate in ex.",
      teamLeadId: 3,
      createdAt: new Date("2023-01-01"),
      deadLine: new Date("2023-12-31"),
      createdById:1,
      status: "Active",
      teamMembersIds: [
        3,2,1,4
      ],
    }
    return (
            <div className="m-3 ">
                <div className="row rounded shadow border-0 p-3">
                    <div className="col-12 col-md-2  p-2"><span className="fs-1">#{project.projectId} </span> </div>
                    <div className="col-12 col-md-7  p-2"><span className="fs-1"><b>{project.projectName}</b></span> </div>
                    <div className="col-12 col-md-3  d-flex align-items-center">Priority: <span className="rounded-pill bg-danger text-light px-3 py-1">High</span></div>
                    <div className="col-12 col-md-6 mt-3"><i>Created By: {project.createdById}</i></div>
                    <div className="col-12 col-md-6 mt-3"><i>Created at:{project.createdAt.toLocaleDateString()}</i></div>
                    <div className="col-12 p-4 mt-3"><p className="fs-6" style={{ textIndent: "3rem" }}>{project.projectDesc}</p></div>
                    <div className="col-12"><h5>Team Leader: <b>{project.teamLeadId}</b></h5></div>
                    <div className="col-12 mt-3">
                        <h6>Team Members</h6>
                        <ol className="mx-2">
                        {project.teamMembersIds.map((proj)=>( 
                            <li>{proj}</li>
                        )) }
                        </ol>
                    </div>

                    <div className="col-12 col-lg-6"><p className="fs-5"><i>Deadline: {project.deadLine.toLocaleDateString()}</i></p></div>
                    <div className="col-12 col-lg-6"><p className="fs-5"><i>Project Status: <span className="text-success"><b>{project.status}</b></span></i></p></div>



                </div>
            </div>
           );
}