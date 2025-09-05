// types/Project.ts
export interface TeamMember {
  uuid: string; // backend will assign
  userName?: string;
  position?: string;
  email?: string;
  userId?: number;

}

export interface Project {
  projectId: number; // backend will assign
  projectName: string;
  projectDesc: string;
  teamLeadId: string;
  createdAt?: string; // backend will assign
  deadline: string;
  createdById?: string;
  status: string;
  teamMemberIds: string[];
}
