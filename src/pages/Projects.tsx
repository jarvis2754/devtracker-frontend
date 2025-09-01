// import { Plus } from "lucide-react";
// import { useState } from "react";
// import Todo from "../components/Todo";

// const Projects: React.FC = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const project = [
//     {
//       projectId: 1,
//       projectName: "Project Alpha",
//       projectDesc: "A project to improve the user interface.",
//       teamLeadId: 1,
//       createdAt: new Date("2023-01-01"),
//       deadLine: new Date("2023-12-31"),
//       createdById:1,
//       status: "Active",
//       teamMembersIds: [
//         1,2
//       ],
//     },
//     {
//       projectId: 2,
//       projectName: "Project Beta",
//       projectDesc: "A project to improve the user interface.",
//       teamLeadId: 3,
//       createdAt: new Date("2023-01-01"),
//       deadLine: new Date("2023-12-31"),
//       createdById:1,
//       status: "In progress",
//       teamMembersIds: [
//         1,2
//       ],
//     },
//     {
//       projectId: 3,
//       projectName: "Project Gamma",
//       projectDesc: "A project to improve the user interface.",
//       teamLeadId: 3,
//       createdAt: new Date("2023-01-01"),
//       deadLine: new Date("2023-12-31"),
//       createdById:1,
//       status: "Active",
//       teamMembersIds: [
//         1,2
//       ],
//     },
    
//   ];
//   return (
//     <section>
//       <div
//         className="container row " >
//         <div className="col-12 col-md-6 col-lg-4 p-2">
//           <div className="bg-light card shadow border-dark p-3 w-100 h-100">
//             <h4>Create</h4>
//             <p>Click add to create your project</p>

//             <div className="d-flex justify-content-center mt-3">
//               <button
//                 className="btn btn-primary  rounded-pill"
//                 onClick={() => setShowPopup(true)}
//               >
//                 <Plus size={20} className="me-2" /> Add Project
//               </button>
//             </div>
//           </div>
//         </div>
//         {project.map((proj) => (
//           <div className=" col-12 col-md-6 col-lg-4 p-2 ">
//             <div
//               key={proj.projectId}
//               className=" bg-light card shadow border-0 p-3 w-100 h-100"
//             >
//               <h5 className="clamp-title ">{proj.projectName}</h5>
//               <p className="clamp-description">{proj.projectDesc}</p>
//               <p>
//                 <strong>Team Lead:</strong> {proj.teamLeadId}
//               </p>
//               <p>
//                 <strong>Status:</strong> {proj.status}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//       {showPopup && <Todo onClose={() => setShowPopup(false)} />}
//     </section>
//   );
// };
// export default Projects;
