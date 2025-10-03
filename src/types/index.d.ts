export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: RazorpayOrdersResponse | p | object | null | string;
  errors: string[];
}


export enum TaskStatus {
  BACKLOG = "BACKLOG",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  TODO = "TODO",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}


export interface Task {
  id:string,
  task_name: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  projectId: string;
  assignments?: {
    userId: string;
    assignedAt?: string;
  }[];
}