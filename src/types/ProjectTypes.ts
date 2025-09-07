export interface TeamMember {
  uuid: string; // backend will assign
  userName?: string;
  position?: string;
  email?: string;
  userId?: number;
}

export interface ProjectRequest {
  projectId?: number; 
  projectName: string;
  projectDesc: string;
  teamLeadId: string; 
  deadline: string;
  createdById?: string; 
  status: string;
  teamMemberIds: string[]; 
}

export interface ProjectResponse {
  projectId: number;
  projectName: string;
  projectDesc: string;
  teamLeadId: TeamMember;
  createdAt?: string;
  deadline: string;
  createdById?: TeamMember;
  status: string;
  orgId?:number;
  teamMemberIds: TeamMember[]; 
}
