// types/Project.ts
export interface TeamMember {
  id?: number; // backend will assign
  name: string;
  role: string;
}

export interface Project {
  projectId?: number; // backend will assign
  projectName: string;
  projectDesc: string;
  teamLead: string;
  createdAt?: string; // backend will assign
  deadLine: string;
  createdBy?: string;
  status: string;
  teamMembers: TeamMember[];


}
