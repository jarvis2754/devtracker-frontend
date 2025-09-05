import type { TeamMember } from "./ProjectTypes";

export interface IssueRequest {
  id?: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignerId?: number ;
  projectId: number;
  reporterId?: number ;
  createdAt?: string;
  comments?: any[];
}

export interface IssueResponse {
  id?: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignerId?: TeamMember ;
  projectId: number;
  reporterId?: TeamMember ;
  createdAt: string;
  comments?: any[];
}