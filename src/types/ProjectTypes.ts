export interface TeamMember {
  uuid: string; // backend will assign
  userName?: string;
  position?: string;
  email?: string;
  userId?: number;
}

// ---------- For creating/updating (send to backend) ----------
export interface ProjectRequest {
  projectId?: number; // optional for create
  projectName: string;
  projectDesc: string;
  teamLeadId: string; // only UUID
  deadline: string;
  createdById?: string; // only UUID
  status: string;
  teamMemberIds: string[]; // only UUIDs
}

// ---------- For reading (backend response) ----------
export interface ProjectResponse {
  projectId: number;
  projectName: string;
  projectDesc: string;
  teamLeadId: TeamMember; // full object
  createdAt?: string;
  deadline: string;
  createdById?: TeamMember;
  status: string;
  teamMemberIds: TeamMember[]; // full objects
}
