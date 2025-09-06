import type { TeamMember } from "./ProjectTypes";

export interface CommentResponse{
  authorId:TeamMember;
  createdAt:string;
  id:number;
  content:string;
}

export interface CommentRequest{
  authorId?:number;
  createdAt?:string;
  id?:number;
  content:string;
}
