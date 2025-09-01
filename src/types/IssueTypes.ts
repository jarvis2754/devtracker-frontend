export interface Issue {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignerId: number;
  projectId: number;
  reporterId: number;
  createdAt: string;
  comments: any[];
}