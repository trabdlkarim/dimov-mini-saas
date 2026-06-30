export type ProjectStatus = "active" | "on hold" | "completed";

export type ProjectQueryParams = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  deadline: string;
  budget: number;
  team_member: number;
  description?: string;
};