import type { TeamMember } from "./ProjectTypes";
import type{CommentResponse} from "./CommentTypes";

export interface IssueRequest {
  id?: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignerId?: string ;
  projectId: number;
  reporterId?: string ;
  createdAt?: string;
  comments?: number[];
}

export interface IssueResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignerId?: TeamMember ;
  projectId: number;
  reporterId?: TeamMember ;
  createdAt: string;
  comments?: CommentResponse[];
}