// src/types/index.d.ts

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;      // Now `data` can be any type you specify
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
  id: string;
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

export enum MemberRole {
  OWNER = "OWNER",
  CONTRIBUTOR = "CONTRIBUTOR",
  VIEWER = "VIEWER",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string | null;
}

export interface Member {
  id: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  workspaceId: string;
  projectId?: string | null;
  user: User;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  profilePic?: string | null;
  createdAt?: string;
  updatedAt?: string;
  workspaceId: string;
  ownerId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  profilePic?: string | null;
  createdAt: string;
  members: Member[];
  projects: Project[];
}
