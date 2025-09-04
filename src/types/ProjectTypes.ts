// types/Project.ts
export interface TeamMember {
  id?: number; // backend will assign
  name: string;
  role: string;
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
  teamMembers: TeamMember[];
}
